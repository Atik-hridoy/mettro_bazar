import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const styles = {
    primary: 'bg-primary-light text-primary-dark border border-primary/20',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200',
    accent: 'bg-amber-50 text-amber-700 border border-amber-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
