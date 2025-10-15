import React from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
}

export function Alert({ children, variant = 'info', className = '' }: AlertProps) {
  return (
    <div className={`alert alert-${variant} ${className}`}>
      {children}
    </div>
  );
}

