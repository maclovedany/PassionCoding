import { useState } from "react";
import { Calculator, Plus, Minus } from "lucide-react";
import CalculatorLayout from "../ui/CalculatorLayout";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ResultCard from "../ui/ResultCard";
import { useCalculator } from "../../hooks/useCalculator";
import { validatePositiveNumber } from "../../utils/formatters";

const StockAverageCalculator = () => {
  const [existingHoldings, setExistingHoldings] = useState({
    shares: "",
    price: "",
  });
  const [transactions, setTransactions] = useState([
    { type: "buy", shares: "", price: "" },
  ]);
  const { result, setResult, reset } = useCalculator();

  const addTransaction = () => {
    setTransactions([...transactions, { type: "buy", shares: "", price: "" }]);
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
    const existingShares = parseFloat(existingHoldings.shares) || 0;
    const existingPrice = parseFloat(existingHoldings.price) || 0;

    let totalShares = existingShares;
    let totalValue = existingShares * existingPrice;

    // 거래 내역 처리
    for (const transaction of transactions) {
      const shares = parseFloat(transaction.shares) || 0;
      const price = parseFloat(transaction.price) || 0;

      if (shares > 0 && price > 0) {
        if (transaction.type === "buy") {
          totalShares += shares;
          totalValue += shares * price;
        } else if (transaction.type === "sell") {
          if (shares <= totalShares) {
            totalShares -= shares;
            totalValue -= shares * (totalValue / totalShares);
          }
        }
      }
    }

    const averagePrice = totalShares > 0 ? totalValue / totalShares : 0;

    setResult({
      totalShares,
      totalValue,
      averagePrice,
    });
  };

  const handleReset = () => {
    reset(() => {
      setExistingHoldings({ shares: "", price: "" });
      setTransactions([{ type: "buy", shares: "", price: "" }]);
    });
  };

  const getCopyText = () => {
    if (!result) return "";
    return `평균 단가: ${result.averagePrice.toLocaleString()}원\n총 보유 주식: ${result.totalShares.toLocaleString()}주\n총 투자 금액: ${result.totalValue.toLocaleString()}원`;
  };

  return (
    <CalculatorLayout
      title="주식 평단가 계산기"
      description="매수/매도 거래를 통한 평균 단가를 계산해보세요"
      emoji="📈💰"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* 기존 보유 주식 */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            기존 보유 주식
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="보유 주식 수"
              type="number"
              value={existingHoldings.shares}
              onChange={(e) =>
                setExistingHoldings({
                  ...existingHoldings,
                  shares: e.target.value,
                })
              }
              placeholder="예: 100"
            />
            <Input
              label="평균 단가 (원)"
              type="number"
              value={existingHoldings.price}
              onChange={(e) =>
                setExistingHoldings({
                  ...existingHoldings,
                  price: e.target.value,
                })
              }
              placeholder="예: 50000"
            />
          </div>
        </div>

        {/* 새로운 거래 */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-blue-800">새로운 거래</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={addTransaction}
              icon={Plus}
            >
              거래 추가
            </Button>
          </div>

          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg"
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
                <Input
                  label="주식 수"
                  type="number"
                  value={transaction.shares}
                  onChange={(e) =>
                    updateTransaction(index, "shares", e.target.value)
                  }
                  placeholder="예: 50"
                />
                <Input
                  label="단가 (원)"
                  type="number"
                  value={transaction.price}
                  onChange={(e) =>
                    updateTransaction(index, "price", e.target.value)
                  }
                  placeholder="예: 55000"
                />
                <div className="flex items-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => removeTransaction(index)}
                    icon={Minus}
                    className="w-full"
                    disabled={transactions.length === 1}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 계산 버튼 */}
        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={calculate}
            icon={Calculator}
            className="flex-1"
          >
            계산하기
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            초기화
          </Button>
        </div>

        {/* 결과 */}
        {result && (
          <ResultCard title="계산 결과" copyText={getCopyText()}>
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
          </ResultCard>
        )}

        <StockTips />
      </div>
    </CalculatorLayout>
  );
};

// 주식 팁 컴포넌트
const StockTips = () => (
  <div className="bg-yellow-50 p-4 rounded-lg">
    <h4 className="font-semibold text-yellow-800 mb-2">💡 투자 팁</h4>
    <ul className="text-sm text-yellow-700 space-y-1">
      <li>• 평단가 낮추기는 신중하게 판단하세요</li>
      <li>• 매도 시에는 평균 단가가 재계산됩니다</li>
      <li>• 분할 매수로 리스크를 분산할 수 있습니다</li>
      <li>• 투자는 본인의 판단과 책임으로 하시기 바랍니다</li>
    </ul>
  </div>
);

export default StockAverageCalculator;
