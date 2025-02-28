
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Online", value: 82, color: "#3b82f6" }, // Tailwind 'blue-500'
  { name: "Offline", value: 18, color: "#10b981" }, // Tailwind 'green-500'
];

export function PaymentMethods() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Payment Share</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "4px" }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PaymentMethods;
