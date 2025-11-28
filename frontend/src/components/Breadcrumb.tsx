import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const location = useLocation();

  // Auto-generate breadcrumb from path if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Trang chủ', path: '/' }];

    pathnames.forEach((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      let label = value;

      // Map paths to Vietnamese labels
      const labelMap: Record<string, string> = {
        lessons: 'Bài học',
        tests: 'Bài kiểm tra',
        profile: 'Hồ sơ',
        library: 'Thư viện',
        pronunciation: 'Phát âm',
        admin: 'Quản trị',
        login: 'Đăng nhập',
        register: 'Đăng ký',
      };

      if (labelMap[value]) {
        label = labelMap[value];
      } else if (!isNaN(Number(value))) {
        // If it's a number (ID), try to get name from context
        const prevPath = pathnames[index - 1];
        if (prevPath === 'lessons') {
          label = 'Chi tiết bài học';
        } else if (prevPath === 'tests') {
          label = 'Chi tiết bài kiểm tra';
        } else {
          label = `#${value}`;
        }
      } else {
        // Capitalize first letter
        label = value.charAt(0).toUpperCase() + value.slice(1);
      }

      breadcrumbs.push({ label, path: to });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-400 mx-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {isLast ? (
                <span className="text-gray-900 font-semibold">{item.label}</span>
              ) : item.path ? (
                <Link
                  to={item.path}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-600">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

