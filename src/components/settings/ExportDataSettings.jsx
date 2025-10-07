import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import jsPDF from 'jspdf'

export default function ExportDataSettings() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const exportData = async () => {
    setIsLoading(true)
    try {
      // Fetch user data - only transactions and budgets
      const [transactionsRes, budgetsRes] = await Promise.all([
        supabase
          .from('transactions')
          .select(`
            *,
            categories (
              name
            )
          `)
          .eq('user_id', user.id)
          .order('transaction_date', { ascending: false }),
        supabase
          .from('budgets')
          .select(`
            *,
            categories (
              name
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ])

      const transactions = transactionsRes.data || []
      const budgets = budgetsRes.data || []

      await exportToPDF(transactions, budgets)
      
    } catch (error) {
      console.error('Export error:', error)
      alert('Error exporting data')
    } finally {
      setIsLoading(false)
    }
  }

  // Format date consistently
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`
  }

  // Clean PDF Export with Totals
  const exportToPDF = async (transactions, budgets) => {
    try {
      const doc = new jsPDF()
      let yPosition = 20
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const margin = 20
      const lineHeight = 10
      const rowHeight = 8

      // Add header
      doc.setFontSize(20)
      doc.setTextColor(59, 130, 246)
      doc.text('FINANCE FLOW EXPORT', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += lineHeight

      doc.setFontSize(12)
      doc.setTextColor(128, 128, 128)
      doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 20

      // SUMMARY SECTION
      doc.setFontSize(16)
      doc.setTextColor(44, 62, 80)
      doc.text('FINANCIAL SUMMARY', margin, yPosition)
      yPosition += lineHeight

      // Calculate totals
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

      const netFlow = totalIncome - totalExpenses

      const totalBudgetAmount = budgets.reduce((sum, b) => sum + parseFloat(b.amount), 0)
      const totalSpent = budgets.reduce((sum, b) => sum + parseFloat(b.spent_amount || 0), 0)
      const totalRemaining = totalBudgetAmount - totalSpent

      // Summary stats
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      
      doc.text('Total Income:', margin + 2, yPosition + 6)
      doc.setTextColor(34, 197, 94)
      doc.text(`$${totalIncome.toFixed(2)}`, pageWidth - margin - 2, yPosition + 6, { align: 'right' })
      yPosition += 8

      doc.setTextColor(0, 0, 0)
      doc.text('Total Expenses:', margin + 2, yPosition + 6)
      doc.setTextColor(239, 68, 68)
      doc.text(`$${totalExpenses.toFixed(2)}`, pageWidth - margin - 2, yPosition + 6, { align: 'right' })
      yPosition += 8

      doc.setTextColor(0, 0, 0)
      doc.text('Net Flow:', margin + 2, yPosition + 6)
      doc.setTextColor(netFlow >= 0 ? 34 : 239, netFlow >= 0 ? 197 : 68, netFlow >= 0 ? 94 : 68)
      doc.text(`$${netFlow.toFixed(2)}`, pageWidth - margin - 2, yPosition + 6, { align: 'right' })
      yPosition += 8

      doc.setTextColor(0, 0, 0)
      doc.text('Total Budgets:', margin + 2, yPosition + 6)
      doc.text(`$${totalBudgetAmount.toFixed(2)}`, pageWidth - margin - 2, yPosition + 6, { align: 'right' })
      yPosition += 8

      doc.text('Total Spent:', margin + 2, yPosition + 6)
      doc.text(`$${totalSpent.toFixed(2)}`, pageWidth - margin - 2, yPosition + 6, { align: 'right' })
      yPosition += 8

      doc.text('Total Remaining:', margin + 2, yPosition + 6)
      doc.setTextColor(34, 197, 94)
      doc.text(`$${totalRemaining.toFixed(2)}`, pageWidth - margin - 2, yPosition + 6, { align: 'right' })
      yPosition += 15

      doc.setTextColor(0, 0, 0)

      // Transactions Section
      if (yPosition > pageHeight - 50) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(16)
      doc.setTextColor(44, 62, 80)
      doc.text('TRANSACTIONS', margin, yPosition)
      yPosition += lineHeight

      // Check if we have transactions
      if (transactions.length === 0) {
        doc.setFontSize(10)
        doc.setTextColor(128, 128, 128)
        doc.text('No transactions found', margin, yPosition)
        yPosition += 15
      } else {
        // Transactions table headers
        doc.setFontSize(10)
        doc.setTextColor(255, 255, 255)
        doc.setFillColor(59, 130, 246)
        doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F')
        
        doc.text('Date', margin + 2, yPosition + 6)
        doc.text('Description', margin + 30, yPosition + 6)
        doc.text('Category', margin + 80, yPosition + 6)
        doc.text('Type', margin + 120, yPosition + 6)
        doc.text('Amount', pageWidth - margin - 20, yPosition + 6, { align: 'right' })
        
        yPosition += 12

        // Transactions data
        doc.setTextColor(0, 0, 0)
        transactions.forEach((transaction, index) => {
          // Check if we need a new page
          if (yPosition > pageHeight - 30) {
            doc.addPage()
            yPosition = 20
          }

          // Alternate row colors
          const rowColor = index % 2 === 0 ? [249, 250, 251] : [255, 255, 255]
          doc.setFillColor(...rowColor)
          doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F')
          
          // Format data
          const formattedDate = formatDate(transaction.transaction_date)
          const description = transaction.description.length > 20 
            ? transaction.description.substring(0, 20) + '...' 
            : transaction.description
          const categoryName = transaction.categories?.name || 'Uncategorized'
          const amount = parseFloat(transaction.amount).toFixed(2)
          
          doc.setFontSize(8)
          doc.text(formattedDate, margin + 2, yPosition + 6)
          doc.text(description, margin + 30, yPosition + 6)
          doc.text(categoryName, margin + 80, yPosition + 6)
          
          // Color code type
          if (transaction.type === 'income') {
            doc.setTextColor(34, 197, 94)
            doc.text('Income', margin + 120, yPosition + 6)
          } else {
            doc.setTextColor(239, 68, 68)
            doc.text('Expense', margin + 120, yPosition + 6)
          }
          doc.setTextColor(0, 0, 0)
          
          // Amount
          doc.text(`$${amount}`, pageWidth - margin - 2, yPosition + 6, { align: 'right' })
          
          yPosition += 10
        })

        // Transactions Total
        yPosition += 5
        doc.setFillColor(243, 244, 246)
        doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F')
        doc.setFontSize(9)
        doc.setTextColor(0, 0, 0)
        doc.setFont(undefined, 'bold')
        doc.text('Transactions Total:', margin + 2, yPosition + 6)
        doc.text(`$${(totalIncome + totalExpenses).toFixed(2)}`, pageWidth - margin - 2, yPosition + 6, { align: 'right' })
        doc.setFont(undefined, 'normal')
        yPosition += 15
      }

      // Budgets Section
      if (yPosition > pageHeight - 50) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(16)
      doc.setTextColor(44, 62, 80)
      doc.text('BUDGETS', margin, yPosition)
      yPosition += lineHeight

      // Check if we have budgets
      if (budgets.length === 0) {
        doc.setFontSize(10)
        doc.setTextColor(128, 128, 128)
        doc.text('No budgets found', margin, yPosition)
      } else {
        // Budgets table headers
        doc.setFontSize(10)
        doc.setTextColor(255, 255, 255)
        doc.setFillColor(59, 130, 246)
        doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F')
        
        doc.text('Category', margin + 2, yPosition + 6)
        doc.text('Budget Amount', margin + 60, yPosition + 6)
        doc.text('Period', margin + 110, yPosition + 6)
        doc.text('Spent', margin + 140, yPosition + 6)
        doc.text('Remaining', pageWidth - margin - 20, yPosition + 6, { align: 'right' })
        
        yPosition += 12

        // Budgets data
        doc.setTextColor(0, 0, 0)
        budgets.forEach((budget, index) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage()
            yPosition = 20
          }

          // Alternate row colors
          const rowColor = index % 2 === 0 ? [249, 250, 251] : [255, 255, 255]
          doc.setFillColor(...rowColor)
          doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F')
          
          doc.setFontSize(8)
          doc.text(budget.categories?.name || 'Uncategorized', margin + 2, yPosition + 6)
          
          const amount = parseFloat(budget.amount).toFixed(2)
          const spent = parseFloat(budget.spent_amount || 0).toFixed(2)
          const remaining = (parseFloat(budget.amount) - parseFloat(budget.spent_amount || 0)).toFixed(2)
          
          doc.text(`$${amount}`, margin + 60, yPosition + 6)
          doc.text(budget.period, margin + 110, yPosition + 6)
          doc.text(`$${spent}`, margin + 140, yPosition + 6)
          doc.text(`$${remaining}`, pageWidth - margin - 2, yPosition + 6, { align: 'right' })
          
          yPosition += 10
        })

        // Budgets Total
        yPosition += 5
        doc.setFillColor(243, 244, 246)
        doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F')
        doc.setFontSize(9)
        doc.setTextColor(0, 0, 0)
        doc.setFont(undefined, 'bold')
        doc.text('Budgets Total:', margin + 2, yPosition + 6)
        doc.text(`$${totalBudgetAmount.toFixed(2)}`, pageWidth - margin - 2, yPosition + 6, { align: 'right' })
      }

      // Save the PDF
      doc.save(`finance-flow-export-${new Date().toISOString().split('T')[0]}.pdf`)
      alert('Financial data exported to PDF successfully!')
    } catch (error) {
      console.error('PDF export error:', error)
      alert('Error exporting to PDF')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Export Data</h2>
      
      <div className="space-y-6">
        <p className="text-gray-600">
          Export your transactions and budgets as a professional PDF report with financial summaries.
        </p>
        
        <Card className="p-4 sm:p-6 text-center border-2 border-dashed border-gray-200 hover:border-primary-300 transition-colors max-w-[30rem] mx-auto">
          <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">PDF Export</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Export your financial data with totals and summaries in a professional PDF format.
            </p>
            <Button
              onClick={exportData}
              disabled={isLoading}
              className="btn btn-primary w-full flex items-center justify-center gap-2 py-2 sm:py-2.5"
            >
              <Download className="h-4 w-4 flex-shrink-0" />
              <span className="flex-shrink-0">
                {isLoading ? 'Exporting...' : 'Export as PDF'}
              </span>
            </Button>
          </Card>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800"> 
            <strong>Note:</strong> Your exported PDF contains sensitive financial information. 
            Keep this file secure and do not share it with unauthorized parties.
          </p>
        </div>

        {/* What's Included */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">What's Included</h4>
          <ul className="text-xs sm:text-sm text-blue-800 space-y-1 leading-relaxed">
            <li>• <strong>Financial Summary:</strong> Income, expenses, net flow, budget overview</li>
            <li>• <strong>All Transactions:</strong> Date, description, category, type, amount</li>
            <li>• <strong>All Budgets:</strong> Category, budget amount, period, spent, remaining</li>
            <li>• <strong>Transaction & Budget Totals</strong></li>
            <li>• <strong>Mobile-optimized layout</strong> for easy reading</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}