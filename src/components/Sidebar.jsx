import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, X } from "lucide-react";

const Sidebar = ({ isOpen, onClose, calculators }) => {
  const [expandedCategories, setExpandedCategories] = useState(["finance"]);
  const location = useLocation();

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:relative inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
          <h2 className="text-lg font-semibold text-gray-900">메뉴</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {Object.entries(calculators).map(([categoryId, category]) => {
            const Icon = category.icon;
            const isExpanded = expandedCategories.includes(categoryId);

            return (
              <div key={categoryId} className="mb-4">
                <button
                  onClick={() => toggleCategory(categoryId)}
                  className="flex items-center justify-between w-full p-3 text-left text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-3 text-gray-500" />
                    {category.title}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {isExpanded && category.items.length > 0 && (
                  <div className="mt-2 ml-8 space-y-1">
                    {category.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isActive = location.pathname === item.path;

                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          onClick={() => onClose()}
                          className={`
                            flex items-center p-3 text-sm rounded-lg transition-colors duration-200
                            ${
                              isActive
                                ? "bg-primary-50 text-primary-700 border-l-4 border-primary-500"
                                : "text-gray-600 hover:bg-gray-50"
                            }
                          `}
                        >
                          <ItemIcon
                            className={`h-4 w-4 mr-3 ${
                              isActive ? "text-primary-500" : "text-gray-400"
                            }`}
                          />
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
