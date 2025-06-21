import React from "react";

const CalculatorLayout = ({
  title,
  description,
  emoji,
  children,
  maxWidth = "max-w-2xl",
}) => {
  return (
    <div className={`${maxWidth} mx-auto`}>
      <div className="calculator-card">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">{emoji}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default CalculatorLayout;
