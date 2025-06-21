import { useState } from "react";
import { Calculator, Copy } from "lucide-react";

const SalaryCalculator = () => {
  const [annualSalary, setAnnualSalary] = useState("");
  const [dependents, setDependents] = useState(1);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const salary = parseFloat(annualSalary) || 0;
    const monthlySalary = salary / 12;

    // 4대보험료 계산 (2024년 기준 근사치)
    const nationalPension = monthlySalary * 0.045; // 국민연금 4.5%
    const healthInsurance = monthlySalary * 0.0354; // 건강보험 3.54%
    const employmentInsurance = monthlySalary * 0.009; // 고용보험 0.9%
    const industrialAccident = 0; // 산재보험은 회사부담

    const totalInsurance =
      nationalPension + healthInsurance + employmentInsurance;

    // 소득세 계산 (간단화된 버전)
    let incomeTax = 0;
    if (salary <= 12000000) {
      incomeTax = salary * 0.06;
    } else if (salary <= 46000000) {
      incomeTax = 720000 + (salary - 12000000) * 0.15;
    } else if (salary <= 88000000) {
      incomeTax = 5820000 + (salary - 46000000) * 0.24;
    } else {
      incomeTax = 15900000 + (salary - 88000000) * 0.35;
    }

    // 인적공제 적용
    const personalDeduction = 1500000 * dependents;
    incomeTax = Math.max(0, incomeTax - personalDeduction * 0.15);

    const monthlyIncomeTax = incomeTax / 12;
    const localIncomeTax = monthlyIncomeTax * 0.1; // 지방소득세 10%

    const totalTax = monthlyIncomeTax + localIncomeTax;
    const totalDeduction = totalInsurance + totalTax;
    const netMonthlySalary = monthlySalary - totalDeduction;

    setResult({
      monthlySalary,
      nationalPension,
      healthInsurance,
      employmentInsurance,
      totalInsurance,
      monthlyIncomeTax,
      localIncomeTax,
      totalTax,
      totalDeduction,
      netMonthlySalary,
      netAnnualSalary: netMonthlySalary * 12,
    });
  };

  const reset = () => {
    setAnnualSalary("");
    setDependents(1);
    setResult(null);
  };

  const copyResult = () => {
    if (result) {
      const text = `연봉: ${(
        result.monthlySalary * 12
      ).toLocaleString()}원\n월 실수령액: ${result.netMonthlySalary.toLocaleString()}원\n연 실수령액: ${result.netAnnualSalary.toLocaleString()}원`;
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="calculator-card">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">💰📊</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            연봉 실수령액 계산기
          </h1>
          <p className="text-gray-600">연봉 대비 월 실수령액을 계산해보세요</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연봉 (원)
            </label>
            <input
              type="number"
              value={annualSalary}
              onChange={(e) => setAnnualSalary(e.target.value)}
              className="input-field"
              placeholder="예: 50000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              부양가족 수 (본인 포함)
            </label>
            <select
              value={dependents}
              onChange={(e) => setDependents(parseInt(e.target.value))}
              className="input-field"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num}명
                </option>
              ))}
            </select>
          </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(result.netMonthlySalary).toLocaleString()}원
                  </div>
                  <div className="text-sm opacity-90 mt-1">월 실수령액</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(result.netAnnualSalary).toLocaleString()}원
                  </div>
                  <div className="text-sm opacity-90 mt-1">연 실수령액</div>
                </div>
              </div>

              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-3">공제 내역</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>국민연금</span>
                    <span>
                      {Math.round(result.nationalPension).toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>건강보험</span>
                    <span>
                      {Math.round(result.healthInsurance).toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>고용보험</span>
                    <span>
                      {Math.round(result.employmentInsurance).toLocaleString()}
                      원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>소득세</span>
                    <span>
                      {Math.round(result.monthlyIncomeTax).toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>지방소득세</span>
                    <span>
                      {Math.round(result.localIncomeTax).toLocaleString()}원
                    </span>
                  </div>
                  <hr className="my-2 border-white border-opacity-30" />
                  <div className="flex justify-between font-semibold">
                    <span>총 공제액</span>
                    <span>
                      {Math.round(result.totalDeduction).toLocaleString()}원
                    </span>
                  </div>
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

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 계산 기준</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 2024년 기준 4대보험료 및 세율 적용</li>
              <li>• 소득공제 및 세액공제는 기본 항목만 적용</li>
              <li>• 실제 수령액은 회사 정책에 따라 차이가 있을 수 있습니다</li>
              <li>• 정확한 계산은 급여담당자나 세무사에게 문의하세요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;
