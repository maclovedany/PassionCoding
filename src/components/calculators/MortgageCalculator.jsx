import { useState } from "react";
import { Calculator } from "lucide-react";
import CalculatorLayout from "../ui/CalculatorLayout";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ResultCard from "../ui/ResultCard";
import { useCalculator } from "../../hooks/useCalculator";
import { validatePositiveNumber } from "../../utils/formatters";

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [repaymentType, setRepaymentType] = useState("equal_installment");
  const { result, setResult, reset } = useCalculator();

  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = parseInt(loanTerm) * 12;

    if (repaymentType === "equal_installment") {
      // 원리금균등 상환
      const monthlyPayment =
        monthlyRate === 0
          ? principal / totalMonths
          : (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1);

      const totalPayment = monthlyPayment * totalMonths;
      const totalInterest = totalPayment - principal;

      // 월별 상환 내역 (첫 12개월)
      const monthlyPayments = [];
      let remainingBalance = principal;

      for (let month = 1; month <= Math.min(12, totalMonths); month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        monthlyPayments.push({
          month,
          totalPayment: monthlyPayment,
          principalPayment,
          interestPayment,
          remainingBalance: Math.max(0, remainingBalance),
        });
      }

      return {
        repaymentType: "원리금균등",
        firstMonthPayment: monthlyPayment,
        totalInterest,
        totalPayment,
        monthlyPayments,
      };
    } else {
      // 원금균등 상환
      const monthlyPrincipal = principal / totalMonths;
      const firstInterestPayment = principal * monthlyRate;
      const firstMonthPayment = monthlyPrincipal + firstInterestPayment;
      const totalInterest = (principal * monthlyRate * (totalMonths + 1)) / 2;
      const totalPayment = principal + totalInterest;

      // 월별 상환 내역 (첫 12개월)
      const monthlyPayments = [];
      let remainingBalance = principal;

      for (let month = 1; month <= Math.min(12, totalMonths); month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const totalMonthPayment = monthlyPrincipal + interestPayment;
        remainingBalance -= monthlyPrincipal;

        monthlyPayments.push({
          month,
          totalPayment: totalMonthPayment,
          principalPayment: monthlyPrincipal,
          interestPayment,
          remainingBalance: Math.max(0, remainingBalance),
        });
      }

      return {
        repaymentType: "원금균등",
        firstMonthPayment,
        totalInterest,
        totalPayment,
        monthlyPayments,
      };
    }
  };

  const calculate = () => {
    if (
      !validatePositiveNumber(loanAmount) ||
      !validatePositiveNumber(interestRate) ||
      !validatePositiveNumber(loanTerm)
    ) {
      alert("모든 항목을 올바르게 입력해주세요.");
      return;
    }

    const calculatedResult = calculateMortgage();
    setResult(calculatedResult);
  };

  const handleReset = () => {
    reset(() => {
      setLoanAmount("");
      setInterestRate("");
      setLoanTerm("");
      setRepaymentType("equal_installment");
    });
  };

  const getCopyText = () => {
    if (!result) return "";
    return `대출금액: ${parseFloat(loanAmount).toLocaleString()}원\n${
      result.repaymentType
    } 방식\n첫달 상환액: ${Math.round(
      result.firstMonthPayment
    ).toLocaleString()}원\n총 이자: ${Math.round(
      result.totalInterest
    ).toLocaleString()}원`;
  };

  return (
    <CalculatorLayout
      title="주택담보대출 계산기"
      description="대출 원리금 상환액을 계산해보세요"
      emoji="🏠💰"
      maxWidth="max-w-4xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 입력 영역 */}
        <div className="space-y-6">
          <Input
            label="대출금액 (원)"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="예: 300000000"
          />

          <Input
            label="연 이자율 (%)"
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="예: 3.5"
          />

          <Input
            label="대출기간 (년)"
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            placeholder="예: 30"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상환방식
            </label>
            <select
              value={repaymentType}
              onChange={(e) => setRepaymentType(e.target.value)}
              className="input-field"
            >
              <option value="equal_installment">원리금균등</option>
              <option value="equal_principal">원금균등</option>
            </select>
          </div>

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
        </div>

        {/* 결과 영역 */}
        <div>
          {result && (
            <ResultCard title="계산 결과" copyText={getCopyText()}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-xl font-bold">
                    {Math.round(result.firstMonthPayment).toLocaleString()}원
                  </div>
                  <div className="text-sm opacity-90 mt-1">첫달 상환액</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">
                    {Math.round(result.totalInterest).toLocaleString()}원
                  </div>
                  <div className="text-sm opacity-90 mt-1">총 이자</div>
                </div>
              </div>

              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-3">
                  월별 상환 계획 (첫 12개월)
                </h4>
                <div className="space-y-2 text-sm max-h-60 overflow-y-auto">
                  {result.monthlyPayments.map((payment) => (
                    <div
                      key={payment.month}
                      className="flex justify-between items-center py-1 border-b border-white border-opacity-20"
                    >
                      <span>{payment.month}개월</span>
                      <div className="text-right">
                        <div className="font-medium">
                          {Math.round(payment.totalPayment).toLocaleString()}원
                        </div>
                        <div className="text-xs opacity-80">
                          원금{" "}
                          {Math.round(
                            payment.principalPayment
                          ).toLocaleString()}{" "}
                          + 이자{" "}
                          {Math.round(payment.interestPayment).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ResultCard>
          )}
        </div>
      </div>

      <LoanInfo />
    </CalculatorLayout>
  );
};

// 대출 정보 컴포넌트
const LoanInfo = () => (
  <div className="mt-8 bg-green-50 p-4 rounded-lg">
    <h4 className="font-semibold text-green-800 mb-2">💡 대출 정보</h4>
    <ul className="text-sm text-green-700 space-y-1">
      <li>
        • <strong>원리금균등</strong>: 매월 동일한 금액 상환 (초기 이자 비중
        높음)
      </li>
      <li>
        • <strong>원금균등</strong>: 매월 동일한 원금 + 변동 이자 상환
      </li>
      <li>• 실제 대출 조건은 은행별로 차이가 있을 수 있습니다</li>
      <li>• 정확한 상담은 해당 금융기관에 문의하시기 바랍니다</li>
    </ul>
  </div>
);

export default MortgageCalculator;
