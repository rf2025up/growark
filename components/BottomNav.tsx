import React from 'react';
import { Home, Users, CheckSquare, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/class', label: '班级', icon: Users },
    { path: '/habit', label: '习惯', icon: CheckSquare },
    { path: '/settings', label: '设置', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 flex justify-between items-center z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 w-16 transition-colors ${
              isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;