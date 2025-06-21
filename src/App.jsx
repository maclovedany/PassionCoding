import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import calculators from "./data/calculators";

// 계산기 컴포넌트들
import StockAverageCalculator from "./components/calculators/StockAverageCalculator";
import LotteryCalculator from "./components/calculators/LotteryCalculator";
import SalaryCalculator from "./components/calculators/SalaryCalculator";
import MortgageCalculator from "./components/calculators/MortgageCalculator";
import DiscountCalculator from "./components/calculators/DiscountCalculator";
import BMICalculator from "./components/calculators/BMICalculator";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const calculatorComponents = {
    "stock-average": StockAverageCalculator,
    lottery: LotteryCalculator,
    salary: SalaryCalculator,
    mortgage: MortgageCalculator,
    discount: DiscountCalculator,
    bmi: BMICalculator,
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          calculators={calculators}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
            <Routes>
              <Route path="/" element={<Navigate to="/calc/stock-average" />} />
              {Object.keys(calculatorComponents).map((key) => {
                const Component = calculatorComponents[key];
                return (
                  <Route
                    key={key}
                    path={`/calc/${key}`}
                    element={<Component />}
                  />
                );
              })}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
