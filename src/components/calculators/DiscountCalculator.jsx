import { useState } from "react";
import { Calculator, Copy, ShoppingCart } from "lucide-react";

const DiscountCalculator = () => {
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [calculationType, setCalculationType] = useState("rate"); // rate, amount
  const [result, setResult] = useState(null);

  const calculate = () => {
    const original = parseFloat(originalPrice) || 0;
    let finalPrice = 0;
    let actualDiscountRate = 0;
    let actualDiscountAmount = 0;
    let savings = 0;

    if (calculationType === "rate") {
      // 할인율로 계산
      const rate = parseFloat(discountRate) || 0;
      actualDiscountRate = rate;
      actualDiscountAmount = original * (rate / 100);
      finalPrice = original - actualDiscountAmount;
      savings = actualDiscountAmount;
    } else {
      // 할인금액으로 계산
      const amount = parseFloat(discountAmount) || 0;
      actualDiscountAmount = amount;
      actualDiscountRate = original > 0 ? (amount / original) * 100 : 0;
      finalPrice = original - amount;
      savings = amount;
    }

    setResult({
      originalPrice: original,
      discountRate: actualDiscountRate,
      discountAmount: actualDiscountAmount,
      finalPrice,
      savings,
    });
  };

  const reset = () => {
    setOriginalPrice("");
    setDiscountRate("");
    setDiscountAmount("");
    setResult(null);
  };

  const copyResult = () => {
    if (result) {
      const text = `원가: ${result.originalPrice.toLocaleString()}원\n할인율: ${result.discountRate.toFixed(
        1
      )}%\n할인금액: ${result.discountAmount.toLocaleString()}원\n최종가격: ${result.finalPrice.toLocaleString()}원`;
      navigator.clipboard.writeText(text);
    }
  };

  // 미리 정의된 할인율 버튼들
  const presetDiscounts = [10, 15, 20, 25, 30, 50, 70];

  const applyPresetDiscount = (rate) => {
    setDiscountRate(rate.toString());
    setCalculationType("rate");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="calculator-card">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🛒💰</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            할인율 계산기
          </h1>
          <p className="text-gray-600">할인된 가격을 빠르게 계산해보세요</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              원래 가격 (원)
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="input-field"
              placeholder="예: 100000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계산 방식
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="rate"
                  checked={calculationType === "rate"}
                  onChange={(e) => setCalculationType(e.target.value)}
                  className="mr-2"
                />
                할인율로 계산
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="amount"
                  checked={calculationType === "amount"}
                  onChange={(e) => setCalculationType(e.target.value)}
                  className="mr-2"
                />
                할인금액으로 계산
              </label>
            </div>
          </div>

          {calculationType === "rate" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                할인율 (%)
              </label>
              <input
                type="number"
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                className="input-field"
                placeholder="예: 30"
                max="100"
                min="0"
              />

              {/* 미리 정의된 할인율 버튼들 */}
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">빠른 선택:</p>
                <div className="flex flex-wrap gap-2">
                  {presetDiscounts.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => applyPresetDiscount(rate)}
                      className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                할인금액 (원)
              </label>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="input-field"
                placeholder="예: 30000"
              />
            </div>
          )}

          <div className="flex gap-4">
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

          {result && (
            <div className="result-card">
              <h3 className="text-2xl font-bold mb-6">계산 결과</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white bg-opacity-20 rounded-lg">
                  <span>원래 가격</span>
                  <span className="text-xl font-bold">
                    {result.originalPrice.toLocaleString()}원
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white bg-opacity-20 rounded-lg">
                  <span>할인율</span>
                  <span className="text-xl font-bold text-red-200">
                    {result.discountRate.toFixed(1)}%
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white bg-opacity-20 rounded-lg">
                  <span>할인금액</span>
                  <span className="text-xl font-bold text-red-200">
                    -{result.discountAmount.toLocaleString()}원
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white bg-opacity-30 rounded-lg border-2 border-white border-opacity-50">
                  <span className="font-semibold">최종 가격</span>
                  <span className="text-2xl font-bold">
                    {result.finalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500 bg-opacity-20 rounded-lg text-center">
                <div className="text-lg font-semibold">💰 절약 금액</div>
                <div className="text-2xl font-bold mt-2">
                  {result.savings.toLocaleString()}원
                </div>
              </div>

              <div className="flex justify-center mt-6">
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

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 사용 팁</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 할인율로 계산: 30% 할인 시 최종 가격을 알고 싶을 때</li>
              <li>
                • 할인금액으로 계산: 3만원 할인 시 실제 할인율을 알고 싶을 때
              </li>
              <li>• 쇼핑 전 미리 계산해서 합리적인 소비를 하세요</li>
              <li>• 여러 쇼핑몰의 할인율을 비교할 때 유용합니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountCalculator;
