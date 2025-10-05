import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { supabase } from '../../lib/supabase'

export default function AddTransaction({ onTransactionAdded }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category_id: '',
    type: 'expense',
    transaction_date: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  
  const { user } = useAuth()

  // Fetch categories only when modal opens
  useEffect(() => {
    if (isOpen && user && categories.length === 0) {
      fetchCategories()
    }
  }, [isOpen, user])

  const fetchCategories = async () => {
    setLoadingCategories(true)
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  // Filter categories based on transaction type
  const filteredCategories = categories.filter(category => {
    if (formData.type === 'income') {
      return category.name.toLowerCase().includes('income') || 
             category.name.toLowerCase().includes('salary')
    } else {
      return !category.name.toLowerCase().includes('income') && 
             !category.name.toLowerCase().includes('salary')
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.category_id) {
      alert('Please select a category')
      return
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('transactions')
        .insert([
          {
            ...formData,
            user_id: user.id,
            amount: Math.abs(parseFloat(formData.amount))
          }
        ])

      if (error) throw error
      
      // Close modal and reset form
      setIsOpen(false)
      setFormData({
        amount: '',
        description: '',
        category_id: '',
        type: 'expense',
        transaction_date: new Date().toISOString().split('T')[0]
      })
      
      // Trigger parent refetch if callback provided
      if (onTransactionAdded) {
        onTransactionAdded()
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
      alert('Error adding transaction: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === 'type' && { category_id: '' })
    }))
  }

  const handleClose = () => {
    setIsOpen(false)
    setFormData({
      amount: '',
      description: '',
      category_id: '',
      type: 'expense',
      transaction_date: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2"
      >
        <Plus className="h-4 w-4" />
        <span>Add Transaction</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Transaction</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    disabled={loadingCategories}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  >
                    <option value="">Select a category</option>
                    {filteredCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {loadingCategories && (
                    <p className="text-sm text-gray-500 mt-1">Loading categories...</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="transaction_date"
                    value={formData.transaction_date}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading || loadingCategories}
                  >
                    {loading ? 'Adding...' : 'Add Transaction'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}