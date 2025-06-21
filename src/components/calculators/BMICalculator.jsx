import { useState } from "react";
import { Calculator } from "lucide-react";
import CalculatorLayout from "../ui/CalculatorLayout";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ResultCard from "../ui/ResultCard";
import { useCalculator } from "../../hooks/useCalculator";
import { validatePositiveNumber } from "../../utils/formatters";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const { result, setResult, reset } = useCalculator();

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) {
      return {
        category: "저체중",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      };
    } else if (bmi < 23) {
      return {
        category: "정상체중",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    } else if (bmi < 25) {
      return {
        category: "과체중",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      };
    } else if (bmi < 30) {
      return {
        category: "경도비만",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      };
    } else if (bmi < 35) {
      return {
        category: "중등도비만",
        color: "text-red-600",
        bgColor: "bg-red-100",
      };
    } else {
      return {
        category: "고도비만",
        color: "text-red-800",
        bgColor: "bg-red-200",
      };
    }
  };

  const getIdealWeightRange = (heightInM) => {
    const minWeight = 18.5 * heightInM * heightInM;
    const maxWeight = 22.9 * heightInM * heightInM;
    return { min: minWeight, max: maxWeight };
  };

  const calculate = () => {
    if (!validatePositiveNumber(height) || !validatePositiveNumber(weight)) {
      alert("올바른 수치를 입력해주세요.");
      return;
    }

    const heightInM = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const bmi = weightInKg / (heightInM * heightInM);
    const category = getBMICategory(bmi);
    const idealWeight = getIdealWeightRange(heightInM);

    setResult({
      bmi: bmi.toFixed(1),
      category: category.category,
      categoryColor: category.color,
      categoryBgColor: category.bgColor,
      height: parseFloat(height),
      weight: weightInKg,
      idealWeightMin: idealWeight.min.toFixed(1),
      idealWeightMax: idealWeight.max.toFixed(1),
      weightDifference: weightInKg - (idealWeight.min + idealWeight.max) / 2,
    });
  };

  const handleReset = () => {
    reset(() => {
      setHeight("");
      setWeight("");
    });
  };

  const getCopyText = () => {
    if (!result) return "";
    return `신장: ${result.height}cm\n체중: ${result.weight}kg\nBMI: ${result.bmi}\n분류: ${result.category}`;
  };

  return (
    <CalculatorLayout
      title="BMI 계산기"
      description="체질량지수를 계산하여 건강상태를 확인해보세요"
      emoji="❤️⚖️"
    >
      <div className="space-y-6">
        <Input
          label="신장 (cm)"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="예: 170"
          step="0.1"
        />

        <Input
          label="체중 (kg)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="예: 65"
          step="0.1"
        />

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
            <div className="text-center mb-6">
              <div className="text-4xl font-bold mb-2">{result.bmi}</div>
              <div
                className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${result.categoryBgColor} ${result.categoryColor}`}
              >
                {result.category}
              </div>
            </div>

            <div className="space-y-4">
              <ResultRow label="신장" value={`${result.height}cm`} />
              <ResultRow label="체중" value={`${result.weight}kg`} />
              <ResultRow
                label="이상 체중 범위"
                value={`${result.idealWeightMin}kg - ${result.idealWeightMax}kg`}
              />
            </div>

            {result.weightDifference !== 0 && (
              <div className="mt-4 p-4 bg-white bg-opacity-30 rounded-lg text-center">
                <div className="text-sm">이상 체중 대비</div>
                <div className="text-lg font-bold">
                  {result.weightDifference > 0 ? "+" : ""}
                  {result.weightDifference.toFixed(1)}kg
                </div>
              </div>
            )}
          </ResultCard>
        )}

        <BMIGuide />
      </div>
    </CalculatorLayout>
  );
};

// 재사용 가능한 결과 행 컴포넌트
const ResultRow = ({ label, value }) => (
  <div className="flex justify-between items-center p-4 bg-white bg-opacity-20 rounded-lg">
    <span>{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

// BMI 가이드 컴포넌트
const BMIGuide = () => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-semibold text-gray-800 mb-3">📊 BMI 분류 기준</h4>
    <div className="space-y-2 text-sm">
      {[
        { label: "저체중", range: "18.5 미만", color: "text-blue-600" },
        { label: "정상체중", range: "18.5 - 22.9", color: "text-green-600" },
        { label: "과체중", range: "23.0 - 24.9", color: "text-yellow-600" },
        { label: "경도비만", range: "25.0 - 29.9", color: "text-orange-600" },
        { label: "중등도비만", range: "30.0 - 34.9", color: "text-red-600" },
        { label: "고도비만", range: "35.0 이상", color: "text-red-800" },
      ].map(({ label, range, color }) => (
        <div key={label} className="flex justify-between py-1">
          <span>{label}</span>
          <span className={`font-medium ${color}`}>{range}</span>
        </div>
      ))}
    </div>
  </div>
);

export default BMICalculator;
