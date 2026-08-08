import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs sm:text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 text-sm transition-all duration-200 ${
            error ? 'border-rose-500 focus:ring-rose-200' : ''
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
