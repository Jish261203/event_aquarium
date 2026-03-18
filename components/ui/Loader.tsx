import React from 'react';

const Loader = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center w-full min-h-[60vh] ${className}`}>
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Animated spinner with styled borders */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary-500 border-t-transparent shadow-[0_0_15px_rgba(30,58,138,0.3)]"></div>
        <p className="text-lg font-semibold text-primary-500 animate-pulse tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;
