import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Info, ListChecks } from 'lucide-react'
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
      const [transactionsRes, budgetsRes] = await Promise.all([
        supabase
          .from('transactions')
          .select(
            `*,
            categories (
              name
            )
          `
          )
          .eq('user_id', user.id)
          .order('transaction_date', { ascending: false }),
        supabase
          .from('budgets')
          .select(
            `*,
            categories (
              name
            )
          `
          )
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
      .getDate()
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`
  }

  const exportToPDF = async (transactions, budgets) => {
    try {
      const doc = new jsPDF()
      let yPosition = 20
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const margin = 20
      const lineHeight = 10
      const rowHeight = 8

      doc.setFontSize(20)
      doc.setTextColor(34, 184, 95)
      doc.text('FINANCE FLOW EXPORT', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += lineHeight

      doc.setFontSize(12)
      doc.setTextColor(128, 128, 128)
      doc.text(
        `Generated on ${new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`,
        pageWidth / 2,
        yPosition,
        { align: 'center' }
      )
      yPosition += 20

      doc.setFontSize(16)
      doc.setTextColor(44, 62, 80)
      doc.text('FINANCIAL SUMMARY', margin, yPosition)
      yPosition += lineHeight

      const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

      const totalExpenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

      const netFlow = totalIncome - totalExpenses

      const totalBudgetAmount = budgets.reduce((sum, b) => sum + parseFloat(b.amount), 0)
      const totalSpent = budgets.reduce((sum, b) => sum + parseFloat(b.spent_amount || 0), 0)
      const totalRemaining = totalBudgetAmount - totalSpent

      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)

      doc.text('Total Income:', margin + 2, yPosition + 6)
      doc.setTextColor(34, 197, 94)
      doc.text(`$${totalIncome.toFixed(2)}`, pageWidth - margin - 2, yPosition + 6, {
        align: 'right',
      })
      yPosition += 8

      doc.setTextColor(0, 0, 0)
      doc.text('Total Expenses:', margin + 2, yPosition + 6)
      doc.setTextColor(239, 68, 68)
      doc.text(`$${totalExpenses.toFixed(2)}`, pageWidth - margin - 2, yPosition + 6, {
        align: 'right',
      })
      yPosition += 8

      doc.setTextColor(0, 0, 0)
      doc.text('Net Flow:', margin + 2, yPosition + 6)
      doc.setTextColor(
        netFlow >= 0 ? 34 : 239,
        netFlow >= 0 ? 197 : 68,
        netFlow >= 0 ? 94 : 68
      )
      doc.text(`$${netFlow.toFixed(2)}`, pageWidth - margin - 2, yPosition + 6, { align: 'right' })
      yPosition += 8

      doc.setTextColor(0, 0, 0)
      doc.text('Total Budgets:', margin + 2, yPosition + 6)
      doc.text(`$${totalBudgetAmount.toFixed(2)}`, pageWidth - margin - 2, yPosition + 6, {
        align: 'right',
      })
      yPosition += 8

      doc.text('Total Spent:', margin + 2, yPosition + 6)
      doc.text(`$${totalSpent.toFixed(2)}`, pageWidth - margin - 2, yPosition + 6, {
        align: 'right',
      })
      yPosition += 8

      doc.text('Total Remaining:', margin + 2, yPosition + 6)
      doc.setTextColor(34, 197, 94)
      doc.text(`$${totalRemaining.toFixed(2)}`, pageWidth - margin - 2, yPosition + 6, {
        align: 'right',
      })
      yPosition += 15

      doc.setTextColor(0, 0, 0)

      if (yPosition > pageHeight - 50) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(16)
      doc.setTextColor(44, 62, 80)
      doc.text('TRANSACTIONS', margin, yPosition)
      yPosition += lineHeight

      if (transactions.length === 0) {
        doc.setFontSize(10)
        doc.setTextColor(128, 128, 128)
        doc.text('No transactions found', margin, yPosition)
        yPosition += 15
      } else {
        doc.setFontSize(10)
        doc.setTextColor(255, 255, 255)
        doc.setFillColor(34, 184, 95)
        doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F')

        doc.text('Date', margin + 2, yPosition + 6)
        doc.text('Description', margin + 30, yPosition + 6)
        doc.text('Category', margin + 80, yPosition + 6)
        doc.text('Type', margin + 120, yPosition + 6)
        doc.text('Amount', pageWidth - margin - 20, yPosition + 6, { align: 'right' })

        yPosition += 12

        doc.setTextColor(0, 0, 0)
        transactions.forEach((transaction, index) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage()
            yPosition = 20
          }

          const rowColor = index % 2 === 0 ? [249, 250, 251] : [255, 255, 255]
          doc.setFillColor(...rowColor)
          doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F')

          const formattedDate = formatDate(transaction.transaction_date)
          const description =
            transaction.description.length > 20
              ? transaction.description.substring(0, 20) + '...'
              : transaction.description
          const categoryName = transaction.categories?.name || 'Uncategorized'
          const amount = parseFloat(transaction.amount).toFixed(2)

          doc.setFontSize(8)
          doc.text(formattedDate, margin + 2, yPosition + 6)
          doc.text(description, margin + 30, yPosition + 6)
          doc.text(categoryName, margin + 80, yPosition + 6)

          if (transaction.type === 'income') {
            doc.setTextColor(34, 197, 94)
            doc.text('Income', margin + 120, yPosition + 6)
          } else {
            doc.setTextColor(239, 68, 68)
            doc.text('Expense', margin + 120, yPosition + 6)
          }
          doc.setTextColor(0, 0, 0)

          doc.text(`$${amount}`, pageWidth - margin - 2, yPosition + 6, { align: 'right' })

          yPosition += 10
        })

        yPosition += 5
        doc.setFillColor(243, 244, 246)
        doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F')
        doc.setFontSize(9)
        doc.setTextColor(0, 0, 0)
        doc.setFont(undefined, 'bold')
        doc.text('Transactions Total:', margin + 2, yPosition + 6)
        doc.text(
          `$${(totalIncome + totalExpenses).toFixed(2)}`,
          pageWidth - margin - 2,
          yPosition + 6,
          { align: 'right' }
        )
        doc.setFont(undefined, 'normal')
        yPosition += 15
      }

      if (yPosition > pageHeight - 50) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(16)
      doc.setTextColor(44, 62, 80)
      doc.text('BUDGETS', margin, yPosition)
      yPosition += lineHeight

      if (budgets.length === 0) {
        doc.setFontSize(10)
        doc.setTextColor(128, 128, 128)
        doc.text('No budgets found', margin, yPosition)
      } else {
        doc.setFontSize(10)
        doc.setTextColor(255, 255, 255)
        doc.setFillColor(34, 184, 95)
        doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F')

        doc.text('Category', margin + 2, yPosition + 6)
        doc.text('Budget Amount', margin + 60, yPosition + 6)
        doc.text('Period', margin + 110, yPosition + 6)
        doc.text('Spent', margin + 140, yPosition + 6)
        doc.text('Remaining', pageWidth - margin - 20, yPosition + 6, { align: 'right' })

        yPosition += 12

        doc.setTextColor(0, 0, 0)
        budgets.forEach((budget, index) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage()
            yPosition = 20
          }

          const rowColor = index % 2 === 0 ? [249, 250, 251] : [255, 255, 255]
          doc.setFillColor(...rowColor)
          doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F')

          doc.setFontSize(8)
          doc.text(budget.categories?.name || 'Uncategorized', margin + 2, yPosition + 6)

          const amount = parseFloat(budget.amount).toFixed(2)
          const spent = parseFloat(budget.spent_amount || 0).toFixed(2)
          const remaining = (
            parseFloat(budget.amount) - parseFloat(budget.spent_amount || 0)
          ).toFixed(2)

          doc.text(`$${amount}`, margin + 60, yPosition + 6)
          doc.text(budget.period, margin + 110, yPosition + 6)
          doc.text(`$${spent}`, margin + 140, yPosition + 6)
          doc.text(`$${remaining}`, pageWidth - margin - 2, yPosition + 6, { align: 'right' })

          yPosition += 10
        })

        yPosition += 5
        doc.setFillColor(243, 244, 246)
        doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F')
        doc.setFontSize(9)
        doc.setTextColor(0, 0, 0)
        doc.setFont(undefined, 'bold')
        doc.text('Budgets Total:', margin + 2, yPosition + 6)
        doc.text(
          `$${totalBudgetAmount.toFixed(2)}`,
          pageWidth - margin - 2,
          yPosition + 6,
          { align: 'right' }
        )
      }

      doc.save(`finance-flow-export-${new Date().toISOString().split('T')[0]}.pdf`)
      alert('Financial data exported to PDF successfully!')
    } catch (error) {
      console.error('PDF export error:', error)
      alert('Error exporting to PDF')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-ink">Export data</h2>
        <p className="mt-1 text-xs font-mono uppercase tracking-wider text-ink-faint">
          take it with you
        </p>
      </div>

      <div className="space-y-6">
        <p className="text-sm text-ink-mute">
          Export your transactions and budgets as a professional PDF report with financial
          summaries.
        </p>

        <Card className="mx-auto max-w-sm p-8 text-center transition-colors duration-300 hover:border-money-500/30">
          <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-canvas-soft">
            <FileText className="h-5 w-5 text-ink-mute" />
          </span>
          <h3 className="mb-1 font-display text-lg font-semibold text-ink">PDF export</h3>
          <p className="mb-5 text-sm text-ink-mute">
            Export your financial data with totals and summaries in a professional PDF format.
          </p>
          <Button onClick={exportData} disabled={isLoading} className="w-full">
            <Download className="h-4 w-4" />
            {isLoading ? 'Exporting…' : 'Export as PDF'}
          </Button>
        </Card>

        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <p className="text-sm text-amber-200/80">
            <strong>Note:</strong> Your exported PDF contains sensitive financial information.
            Keep this file secure and do not share it with unauthorized parties.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-canvas-soft p-5">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-ink">
            <ListChecks className="h-4 w-4 text-money-400" />
            What&rsquo;s included
          </h4>
          <ul className="space-y-1.5 text-sm text-ink-mute">
            <li className="flex gap-2">
              <span className="text-money-400">—</span> Financial summary: income, expenses, net flow, budget overview
            </li>
            <li className="flex gap-2">
              <span className="text-money-400">—</span> All transactions: date, description, category, type, amount
            </li>
            <li className="flex gap-2">
              <span className="text-money-400">—</span> All budgets: category, amount, period, spent, remaining
            </li>
            <li className="flex gap-2">
              <span className="text-money-400">—</span> Transaction &amp; budget totals
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
