import { useState } from "react";
import { Calculator, Copy, Home } from "lucide-react";

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("30");
  const [paymentType, setPaymentType] = useState("equal"); // equal, principal
  const [gracePeriod, setGracePeriod] = useState("0");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const principal = parseFloat(loanAmount) || 0;
    const monthlyRate = (parseFloat(interestRate) || 0) / 100 / 12;
    const termInMonths = parseInt(loanTerm) * 12;
    const graceMonths = parseInt(gracePeriod);

    let monthlyPayments = [];
    let totalInterest = 0;
    let totalPayment = 0;

    if (paymentType === "equal") {
      // 원리금균등상환
      const monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, termInMonths))) /
        (Math.pow(1 + monthlyRate, termInMonths) - 1);

      let remainingPrincipal = principal;

      for (let i = 1; i <= termInMonths; i++) {
        const interestPayment = remainingPrincipal * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingPrincipal -= principalPayment;

        totalInterest += interestPayment;
        totalPayment += monthlyPayment;

        if (i <= 12) {
          // 첫 12개월만 저장
          monthlyPayments.push({
            month: i,
            totalPayment: monthlyPayment,
            principalPayment,
            interestPayment,
            remainingPrincipal: Math.max(0, remainingPrincipal),
          });
        }
      }
    } else {
      // 원금균등상환
      const monthlyPrincipal = principal / termInMonths;
      let remainingPrincipal = principal;

      for (let i = 1; i <= termInMonths; i++) {
        const interestPayment = remainingPrincipal * monthlyRate;
        const totalMonthlyPayment = monthlyPrincipal + interestPayment;
        remainingPrincipal -= monthlyPrincipal;

        totalInterest += interestPayment;
        totalPayment += totalMonthlyPayment;

        if (i <= 12) {
          // 첫 12개월만 저장
          monthlyPayments.push({
            month: i,
            totalPayment: totalMonthlyPayment,
            principalPayment: monthlyPrincipal,
            interestPayment,
            remainingPrincipal: Math.max(0, remainingPrincipal),
          });
        }
      }
    }

    setResult({
      loanAmount: principal,
      monthlyPayments,
      totalInterest,
      totalPayment,
      firstMonthPayment: monthlyPayments[0]?.totalPayment || 0,
      lastMonthPayment:
        monthlyPayments[monthlyPayments.length - 1]?.totalPayment || 0,
    });
  };

  const reset = () => {
    setLoanAmount("");
    setInterestRate("");
    setLoanTerm("30");
    setPaymentType("equal");
    setGracePeriod("0");
    setResult(null);
  };

  const copyResult = () => {
    if (result) {
      const text = `대출금액: ${result.loanAmount.toLocaleString()}원\n첫달 상환액: ${Math.round(
        result.firstMonthPayment
      ).toLocaleString()}원\n총 이자: ${Math.round(
        result.totalInterest
      ).toLocaleString()}원\n총 상환액: ${Math.round(
        result.totalPayment
      ).toLocaleString()}원`;
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="calculator-card">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🏠💰</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            주택담보대출 계산기
          </h1>
          <p className="text-gray-600">대출 원리금 상환액을 계산해보세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 입력 영역 */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대출금액 (원)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="input-field"
                placeholder="예: 300000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연 이자율 (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="input-field"
                placeholder="예: 3.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대출기간 (년)
              </label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="input-field"
              >
                <option value="10">10년</option>
                <option value="15">15년</option>
                <option value="20">20년</option>
                <option value="25">25년</option>
                <option value="30">30년</option>
                <option value="35">35년</option>
                <option value="40">40년</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상환방식
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="input-field"
              >
                <option value="equal">원리금균등상환</option>
                <option value="principal">원금균등상환</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                거치기간 (개월)
              </label>
              <select
                value={gracePeriod}
                onChange={(e) => setGracePeriod(e.target.value)}
                className="input-field"
              >
                <option value="0">없음</option>
                <option value="6">6개월</option>
                <option value="12">12개월</option>
                <option value="24">24개월</option>
                <option value="36">36개월</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button onClick={calculate} className="btn-primary flex-1">
                <Calculator className="h-5 w-5 mr-2" />
                계산하기
              </button>
              <button onClick={reset} className="btn-secondary">
                초기화
              </button>
            </div>
          </div>

          {/* 결과 영역 */}
          <div>
            {result && (
              <div className="result-card">
                <h3 className="text-2xl font-bold mb-6">계산 결과</h3>

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
                            {Math.round(payment.totalPayment).toLocaleString()}
                            원
                          </div>
                          <div className="text-xs opacity-80">
                            원금{" "}
                            {Math.round(
                              payment.principalPayment
                            ).toLocaleString()}{" "}
                            + 이자{" "}
                            {Math.round(
                              payment.interestPayment
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
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
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mt-6">
          <h4 className="font-semibold text-blue-800 mb-2">💡 상환방식 안내</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • <strong>원리금균등상환:</strong> 매월 동일한 금액을 상환하는
              방식
            </li>
            <li>
              • <strong>원금균등상환:</strong> 매월 동일한 원금 + 잔액에 대한
              이자를 상환하는 방식
            </li>
            <li>
              • 실제 대출 조건은 은행별로 다를 수 있으니 상담을 받아보세요
            </li>
            <li>• 중도상환수수료, 보증료 등 부대비용은 포함되지 않았습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
