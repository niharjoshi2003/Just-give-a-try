import React, { useState } from 'react';
import { Printer, FileText, Receipt } from 'lucide-react';

const Billing = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    copies: '',
    paperSize: '',
    printType: '',
    price: '',
    paymenttype: '',
    additionalService: ''
  });

  // Sample last bill data - in real app, this would come from your backend
  const lastBill = {
    id: "10001",
    customerName: "Nihar Joshi",
    copies: 11,
    paperSize: "A4",
    printType: "Black & White",
    price: 75,
    timestamp: "2025-02-18 14:30"
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* New Bill Section */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-lg h-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                New Bill
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <input
                    id="customerName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter customer name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="copies" className="block text-sm font-medium text-gray-700">
                      Number of Copies
                    </label>
                    <input
                      id="copies"
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter quantity"
                      value={formData.copies}
                      onChange={(e) => setFormData({...formData, copies: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Paper Size
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-1">
                        <input
                          type="radio"
                          name="paperSize"
                          value="A4"
                          checked={formData.paperSize === "A4"}
                          onChange={(e) => setFormData({...formData, paperSize: e.target.value})}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span>A4</span>
                      </label>
                      <label className="flex items-center space-x-1">
                        <input
                          type="radio"
                          name="paperSize"
                          value="A3"
                          checked={formData.paperSize === "A3"}
                          onChange={(e) => setFormData({...formData, paperSize: e.target.value})}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span>A3</span>
                      </label>
                      <label className="flex items-center space-x-1">
                        <input
                          type="radio"
                          name="paperSize"
                          value="Legal"
                          checked={formData.paperSize === "Legal"}
                          onChange={(e) => setFormData({...formData, paperSize: e.target.value})}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span>Legal</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Print Type
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-1">
                        <input
                          type="radio"
                          name="printservice"
                          value="Black and White"
                          checked={formData.printType === "Black and White"}
                          onChange={(e) => setFormData({...formData, printType: e.target.value})}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span>Black & White</span>
                      </label>
                      <label className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name="printservice"
                          value="Color"
                          checked={formData.printType === "Color"}
                          onChange={(e) => setFormData({...formData, printType: e.target.value})}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span>Color</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price (₹)
                    </label>
                    <input
                      id="price"
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Service
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-1">
                        <input
                          type="radio"
                          name="additionalService"
                          value="yes"
                          checked={formData.additionalService === "yes"}
                          onChange={(e) => setFormData({...formData, additionalService: e.target.value})}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name="additionalService"
                          value="no"
                          checked={formData.additionalService === "no"}
                          onChange={(e) => setFormData({...formData, additionalService: e.target.value})}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Type
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-1">
                        <input
                          type="radio"
                          name="paymentType"
                          value="Cash"
                          checked={formData.paymenttype === "Cash"}
                          onChange={(e) => setFormData({...formData, paymenttype: e.target.value})}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span>Cash</span>
                      </label>
                      <label className="flex items-center space-x-1">
                        <input
                          type="radio"
                          name="paymentType"
                          value="UPI"
                          checked={formData.paymenttype === "UPI"}
                          onChange={(e) => setFormData({...formData, paymenttype: e.target.value})}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span>UPI</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Generate Bill
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Last Bill Section */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-lg h-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Last Bill Details
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">Bill ID:</span>
                  <span>{lastBill.id}</span>
                </div>
                <div className="flex justify-between items-center p-2">
                  <span className="font-medium">Customer:</span>
                  <span>{lastBill.customerName}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">Copies:</span>
                  <span>{lastBill.copies}</span>
                </div>
                <div className="flex justify-between items-center p-2">
                  <span className="font-medium">Paper Size:</span>
                  <span>{lastBill.paperSize}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">Print Type:</span>
                  <span>{lastBill.printType}</span>
                </div>
                <div className="flex justify-between items-center p-2">
                  <span className="font-medium">Price:</span>
                  <span>₹{lastBill.price}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">Time:</span>
                  <span>{lastBill.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;