import { Menu } from "lucide-react";

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 ml-2">
            AllCalc
            <span className="text-sm font-normal text-gray-500 ml-2">
              통합 계산기 플랫폼
            </span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
