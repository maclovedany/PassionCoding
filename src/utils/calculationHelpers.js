// BMI 계산
export const calculateBMI = (height, weight) => {
  const heightM = height / 100;
  return weight / (heightM * heightM);
};

// 이상 체중 범위 계산
export const calculateIdealWeight = (height) => {
  const heightM = height / 100;
  return {
    min: 18.5 * heightM * heightM,
    max: 22.9 * heightM * heightM,
  };
};

// 복리 계산
export const calculateCompoundInterest = (principal, rate, periods) => {
  return principal * Math.pow(1 + rate / 100, periods);
};

// 원리금균등 월 상환액 계산
export const calculateEqualInstallment = (principal, monthlyRate, months) => {
  if (monthlyRate === 0) return principal / months;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
};

// 세금 계산 (기타소득세)
export const calculateOtherIncomeTax = (taxableAmount) => {
  if (taxableAmount <= 50000) return 0;
  if (taxableAmount <= 300000000) return taxableAmount * 0.22;

  const baseTax = 300000000 * 0.22;
  const excessTax = (taxableAmount - 300000000) * 0.33;
  return baseTax + excessTax;
};

// 4대보험료 계산
export const calculateSocialInsurance = (salary) => {
  return {
    nationalPension: salary * 0.045, // 국민연금 4.5%
    healthInsurance: salary * 0.03545, // 건강보험 3.545%
    employmentInsurance: salary * 0.009, // 고용보험 0.9%
    industrialAccident: 0, // 산재보험은 사업주 부담
  };
};
