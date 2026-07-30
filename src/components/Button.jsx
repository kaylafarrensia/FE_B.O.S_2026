import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Button = forwardRef(function Button(
  {
    children,
    variant = 'gradient',
    size = 'md',
    loading = false,
    className,
    disabled,
    type = 'button',
    ...props
  },
  ref
) {
  const baseClasses =
    'rounded-full font-semibold hover:scale-105 transition-all duration-300 ease-in-out transform flex items-center justify-center gap-2 cursor-pointer';

  const variantClasses = {
    gradient:
      'text-white bg-gradient-to-r from-purple-400 to-blue-400 hover:opacity-90',
    solid: 'text-white bg-[#251369] hover:bg-[#9084CD]',
    outline:
      'text-[#251369] border-2 border-[#251369] hover:bg-[#251369] hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && 'opacity-50 cursor-not-allowed hover:scale-100',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
      )}
      {loading ? 'Loading...' : children}
    </button>
  );
});

export default Button;
