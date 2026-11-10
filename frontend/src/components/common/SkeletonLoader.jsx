import React from 'react';

export const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  if (type === 'table') {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded-lg w-1/4"></div>
        <div className="space-y-3 pt-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 bg-slate-200 rounded w-1/6"></div>
              <div className="h-4 bg-slate-200 rounded w-2/6"></div>
              <div className="h-4 bg-slate-200 rounded w-1/6"></div>
              <div className="h-4 bg-slate-200 rounded w-2/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="h-5 bg-slate-200 rounded w-2/3"></div>
            <div className="h-5 bg-slate-200 rounded-full w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3.5 bg-slate-200 rounded w-full"></div>
            <div className="h-3.5 bg-slate-200 rounded w-4/5"></div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-8 bg-slate-200 rounded-lg w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
