import { useState } from "react";
import { Calculator, Copy } from "lucide-react";

const LotteryCalculator = () => {
  const [lotteryType, setLotteryType] = useState("lotto");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);

  const lotteryTypes = {
    lotto: { name: "로또 6/45" },
    pension: { name: "연금복권" },
    scratch: { name: "즉석복권" },
    other: { name: "기타 복권" },
  };

  const calculate = () => {
    const winAmount = parseInt(amount) || 0;

    if (winAmount <= 0) {
      alert("올바른 당첨금액을 입력해주세요.");
      return;
    }

    // 복권구입비 (로또는 1,000원)
    const ticketCost = 1000;

    // 과세표준액 = 당첨금 - 복권구입비
    const taxableAmount = winAmount - ticketCost;

    let tax3억까지 = 0;
    let tax3억초과 = 0;
    let totalTax = 0;
    let takeHome = winAmount;
    let taxInfo = {};

    // 세금 계산 (과세표준액 기준)
    if (taxableAmount <= 50000) {
      // 5만원 이하: 비과세
      tax3억까지 = 0;
      tax3억초과 = 0;
      totalTax = 0;
      taxInfo = {
        type: "tax_free",
        description: "5만원 이하 비과세",
      };
    } else if (taxableAmount <= 300000000) {
      // 5만원 초과 ~ 3억원 이하: 22%
      tax3억까지 = Math.floor(taxableAmount * 0.22);
      tax3억초과 = 0;
      totalTax = tax3억까지;
      taxInfo = {
        type: "normal",
        description: "22% 세율 적용",
      };
    } else {
      // 3억원 초과: 구간별 세율 적용
      // 3억원까지: 22% 세율
      tax3억까지 = Math.floor(300000000 * 0.22);

      // 3억원 초과분: 33% 세율
      const excessAmount = taxableAmount - 300000000;
      tax3억초과 = Math.floor(excessAmount * 0.33);

      totalTax = tax3억까지 + tax3억초과;

      taxInfo = {
        type: "progressive",
        description: "구간별 세율 적용",
        tax3억까지,
        excessAmount,
        tax3억초과,
      };
    }

    takeHome = winAmount - totalTax;

    setResult({
      winAmount,
      ticketCost,
      taxableAmount,
      tax3억까지,
      tax3억초과,
      totalTax,
      takeHome,
      taxInfo,
    });
  };

  const reset = () => {
    setAmount("");
    setResult(null);
  };

  const copyResult = () => {
    if (result) {
      const text = `${
        lotteryTypes[lotteryType].name
      } 당첨금: ${result.winAmount.toLocaleString()}원\n총 세금: ${result.totalTax.toLocaleString()}원\n실수령액: ${result.takeHome.toLocaleString()}원`;
      navigator.clipboard.writeText(text);
    }
  };

  const renderBreakdown = () => {
    if (!result) return null;

    if (result.taxInfo.type === "tax_free") {
      return (
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg">
            <span>당첨금액</span>
            <span className="font-bold">
              {result.winAmount.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg">
            <span>복권구입비</span>
            <span className="font-bold text-yellow-200">
              -{result.ticketCost.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg">
            <span>과세표준액</span>
            <span className="font-bold">
              {result.taxableAmount.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg">
            <span>세금 (5만원 이하 비과세)</span>
            <span className="font-bold text-green-200">-0원</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-30 rounded-lg border-2 border-white border-opacity-50">
            <span className="font-semibold">실수령액</span>
            <span className="text-xl font-bold">
              {result.takeHome.toLocaleString()}원
            </span>
          </div>
        </div>
      );
    } else if (result.taxInfo.type === "normal") {
      return (
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg">
            <span>당첨금액</span>
            <span className="font-bold">
              {result.winAmount.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg">
            <span>복권구입비</span>
            <span className="font-bold text-yellow-200">
              -{result.ticketCost.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg">
            <span>과세표준액</span>
            <span className="font-bold">
              {result.taxableAmount.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg">
            <span>세금 (22%)</span>
            <span className="font-bold text-red-200">
              -{result.totalTax.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-30 rounded-lg border-2 border-white border-opacity-50">
            <span className="font-semibold">실수령액</span>
            <span className="text-xl font-bold">
              {result.takeHome.toLocaleString()}원
            </span>
          </div>
        </div>
      );
    } else if (result.taxInfo.type === "progressive") {
      return (
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg">
            <span>당첨금액</span>
            <span className="font-bold">
              {result.winAmount.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg">
            <span>복권구입비</span>
            <span className="font-bold text-yellow-200">
              -{result.ticketCost.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg">
            <span>과세표준액</span>
            <span className="font-bold">
              {result.taxableAmount.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg">
            <span>3억까지 세금 (22%)</span>
            <span className="font-bold text-red-200">
              -{result.tax3억까지.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-15 rounded-lg">
            <span className="text-sm">
              3억초과분 ({result.taxInfo.excessAmount.toLocaleString()}원)
            </span>
            <span></span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg ml-4">
            <span>└ 초과분 세금 (33%)</span>
            <span className="font-bold text-red-200">
              -{result.tax3억초과.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-20 rounded-lg">
            <span>총 세금</span>
            <span className="font-bold text-red-200">
              -{result.totalTax.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white bg-opacity-30 rounded-lg border-2 border-white border-opacity-50">
            <span className="font-semibold">실수령액</span>
            <span className="text-xl font-bold">
              {result.takeHome.toLocaleString()}원
            </span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="calculator-card">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🎰💰</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            복권 당첨금 실수령액 계산기
          </h1>
          <p className="text-gray-600">
            복권 당첨금의 세후 실수령액을 계산해보세요
          </p>
        </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              당첨금 (원)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field"
              placeholder="당첨금액을 입력하세요"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  calculate();
                }
              }}
            />
          </div>

          <div className="flex gap-4">
            <button onClick={calculate} className="btn-primary flex-1">
              <Calculator className="h-5 w-5 mr-2" />
              실수령액 계산하기 🧮
            </button>
            <button onClick={reset} className="btn-secondary">
              초기화
            </button>
          </div>

          {result && (
            <div className="result-card">
              <h3 className="text-2xl font-bold mb-6">
                🎉 {lotteryTypes[lotteryType].name} 실수령액
              </h3>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold">
                  {result.takeHome.toLocaleString()}원
                </div>
              </div>

              {renderBreakdown()}

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
            <h4 className="font-semibold text-blue-800 mb-2">📋 세금 정보</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • <strong>과세표준액</strong> = 당첨금 - 복권구입비(1,000원)
              </li>
              <li>
                • <strong>5만원 이하</strong>: 비과세 (세금 없음)
              </li>
              <li>
                • <strong>5만원 초과 ~ 3억원 이하</strong>: 22% (기타소득세 20%
                + 지방소득세 2%)
              </li>
              <li>
                • <strong>3억원 초과</strong>: 33% (기타소득세 30% + 지방소득세
                3%) - 초과분에만 적용
              </li>
              <li>• 실제 로또 사이트와 동일한 계산 방식을 적용했습니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotteryCalculator;
