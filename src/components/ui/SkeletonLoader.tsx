import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-slate-100 rounded-2xl p-4 flex flex-col gap-3 h-80">
          <div className="bg-slate-200 rounded-xl h-44 w-full" />
          <div className="bg-slate-200 rounded-md h-5 w-3/4" />
          <div className="bg-slate-200 rounded-md h-4 w-1/2" />
          <div className="mt-auto flex justify-between items-center">
            <div className="bg-slate-200 rounded-md h-6 w-20" />
            <div className="bg-slate-200 rounded-xl h-9 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};
