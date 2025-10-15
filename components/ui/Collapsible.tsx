'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  premium?: boolean;
}

export function Collapsible({ title, children, defaultOpen = false, className = '', premium = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`accordion-item ${className}`}>
      <button
        className={`accordion-button ${isOpen ? 'bg-[#FFF9E6]' : ''} ${premium ? 'gradient-citrus text-white' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="accordion-body">
          {children}
        </div>
      )}
    </div>
  );
}

