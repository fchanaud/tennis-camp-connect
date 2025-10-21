import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  premium?: boolean;
}

export function Card({ children, className = '', hover = false, premium = false }: CardProps) {
  const baseClasses = 'bg-white rounded-xl border-2 border-[rgba(102,176,50,0.2)] transition-all duration-300';
  const shadowClass = premium ? 'shadow-premium' : 'shadow-soft';
  const hoverClass = hover ? 'hover:shadow-premium hover:scale-[1.02] hover:border-[rgba(255,214,51,0.3)]' : '';
  
  return (
    <div className={`${baseClasses} ${shadowClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-xl font-bold mb-3 ${className}`}>{children}</h3>;
}

export function CardText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-gray-600 ${className}`}>{children}</p>;
}

