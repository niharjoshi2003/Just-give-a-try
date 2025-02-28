import React, { useState } from 'react';
import { format } from 'date-fns';

// Sample data
const initialTransactions = [
  {
    id: "001",
    tableId: "T001",
    tableNumber: "5",
    amount: 50.0,
    paymentMode: "Cash",
    status: "Success",
    date: "2023-05-01T12:30:00",
    cashAmount: 50.0,
    onlineAmount: 0,
  },
  {
    id: "002",
    tableId: "T002",
    tableNumber: "3",
    amount: 75.5,
    paymentMode: "Online",
    status: "Success",
    date: "2023-05-01T13:45:00",
    cashAmount: 0,
    onlineAmount: 75.5,
  },
  {
    id: "003",
    tableId: "T003",
    tableNumber: "7",
    amount: 120.0,
    paymentMode: "Mixed",
    status: "Pending",
    date: "2023-05-01T14:20:00",
    cashAmount: 70.0,
    onlineAmount: 50.0,
  }
];

const PaymentHistory = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [bookmarkedPayments, setBookmarkedPayments] = useState([]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = Object.values(transaction).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesPaymentMethod = paymentMethod === "all" || transaction.paymentMode === paymentMethod;
    return matchesSearch && matchesPaymentMethod;
  });

  const handleEditSubmit = (updatedData) => {
    setTransactions(prev => 
      prev.map(t => t.id === editingTransaction.id ? { ...t, ...updatedData } : t)
    );
    setShowEditModal(false);
  };

  const handleRefund = (id) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, status: "Refunded" } : t)
    );
    setShowRefundModal(false);
  };

  const toggleBookmark = (id) => {
    setBookmarkedPayments(prev =>
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search transactions..."
          className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="all">All Methods</option>
          <option value="Cash">Cash</option>
          <option value="Online">Online</option>
          <option value="Mixed">Mixed</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{transaction.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.tableNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">${transaction.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>{transaction.paymentMode}</div>
                  {transaction.paymentMode === "Mixed" && (
                    <div className="text-xs text-gray-500">
                      Cash: ${transaction.cashAmount.toFixed(2)} | Online: ${transaction.onlineAmount.toFixed(2)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    transaction.status === "Success" ? "bg-green-100 text-green-800" :
                    transaction.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    transaction.status === "Refunded" ? "bg-blue-100 text-blue-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(transaction.date), "yyyy-MM-dd HH:mm")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setEditingTransaction(transaction);
                      setShowEditModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setEditingTransaction(transaction);
                      setShowRefundModal(true);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Refund
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Payment</h2>
            <EditPaymentForm
              transaction={editingTransaction}
              onSave={handleEditSubmit}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Issue Refund</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Refund Amount</label>
                <input
                  type="number"
                  className="mt-1 block w-full px-3 py-2 border rounded-md"
                  defaultValue={editingTransaction?.amount}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRefund(editingTransaction.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Issue Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EditPaymentForm = ({ transaction, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    paymentMode: transaction.paymentMode,
    amount: transaction.amount,
    cashAmount: transaction.cashAmount,
    onlineAmount: transaction.onlineAmount,
    status: transaction.status
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
        <select
          name="paymentMode"
          value={formData.paymentMode}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md"
        >
          <option value="Cash">Cash</option>
          <option value="Online">Online</option>
          <option value="Mixed">Mixed</option>
        </select>
      </div>

      {formData.paymentMode === "Mixed" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cash Amount</label>
            <input
              type="number"
              name="cashAmount"
              value={formData.cashAmount}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Online Amount</label>
            <input
              type="number"
              name="onlineAmount"
              value={formData.onlineAmount}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md"
        >
          <option value="Success">Success</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(formData)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save changes
        </button>
      </div>
    </div>
  );
};

export default PaymentHistory;