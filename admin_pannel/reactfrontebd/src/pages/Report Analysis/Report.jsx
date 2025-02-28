import React from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import PaymentMethods from "./PaymentChart";

const dailyData = [
  { time: "12am", amount: 900 },
  { time: "3am", amount: 1000 },
  { time: "6am", amount: 1200 },
  { time: "9am", amount: 3500 },
  { time: "12pm", amount: 3000 },
  { time: "3pm", amount: 4500 },
  { time: "6pm", amount: 4000 },
  { time: "9pm", amount: 3500 },
  { time: "12am", amount: 2800 },
];

const weeklyData = [
  { time: "Mon", amount: 15000 },
  { time: "Tue", amount: 18000 },
  { time: "Wed", amount: 22000 },
  { time: "Thu", amount: 25000 },
  { time: "Fri", amount: 32000 },
  { time: "Sat", amount: 38000 },
  { time: "Sun", amount: 28000 },
];

const monthlyData = [
  { time: "Week 1", amount: 120000 },
  { time: "Week 2", amount: 150000 },
  { time: "Week 3", amount: 180000 },
  { time: "Week 4", amount: 220000 },
];

function Report({ period }) {
  const getData = () => {
    switch (period) {
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Sales Performance</h2>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={getData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={{ stroke: "#888888" }} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#888888" }}
              tickFormatter={(value) => `₹${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "4px" }}
              formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366F1" // Tailwind 'indigo-500' color
              strokeWidth={2}
              dot={{ r: 4, fill: "#6366F1" }}
              activeDot={{ r: 6, fill: "#6366F1" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <PaymentMethods/>
    </div>
  );
}

export default Report;
