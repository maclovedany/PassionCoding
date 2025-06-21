import { useState } from "react";
import { Calculator } from "lucide-react";
import CalculatorLayout from "../ui/CalculatorLayout";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ResultCard from "../ui/ResultCard";
import { useCalculator } from "../../hooks/useCalculator";
import { validatePositiveNumber } from "../../utils/formatters";

const SalaryCalculator = () => {
  const [annualSalary, setAnnualSalary] = useState("");
  const [dependents, setDependents] = useState(1);
  const { result, setResult, reset } = useCalculator();

  const calculateSalary = (salary, dependents) => {
    const monthlySalary = salary / 12;

    // 4대보험료 계산 (월급 기준)
    const nationalPension = Math.min(monthlySalary * 0.045, 243000); // 상한액 적용
    const healthInsurance = monthlySalary * 0.03545;
    const longTermCare = healthInsurance * 0.1295; // 장기요양보험
    const employmentInsurance = monthlySalary * 0.009;

    const totalInsurance =
      nationalPension + healthInsurance + longTermCare + employmentInsurance;

    // 소득세 계산 (간소화된 계산)
    const taxableIncome = monthlySalary - totalInsurance - 150000; // 기본공제
    const incomeTax = Math.max(taxableIncome * 0.06, 0); // 6% 세율 (간소화)
    const localTax = incomeTax * 0.1; // 지방소득세 10%

    const totalTax = incomeTax + localTax;
    const netMonthlySalary = monthlySalary - totalInsurance - totalTax;
    const netAnnualSalary = netMonthlySalary * 12;

    return {
      monthlySalary,
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      totalInsurance,
      incomeTax,
      localTax,
      totalTax,
      netMonthlySalary,
      netAnnualSalary,
    };
  };

  const calculate = () => {
    if (!validatePositiveNumber(annualSalary)) {
      alert("올바른 연봉을 입력해주세요.");
      return;
    }

    const salary = parseFloat(annualSalary);
    const calculatedResult = calculateSalary(salary, dependents);
    setResult(calculatedResult);
  };

  const handleReset = () => {
    reset(() => {
      setAnnualSalary("");
      setDependents(1);
    });
  };

  const getCopyText = () => {
    if (!result) return "";
    return `연봉: ${(
      result.monthlySalary * 12
    ).toLocaleString()}원\n월 실수령액: ${result.netMonthlySalary.toLocaleString()}원\n연 실수령액: ${result.netAnnualSalary.toLocaleString()}원`;
  };

  return (
    <CalculatorLayout
      title="연봉 실수령액 계산기"
      description="연봉 대비 월 실수령액을 계산해보세요"
      emoji="💰📊"
    >
      <div className="space-y-6">
        <Input
          label="연봉 (원)"
          type="number"
          value={annualSalary}
          onChange={(e) => setAnnualSalary(e.target.value)}
          placeholder="예: 50000000"
        />

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

            <SalaryBreakdown result={result} />
          </ResultCard>
        )}

        <SalaryInfo />
      </div>
    </CalculatorLayout>
  );
};

// 급여 분석 컴포넌트
const SalaryBreakdown = ({ result }) => (
  <div className="space-y-4">
    <div className="bg-white bg-opacity-20 rounded-lg p-4">
      <h4 className="font-semibold mb-3">💼 월급 정보</h4>
      <div className="space-y-2">
        <ResultRow
          label="세전 월급"
          value={`${Math.round(result.monthlySalary).toLocaleString()}원`}
        />
        <ResultRow
          label="4대보험료"
          value={`-${Math.round(result.totalInsurance).toLocaleString()}원`}
          highlight="text-blue-200"
        />
        <ResultRow
          label="소득세"
          value={`-${Math.round(result.totalTax).toLocaleString()}원`}
          highlight="text-red-200"
        />
      </div>
    </div>

    <div className="bg-white bg-opacity-20 rounded-lg p-4">
      <h4 className="font-semibold mb-3">🏥 4대보험 상세</h4>
      <div className="space-y-2 text-sm">
        <ResultRow
          label="국민연금 (4.5%)"
          value={`${Math.round(result.nationalPension).toLocaleString()}원`}
        />
        <ResultRow
          label="건강보험 (3.545%)"
          value={`${Math.round(result.healthInsurance).toLocaleString()}원`}
        />
        <ResultRow
          label="장기요양보험"
          value={`${Math.round(result.longTermCare).toLocaleString()}원`}
        />
        <ResultRow
          label="고용보험 (0.9%)"
          value={`${Math.round(result.employmentInsurance).toLocaleString()}원`}
        />
      </div>
    </div>
  </div>
);

// 재사용 가능한 결과 행 컴포넌트
const ResultRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm">{label}</span>
    <span className={`font-medium ${highlight || ""}`}>{value}</span>
  </div>
);

// 급여 정보 컴포넌트
const SalaryInfo = () => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h4 className="font-semibold text-blue-800 mb-2">💡 계산 기준</h4>
    <ul className="text-sm text-blue-700 space-y-1">
      <li>• 2024년 기준 4대보험료 및 세율 적용</li>
      <li>• 소득공제 및 세액공제는 기본 항목만 적용</li>
      <li>• 실제 수령액은 회사 정책에 따라 차이가 있을 수 있습니다</li>
      <li>• 정확한 계산은 급여담당자나 세무사에게 문의하세요</li>
    </ul>
  </div>
);

export default SalaryCalculator;
