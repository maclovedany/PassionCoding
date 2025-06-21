import { useState } from "react";
import { Calculator } from "lucide-react";
import CalculatorLayout from "../ui/CalculatorLayout";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ResultCard from "../ui/ResultCard";
import { useCalculator } from "../../hooks/useCalculator";
import { validatePositiveNumber } from "../../utils/formatters";

const DiscountCalculator = () => {
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [calculationType, setCalculationType] = useState("rate");
  const { result, setResult, reset } = useCalculator();

  const presetDiscounts = [10, 20, 30, 50, 70];

  const calculate = () => {
    const price = parseFloat(originalPrice);

    if (!validatePositiveNumber(originalPrice)) {
      alert("올바른 원래 가격을 입력해주세요.");
      return;
    }

    let finalResult;

    if (calculationType === "rate") {
      const rate = parseFloat(discountRate);
      if (!validatePositiveNumber(discountRate) || rate > 100) {
        alert("올바른 할인율을 입력해주세요. (0-100%)");
        return;
      }

      const discountAmt = (price * rate) / 100;
      const finalPrice = price - discountAmt;

      finalResult = {
        originalPrice: price,
        discountRate: rate,
        discountAmount: discountAmt,
        finalPrice: finalPrice,
        savings: discountAmt,
      };
    } else {
      const discountAmt = parseFloat(discountAmount);
      if (!validatePositiveNumber(discountAmount) || discountAmt >= price) {
        alert("올바른 할인금액을 입력해주세요.");
        return;
      }

      const rate = (discountAmt / price) * 100;
      const finalPrice = price - discountAmt;

      finalResult = {
        originalPrice: price,
        discountRate: rate,
        discountAmount: discountAmt,
        finalPrice: finalPrice,
        savings: discountAmt,
      };
    }

    setResult(finalResult);
  };

  const handleReset = () => {
    reset(() => {
      setOriginalPrice("");
      setDiscountRate("");
      setDiscountAmount("");
      setCalculationType("rate");
    });
  };

  const applyPresetDiscount = (rate) => {
    setDiscountRate(rate.toString());
  };

  const getCopyText = () => {
    if (!result) return "";
    return `원래 가격: ${result.originalPrice.toLocaleString()}원\n할인율: ${result.discountRate.toFixed(
      1
    )}%\n할인금액: ${result.discountAmount.toLocaleString()}원\n최종 가격: ${result.finalPrice.toLocaleString()}원`;
  };

  return (
    <CalculatorLayout
      title="할인율 계산기"
      description="할인율과 할인금액을 계산해보세요"
      emoji="💰🏷️"
    >
      <div className="space-y-6">
        <Input
          label="원래 가격 (원)"
          type="number"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          placeholder="예: 100000"
        />

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
            <Input
              label="할인율 (%)"
              type="number"
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
              placeholder="예: 30"
              max="100"
              min="0"
            />
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">빠른 선택:</p>
              <div className="flex flex-wrap gap-2">
                {presetDiscounts.map((rate) => (
                  <Button
                    key={rate}
                    variant="secondary"
                    size="sm"
                    onClick={() => applyPresetDiscount(rate)}
                  >
                    {rate}%
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Input
            label="할인금액 (원)"
            type="number"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value)}
            placeholder="예: 30000"
          />
        )}

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

        {result && (
          <ResultCard title="계산 결과" copyText={getCopyText()}>
            <div className="space-y-4">
              <ResultRow
                label="원래 가격"
                value={`${result.originalPrice.toLocaleString()}원`}
              />
              <ResultRow
                label="할인율"
                value={`${result.discountRate.toFixed(1)}%`}
                highlight="text-red-200"
              />
              <ResultRow
                label="할인금액"
                value={`-${result.discountAmount.toLocaleString()}원`}
                highlight="text-red-200"
              />
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
          </ResultCard>
        )}

        <DiscountTips />
      </div>
    </CalculatorLayout>
  );
};

// 재사용 가능한 결과 행 컴포넌트
const ResultRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center p-4 bg-white bg-opacity-20 rounded-lg">
    <span>{label}</span>
    <span className={`text-xl font-bold ${highlight || ""}`}>{value}</span>
  </div>
);

// 할인 팁 컴포넌트
const DiscountTips = () => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h4 className="font-semibold text-blue-800 mb-2">💡 사용 팁</h4>
    <ul className="text-sm text-blue-700 space-y-1">
      <li>• 할인율로 계산: 30% 할인 시 최종 가격을 알고 싶을 때</li>
      <li>• 할인금액으로 계산: 3만원 할인 시 실제 할인율을 알고 싶을 때</li>
      <li>• 쇼핑 전 미리 계산해서 합리적인 소비를 하세요</li>
      <li>• 여러 쇼핑몰의 할인율을 비교할 때 유용합니다</li>
    </ul>
  </div>
);

export default DiscountCalculator;
