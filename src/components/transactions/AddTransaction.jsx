import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../ui/Button'
import { supabase } from '../../lib/supabase'

export default function AddTransaction({ onTransactionAdded, label = 'Add transaction' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category_id: '',
    type: 'expense',
    transaction_date: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    if (isOpen && user && categories.length === 0) fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const filteredCategories = categories.filter((category) => {
    if (formData.type === 'income') {
      return (
        category.name.toLowerCase().includes('income') ||
        category.name.toLowerCase().includes('salary')
      )
    }
    return (
      !category.name.toLowerCase().includes('income') &&
      !category.name.toLowerCase().includes('salary')
    )
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.category_id) return alert('Please select a category')
    if (!formData.amount || parseFloat(formData.amount) <= 0) return alert('Please enter a valid amount')

    setLoading(true)
    try {
      const { error } = await supabase.from('transactions').insert([
        {
          ...formData,
          user_id: user.id,
          amount: Math.abs(parseFloat(formData.amount)),
        },
      ])
      if (error) throw error
      handleClose()
      if (onTransactionAdded) onTransactionAdded()
    } catch (error) {
      console.error('Error adding transaction:', error)
      alert('Error adding transaction: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { category_id: '' }),
    }))
  }

  const handleClose = () => {
    setIsOpen(false)
    setFormData({
      amount: '',
      description: '',
      category_id: '',
      type: 'expense',
      transaction_date: new Date().toISOString().split('T')[0],
    })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="group/btn">
        <Plus className="h-4 w-4" />
        {label}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-canvas-deep/80 p-4 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-line bg-canvas-card shadow-pop"
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink">Add transaction</h2>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-ink-faint">
                    ledger entry
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-lg p-1.5 text-ink-mute transition-colors hover:bg-canvas-soft hover:text-ink"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                <div className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-canvas-soft p-1">
                  {['expense', 'income'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, type, category_id: '' }))
                      }
                      className={`rounded-lg py-2 text-xs font-pixel uppercase tracking-wide transition-all duration-200 ${
                        formData.type === type
                          ? type === 'income'
                            ? 'bg-money-500/15 text-money-400'
                            : 'bg-amber-500/15 text-amber-300'
                          : 'text-ink-faint hover:text-ink-mute'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      className="input tabular"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="label">Date</label>
                    <input
                      type="date"
                      name="transaction_date"
                      value={formData.transaction_date}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="e.g. Grocery run"
                  />
                </div>

                <div>
                  <label className="label">Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    disabled={loadingCategories}
                    className="input"
                  >
                    <option value="">Select a category</option>
                    {filteredCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {loadingCategories && (
                    <p className="mt-1.5 text-xs text-ink-faint">Loading categories…</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={handleClose} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading || loadingCategories}>
                    {loading ? 'Adding…' : 'Add transaction'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
