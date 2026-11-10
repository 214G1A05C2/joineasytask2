import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Format breadcrumb text
  const formatText = (text) => {
    if (text.startsWith('course_') || text.startsWith('assign_')) {
      return text.replace('course_', 'Course ').replace('assign_', 'Assignment ');
    }
    return text.charAt(0).toUpperCase() + text.slice(1).replace(/-/g, ' ');
  };

  return (
    <nav className="flex items-center text-xs sm:text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap py-1">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Joineazy</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="text-slate-900 font-semibold">{formatText(name)}</span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-indigo-600 transition-colors"
              >
                {formatText(name)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
