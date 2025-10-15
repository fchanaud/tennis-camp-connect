import React from 'react';

export type ButtonVariant = 'primary' | 'premium' | 'outline' | 'whatsapp' | 'ghost' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#FF4C4C] text-white hover:opacity-90',
  premium: 'gradient-citrus text-white shadow-premium',
  outline: 'bg-white border-2 border-[#1E1E1E] text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-white',
  whatsapp: 'bg-[#2F7D32] text-white hover:opacity-90',
  ghost: 'bg-transparent text-[#1E1E1E] hover:bg-gray-100',
  secondary: 'bg-[#66B032] text-white hover:opacity-90',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

