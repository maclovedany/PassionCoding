import { useState } from "react";
import { Calculator } from "lucide-react";
import CalculatorLayout from "../ui/CalculatorLayout";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ResultCard from "../ui/ResultCard";
import { useCalculator } from "../../hooks/useCalculator";
import { validatePositiveNumber } from "../../utils/formatters";

const LotteryCalculator = () => {
  const [amount, setAmount] = useState("");
  const [lotteryType, setLotteryType] = useState("lotto");
  const { result, setResult, reset } = useCalculator();

  const lotteryTypes = {
    lotto: { name: "로또 6/45", ticketPrice: 1000 },
    pension: { name: "연금복권", ticketPrice: 1000 },
    scratch: { name: "즉석복권", ticketPrice: 1000 },
    other: { name: "기타 복권", ticketPrice: 1000 },
  };

  const calculateTax = (taxableAmount) => {
    if (taxableAmount <= 50000) {
      return {
        type: "tax_free",
        totalTax: 0,
        tax3억까지: 0,
        tax3억초과: 0,
        excessAmount: 0,
      };
    }

    if (taxableAmount <= 300000000) {
      const tax = taxableAmount * 0.22;
      return {
        type: "normal",
        totalTax: tax,
        tax3억까지: tax,
        tax3억초과: 0,
        excessAmount: 0,
      };
    }

    const baseTax = 300000000 * 0.22;
    const excessAmount = taxableAmount - 300000000;
    const excessTax = excessAmount * 0.33;
    const totalTax = baseTax + excessTax;

    return {
      type: "progressive",
      totalTax: totalTax,
      tax3억까지: baseTax,
      tax3억초과: excessTax,
      excessAmount: excessAmount,
    };
  };

  const calculate = () => {
    const winAmount = parseFloat(amount);

    if (!validatePositiveNumber(amount)) {
      alert("올바른 당첨금액을 입력해주세요.");
      return;
    }

    const ticketCost = lotteryTypes[lotteryType].ticketPrice;
    const taxableAmount = winAmount - ticketCost;
    const taxInfo = calculateTax(taxableAmount);
    const takeHome = winAmount - taxInfo.totalTax;

    setResult({
      winAmount,
      ticketCost,
      taxableAmount,
      totalTax: taxInfo.totalTax,
      tax3억까지: taxInfo.tax3억까지,
      tax3억초과: taxInfo.tax3억초과,
      takeHome,
      taxInfo,
    });
  };

  const handleReset = () => {
    reset(() => {
      setAmount("");
      setLotteryType("lotto");
    });
  };

  const getCopyText = () => {
    if (!result) return "";
    return `${
      lotteryTypes[lotteryType].name
    } 당첨금: ${result.winAmount.toLocaleString()}원\n실수령액: ${result.takeHome.toLocaleString()}원\n세금: ${result.totalTax.toLocaleString()}원`;
  };

  return (
    <CalculatorLayout
      title="복권 당첨금 실수령액 계산기"
      description="복권 당첨금의 세후 실수령액을 계산해보세요"
      emoji="🎰💰"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            복권 종류
          </label>
          <select
            value={lotteryType}
            onChange={(e) => setLotteryType(e.target.value)}
            className="input-field"
          >
            {Object.entries(lotteryTypes).map(([key, type]) => (
              <option key={key} value={key}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="당첨금 (원)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="당첨금액을 입력하세요"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              calculate();
            }
          }}
        />

        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={calculate}
            icon={Calculator}
            className="flex-1"
          >
            실수령액 계산하기 🧮
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            초기화
          </Button>
        </div>

        {result && (
          <ResultCard
            title={`🎉 ${lotteryTypes[lotteryType].name} 실수령액`}
            copyText={getCopyText()}
          >
            <div className="text-center mb-6">
              <div className="text-4xl font-bold">
                {result.takeHome.toLocaleString()}원
              </div>
            </div>

            <TaxBreakdown result={result} />
          </ResultCard>
        )}

        <TaxInfo />
      </div>
    </CalculatorLayout>
  );
};

// 세금 분석 컴포넌트
const TaxBreakdown = ({ result }) => {
  if (result.taxInfo.type === "tax_free") {
    return (
      <div className="space-y-3">
        <ResultRow
          label="당첨금액"
          value={`${result.winAmount.toLocaleString()}원`}
        />
        <ResultRow
          label="복권구입비"
          value={`-${result.ticketCost.toLocaleString()}원`}
          highlight="text-yellow-200"
        />
        <ResultRow
          label="과세표준액"
          value={`${result.taxableAmount.toLocaleString()}원`}
        />
        <ResultRow
          label="세금 (5만원 이하 비과세)"
          value="-0원"
          highlight="text-green-200"
        />
        <FinalAmountRow amount={result.takeHome} />
      </div>
    );
  }

  if (result.taxInfo.type === "normal") {
    return (
      <div className="space-y-3">
        <ResultRow
          label="당첨금액"
          value={`${result.winAmount.toLocaleString()}원`}
        />
        <ResultRow
          label="복권구입비"
          value={`-${result.ticketCost.toLocaleString()}원`}
          highlight="text-yellow-200"
        />
        <ResultRow
          label="과세표준액"
          value={`${result.taxableAmount.toLocaleString()}원`}
        />
        <ResultRow
          label="세금 (22%)"
          value={`-${result.totalTax.toLocaleString()}원`}
          highlight="text-red-200"
        />
        <FinalAmountRow amount={result.takeHome} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ResultRow
        label="당첨금액"
        value={`${result.winAmount.toLocaleString()}원`}
      />
      <ResultRow
        label="복권구입비"
        value={`-${result.ticketCost.toLocaleString()}원`}
        highlight="text-yellow-200"
      />
      <ResultRow
        label="과세표준액"
        value={`${result.taxableAmount.toLocaleString()}원`}
      />
      <ResultRow
        label="3억까지 세금 (22%)"
        value={`-${result.tax3억까지.toLocaleString()}원`}
        highlight="text-red-200"
      />
      <div className="flex justify-between items-center p-3 bg-white bg-opacity-15 rounded-lg">
        <span className="text-sm">
          3억초과분 ({result.taxInfo.excessAmount.toLocaleString()}원)
        </span>
        <span></span>
      </div>
      <ResultRow
        label="└ 초과분 세금 (33%)"
        value={`-${result.tax3억초과.toLocaleString()}원`}
        highlight="text-red-200"
        className="ml-4"
      />
      <ResultRow
        label="총 세금"
        value={`-${result.totalTax.toLocaleString()}원`}
        highlight="text-red-200"
      />
      <FinalAmountRow amount={result.takeHome} />
    </div>
  );
};

// 재사용 가능한 결과 행 컴포넌트
const ResultRow = ({ label, value, highlight, className = "" }) => (
  <div
    className={`flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg ${className}`}
  >
    <span>{label}</span>
    <span className={`font-bold ${highlight || ""}`}>{value}</span>
  </div>
);

// 최종 금액 행 컴포넌트
const FinalAmountRow = ({ amount }) => (
  <div className="flex justify-between items-center p-3 bg-white bg-opacity-30 rounded-lg border-2 border-white border-opacity-50">
    <span className="font-semibold">실수령액</span>
    <span className="text-xl font-bold">{amount.toLocaleString()}원</span>
  </div>
);

// 세금 정보 컴포넌트
const TaxInfo = () => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h4 className="font-semibold text-blue-800 mb-2">📋 세금 정보</h4>
    <ul className="text-sm text-blue-700 space-y-1">
      <li>
        • <strong>과세표준액</strong> = 당첨금 - 복권구입비(1,000원)
      </li>
      <li>
        • <strong>5만원 이하</strong>: 비과세 (세금 없음)
      </li>
      <li>
        • <strong>5만원 초과 ~ 3억원 이하</strong>: 22% (기타소득세 20% +
        지방소득세 2%)
      </li>
      <li>
        • <strong>3억원 초과</strong>: 33% (기타소득세 30% + 지방소득세 3%) -
        초과분에만 적용
      </li>
      <li>• 실제 로또 사이트와 동일한 계산 방식을 적용했습니다</li>
    </ul>
  </div>
);

export default LotteryCalculator;
