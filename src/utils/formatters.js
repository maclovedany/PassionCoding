// 숫자 포맷팅 유틸리티
export const formatNumber = (number) => {
  if (!number && number !== 0) return "";
  return Number(number).toLocaleString();
};

// 통화 포맷팅
export const formatCurrency = (number) => {
  return `${formatNumber(number)}원`;
};

// 백분율 포맷팅
export const formatPercent = (number, decimals = 1) => {
  if (!number && number !== 0) return "";
  return `${Number(number).toFixed(decimals)}%`;
};

// 입력값 검증
export const validatePositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

// 입력값을 숫자로 변환 (쉼표 제거)
export const parseNumber = (value) => {
  if (typeof value === "string") {
    return parseFloat(value.replace(/,/g, ""));
  }
  return parseFloat(value);
};
