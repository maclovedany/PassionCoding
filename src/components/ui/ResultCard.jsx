import React from "react";
import { Copy } from "lucide-react";
import Button from "./Button";

const ResultCard = ({ title, children, onCopy, copyText }) => {
  const handleCopy = () => {
    if (copyText && navigator.clipboard) {
      navigator.clipboard.writeText(copyText);
    }
    if (onCopy) {
      onCopy();
    }
  };

  return (
    <div className="result-card">
      <h3 className="text-2xl font-bold mb-6">{title}</h3>
      {children}
      {(onCopy || copyText) && (
        <div className="flex justify-center mt-6">
          <Button variant="ghost" size="sm" onClick={handleCopy} icon={Copy}>
            결과 복사
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
