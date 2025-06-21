import React from "react";

const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  icon: Icon,
  ...props
}) => {
  const baseClasses =
    "font-semibold rounded-lg transition-all duration-200 flex items-center justify-center";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg transform hover:-translate-y-0.5",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    ghost: "bg-white bg-opacity-20 hover:bg-opacity-30 text-white",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {Icon && <Icon className="h-5 w-5 mr-2" />}
      {children}
    </button>
  );
};

export default Button;
