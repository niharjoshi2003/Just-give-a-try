import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Slidebar from "./pages/Slidebar/Slidebar";
import Billing from "./pages/Add New Bill/Bill";
import Header from "./pages/Header/Header";
import Report from "./pages/Report Analysis/Report"
import PaymentHistory from "./pages/Billing and Payment/Billing";
function App() {
  return (
    <Router>
      <div className="flex flex-col h-dvh">
        <div className="flex flex-1">
          {/* Sidebar */}
          <Slidebar />

          {/* Main Content */}
          <main className="flex-1 flex flex-col max-h-dvh bg-gray-100 px-4 overflow-auto">
            <Header />

            <div className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Billing />} />
                <Route path="/report" element={<Report />} />
                <Route path="/billing" element={<PaymentHistory/>} />

                

              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
