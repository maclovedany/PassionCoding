import { useState } from "react";

export const useCalculator = () => {
  const [result, setResult] = useState(null);

  const reset = (resetFunction) => {
    if (resetFunction) {
      resetFunction();
    }
    setResult(null);
  };

  const copyResult = (resultText) => {
    if (resultText && navigator.clipboard) {
      navigator.clipboard.writeText(resultText);
    }
  };

  const formatNumber = (number) => {
    if (!number && number !== 0) return "";
    return Number(number).toLocaleString();
  };

  return {
    result,
    setResult,
    reset,
    copyResult,
    formatNumber,
  };
};
