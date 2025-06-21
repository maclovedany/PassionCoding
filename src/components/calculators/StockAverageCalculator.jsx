import { useState } from "react";
import { Plus, Minus, Calculator, Copy, Share } from "lucide-react";

const StockAverageCalculator = () => {
  const [existingHoldings, setExistingHoldings] = useState({
    shares: "",
    price: "",
  });

  const [transactions, setTransactions] = useState([
    { shares: "", price: "", type: "buy" },
  ]);

  const [result, setResult] = useState(null);

  const addTransaction = () => {
    setTransactions([...transactions, { shares: "", price: "", type: "buy" }]);
  };

  const removeTransaction = (index) => {
    if (transactions.length > 1) {
      setTransactions(transactions.filter((_, i) => i !== index));
    }
  };

  const updateTransaction = (index, field, value) => {
    const updated = [...transactions];
    updated[index][field] = value;
    setTransactions(updated);
  };

  const calculate = () => {
    let totalShares = parseFloat(existingHoldings.shares) || 0;
    let totalValue = totalShares * (parseFloat(existingHoldings.price) || 0);

    transactions.forEach((transaction) => {
      const shares = parseFloat(transaction.shares) || 0;
      const price = parseFloat(transaction.price) || 0;

      if (transaction.type === "buy") {
        totalShares += shares;
        totalValue += shares * price;
      } else {
        totalShares -= shares;
        totalValue -= shares * price;
      }
    });

    const averagePrice = totalShares > 0 ? totalValue / totalShares : 0;

    setResult({
      totalShares,
      averagePrice,
      totalValue,
    });
  };

  const reset = () => {
    setExistingHoldings({ shares: "", price: "" });
    setTransactions([{ shares: "", price: "", type: "buy" }]);
    setResult(null);
  };

  const copyResult = () => {
    if (result) {
      const text = `평균 단가: ${result.averagePrice.toLocaleString()}원\n보유 주식: ${result.totalShares.toLocaleString()}주\n총 평가액: ${result.totalValue.toLocaleString()}원`;
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="calculator-card">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">📈💰</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            주식 평단가 계산기
          </h1>
          <p className="text-gray-600">
            매수/매도 거래를 통한 평균 단가를 계산해보세요
          </p>
        </div>

        {/* 기존 보유 주식 */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            기존 보유 주식
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보유 주식 수
              </label>
              <input
                type="number"
                value={existingHoldings.shares}
                onChange={(e) =>
                  setExistingHoldings({
                    ...existingHoldings,
                    shares: e.target.value,
                  })
                }
                className="input-field"
                placeholder="예: 100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                평균 단가 (원)
              </label>
              <input
                type="number"
                value={existingHoldings.price}
                onChange={(e) =>
                  setExistingHoldings({
                    ...existingHoldings,
                    price: e.target.value,
                  })
                }
                className="input-field"
                placeholder="예: 50000"
              />
            </div>
          </div>
        </div>

        {/* 추가 거래 */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-yellow-800 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              추가 거래
            </h3>
            <button
              onClick={addTransaction}
              className="btn-secondary flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              거래 추가
            </button>
          </div>

          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-white rounded-lg border"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  거래 유형
                </label>
                <select
                  value={transaction.type}
                  onChange={(e) =>
                    updateTransaction(index, "type", e.target.value)
                  }
                  className="input-field"
                >
                  <option value="buy">매수</option>
                  <option value="sell">매도</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주식 수
                </label>
                <input
                  type="number"
                  value={transaction.shares}
                  onChange={(e) =>
                    updateTransaction(index, "shares", e.target.value)
                  }
                  className="input-field"
                  placeholder="예: 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  단가 (원)
                </label>
                <input
                  type="number"
                  value={transaction.price}
                  onChange={(e) =>
                    updateTransaction(index, "price", e.target.value)
                  }
                  className="input-field"
                  placeholder="예: 45000"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => removeTransaction(index)}
                  className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  disabled={transactions.length === 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 계산 버튼 */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={calculate}
            className="btn-primary flex-1 flex items-center justify-center"
          >
            <Calculator className="h-5 w-5 mr-2" />
            계산하기
          </button>
          <button onClick={reset} className="btn-secondary">
            초기화
          </button>
        </div>

        {/* 결과 */}
        {result && (
          <div className="result-card">
            <h3 className="text-2xl font-bold mb-6">계산 결과</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">
                  {result.averagePrice.toLocaleString()}원
                </div>
                <div className="text-sm opacity-90 mt-1">평균 단가</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {result.totalShares.toLocaleString()}주
                </div>
                <div className="text-sm opacity-90 mt-1">총 보유 주식</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {result.totalValue.toLocaleString()}원
                </div>
                <div className="text-sm opacity-90 mt-1">총 투자 금액</div>
              </div>
            </div>

            <div className="flex gap-4 mt-6 justify-center">
              <button
                onClick={copyResult}
                className="flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <Copy className="h-4 w-4 mr-2" />
                결과 복사
              </button>
            </div>
          </div>
        )}

        {/* 설명 */}
        <div className="bg-blue-50 p-4 rounded-lg mt-6">
          <h4 className="font-semibold text-blue-800 mb-2">💡 사용 방법</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • 기존 보유 주식이 있다면 보유 수량과 평균 단가를 입력하세요
            </li>
            <li>• 추가 매수/매도 거래 내역을 입력하세요</li>
            <li>
              • 여러 번의 거래가 있다면 '거래 추가' 버튼으로 추가할 수 있습니다
            </li>
            <li>
              • 계산 결과로 새로운 평균 단가와 총 보유량을 확인할 수 있습니다
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StockAverageCalculator;
