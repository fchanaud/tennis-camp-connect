import React from 'react';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  style?: React.CSSProperties;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-[#FF4C4C] text-white',
  success: 'bg-[#66B032] text-white',
  warning: 'bg-[#FFD633] text-[#1E1E1E]',
  danger: 'bg-red-600 text-white',
  info: 'bg-[#2563EB] text-white',
  secondary: 'bg-gray-500 text-white',
};

export function Badge({ children, variant = 'primary', className = '', style }: BadgeProps) {
  return (
    <span className={`badge ${variantClasses[variant]} ${className}`} style={style}>
      {children}
    </span>
  );
}

