import { motion } from 'framer-motion'
import Card from '../ui/Card'

export default function TransactionSummary({ stats, transactions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats.transactionCount}</p>
            <p className="text-sm text-gray-600 mt-1">Total Transactions</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {transactions.filter(t => t.type === 'income').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Income Transactions</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {transactions.filter(t => t.type === 'expense').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Expense Transactions</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}