// BMI 카테고리 상수
export const BMI_CATEGORIES = [
  {
    min: 0,
    max: 18.5,
    label: "저체중",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    min: 18.5,
    max: 23,
    label: "정상체중",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    min: 23,
    max: 25,
    label: "과체중",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    min: 25,
    max: 30,
    label: "경도비만",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    min: 30,
    max: 35,
    label: "중등도비만",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    min: 35,
    max: Infinity,
    label: "고도비만",
    color: "text-red-800",
    bgColor: "bg-red-200",
  },
];

// 복권 종류 상수
export const LOTTERY_TYPES = {
  lotto: { name: "로또 6/45", ticketPrice: 1000 },
  pension: { name: "연금복권", ticketPrice: 1000 },
  scratch: { name: "즉석복권", ticketPrice: 1000 },
  other: { name: "기타 복권", ticketPrice: 1000 },
};

// 대출 상환 방식 상수
export const LOAN_TYPES = {
  equal_installment: "원리금균등",
  equal_principal: "원금균등",
};

// 공통 에러 메시지
export const ERROR_MESSAGES = {
  INVALID_NUMBER: "올바른 숫자를 입력해주세요.",
  POSITIVE_NUMBER_REQUIRED: "양수를 입력해주세요.",
  REQUIRED_FIELD: "필수 항목입니다.",
  CALCULATION_ERROR: "계산 중 오류가 발생했습니다.",
};
