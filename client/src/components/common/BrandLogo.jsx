import React from 'react';

/**
 * Quantum Vedic Enterprise Brand Logo
 * Geometric QV Monogram with Lineage & Data-Node Architecture
 * 100% Vector, Flat, Monochrome-Compatible, Zero AI Imagery
 */
export const BrandLogo = ({ size = 32, className = '' }) => {
  return (
    <div 
      className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-[#182238] border border-[#2B3A5A] text-slate-100 ${className}`}
      style={{ width: size, height: size }}
      title="Quantum Vedic Enterprise"
    >
      <svg
        width={size * 0.72}
        height={size * 0.72}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Q Ring / Data Boundary */}
        <circle
          cx="14"
          cy="14"
          r="9"
          stroke="#93C5FD"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Diagonal Q Leg extending into V-node lineage */}
        <path
          d="M20 20L26 26"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Embedded V line connecting lineage nodes */}
        <path
          d="M10 11L14 18L18 11"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Subtle lineage nodes */}
        <circle cx="10" cy="11" r="1.5" fill="#60A5FA" />
        <circle cx="18" cy="11" r="1.5" fill="#60A5FA" />
        <circle cx="14" cy="18" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

export default BrandLogo;
