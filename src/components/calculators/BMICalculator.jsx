import { useState } from "react";
import { Calculator, Copy, Heart } from "lucide-react";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

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
    const heightInM = (parseFloat(height) || 0) / 100;
    const weightInKg = parseFloat(weight) || 0;

    if (heightInM > 0 && weightInKg > 0) {
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
    }
  };

  const reset = () => {
    setHeight("");
    setWeight("");
    setResult(null);
  };

  const copyResult = () => {
    if (result) {
      const text = `신장: ${result.height}cm\n체중: ${result.weight}kg\nBMI: ${result.bmi}\n분류: ${result.category}`;
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="calculator-card">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">❤️⚖️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BMI 계산기</h1>
          <p className="text-gray-600">
            체질량지수를 계산하여 건강상태를 확인해보세요
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              신장 (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="input-field"
              placeholder="예: 170"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              체중 (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="input-field"
              placeholder="예: 65"
              step="0.1"
            />
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

          {result && (
            <div className="result-card">
              <h3 className="text-2xl font-bold mb-6">계산 결과</h3>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold mb-2">{result.bmi}</div>
                <div
                  className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${result.categoryBgColor} ${result.categoryColor}`}
                >
                  {result.category}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white bg-opacity-20 rounded-lg">
                  <span>신장</span>
                  <span className="font-semibold">{result.height}cm</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white bg-opacity-20 rounded-lg">
                  <span>체중</span>
                  <span className="font-semibold">{result.weight}kg</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white bg-opacity-20 rounded-lg">
                  <span>이상 체중 범위</span>
                  <span className="font-semibold">
                    {result.idealWeightMin}kg - {result.idealWeightMax}kg
                  </span>
                </div>
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

          {/* BMI 지수 표 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">
              📊 BMI 분류 기준
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1">
                <span>저체중</span>
                <span className="text-blue-600 font-medium">18.5 미만</span>
              </div>
              <div className="flex justify-between py-1">
                <span>정상체중</span>
                <span className="text-green-600 font-medium">18.5 - 22.9</span>
              </div>
              <div className="flex justify-between py-1">
                <span>과체중</span>
                <span className="text-yellow-600 font-medium">23.0 - 24.9</span>
              </div>
              <div className="flex justify-between py-1">
                <span>경도비만</span>
                <span className="text-orange-600 font-medium">25.0 - 29.9</span>
              </div>
              <div className="flex justify-between py-1">
                <span>중등도비만</span>
                <span className="text-red-600 font-medium">30.0 - 34.9</span>
              </div>
              <div className="flex justify-between py-1">
                <span>고도비만</span>
                <span className="text-red-800 font-medium">35.0 이상</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 건강 정보</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • BMI는 체질량지수로 비만도를 나타내는 국제적인 기준입니다
              </li>
              <li>• 근육량이 많은 경우 실제보다 높게 측정될 수 있습니다</li>
              <li>• 정확한 건강상태는 의료진과 상담하시기 바랍니다</li>
              <li>• 꾸준한 운동과 균형잡힌 식단이 건강의 핵심입니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
