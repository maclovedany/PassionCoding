import {
  Calculator,
  DollarSign,
  Home,
  ShoppingCart,
  Heart,
  Clock,
  Code,
  TrendingUp,
  Coins,
  Gift,
  PiggyBank,
  CreditCard,
} from "lucide-react";

const calculators = {
  finance: {
    title: "금융/투자 계산기",
    icon: TrendingUp,
    items: [
      {
        id: "stock-average",
        title: "주식 평단가 계산기",
        description: "매수/매도 시 평균 단가를 계산합니다",
        icon: TrendingUp,
        path: "/calc/stock-average",
      },
      {
        id: "lottery",
        title: "로또 실수령액 계산기",
        description: "복권 당첨금의 세후 실수령액을 계산합니다",
        icon: Gift,
        path: "/calc/lottery",
      },
      {
        id: "salary",
        title: "연봉 실수령액 계산기",
        description: "연봉 대비 월 실수령액을 계산합니다",
        icon: DollarSign,
        path: "/calc/salary",
      },
    ],
  },
  loan: {
    title: "대출/부동산 계산기",
    icon: Home,
    items: [
      {
        id: "mortgage",
        title: "주택담보대출 계산기",
        description: "대출 원리금 상환액을 계산합니다",
        icon: Home,
        path: "/calc/mortgage",
      },
    ],
  },
  life: {
    title: "생활/소비 계산기",
    icon: ShoppingCart,
    items: [
      {
        id: "discount",
        title: "할인율 계산기",
        description: "할인된 가격을 계산합니다",
        icon: ShoppingCart,
        path: "/calc/discount",
      },
    ],
  },
  health: {
    title: "건강/운동 계산기",
    icon: Heart,
    items: [
      {
        id: "bmi",
        title: "BMI 계산기",
        description: "체질량지수를 계산합니다",
        icon: Heart,
        path: "/calc/bmi",
      },
    ],
  },
};

export default calculators;
