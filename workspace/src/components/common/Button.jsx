import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'outline'
  className = '',
  isLoading, // Extract to prevent passing to DOM
  ...props
}) => {
  // Updated Base Styles: Rounded-full, nice transitions
  let baseStyles = 'px-6 py-3 rounded-full text-base font-bold transition-all duration-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      // Elegant White/Black style from Landing Page
      variantStyles = 'bg-white text-black hover:bg-gray-100 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] focus:ring-white/50 border border-transparent';
      break;
    case 'secondary':
      // Glassmorphism style
      variantStyles = 'bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md focus:ring-gray-500';
      break;
    case 'danger':
      // Red adapted to new style
      variantStyles = 'bg-red-600/10 border border-red-500/50 text-red-500 hover:bg-red-600/20 hover:text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] focus:ring-red-500';
      break;
    case 'outline':
      variantStyles = 'border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400 hover:text-white focus:ring-indigo-500';
      break;
    case 'success':
      variantStyles = 'bg-emerald-600/10 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-600/20 hover:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] focus:ring-emerald-500';
      break;
    case 'link':
      variantStyles = 'text-indigo-400 hover:text-indigo-300 hover:underline focus:ring-indigo-500 p-0 shadow-none px-0 py-0 h-auto rounded-none active:scale-100';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5';
      break;
    case 'custom':
      variantStyles = ''; // No default styling, full control via className
      break;
    default:
      variantStyles = 'bg-white text-black hover:bg-gray-100 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] focus:ring-white/50';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
