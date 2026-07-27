import { cn } from '../../utils/index.js';

const BASE_CLASSES =
  'rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-3 select-none';

const SIZE_CLASSES = {
  sm: 'px-6 py-2 text-sm',
  md: 'px-8 py-3 text-base',
  lg: 'px-10 py-4 text-lg',
  responsive: 'px-8 py-2 sm:px-10 sm:py-3 text-sm sm:text-base',
};

function getVariantClasses(variant, isDisabled) {
  const variants = {
    gradient: cn(
      'text-white bg-gradient-to-r from-purple-300 to-blue-300',
      !isDisabled && 'hover:opacity-90'
    ),
    solid: cn('text-white bg-[#251369]', !isDisabled && 'hover:bg-[#814791]'),
    outline: cn(
      'text-[#251369] border-2 border-[#251369]',
      !isDisabled && 'hover:bg-[#251369] hover:text-white'
    ),
    ocean: cn(
      'text-white bg-gradient-to-r from-[rgba(12,64,118,1)] to-[rgba(68,137,212,1)]',
      !isDisabled && 'hover:opacity-90'
    ),
  };
  return variants[variant] || variants.gradient;
}

function Button({
  children,
  variant = 'ocean',
  size = 'md',
  loading = false,
  className,
  disabled,
  ...props
}) {
  const isDisabled = disabled || loading;

  const interactiveClasses = !isDisabled
    ? 'cursor-pointer hover:scale-105 transform'
    : 'opacity-50 cursor-not-allowed';

  return (
    <button
      className={cn(
        BASE_CLASSES,
        interactiveClasses,
        getVariantClasses(variant, isDisabled),
        SIZE_CLASSES[size] || SIZE_CLASSES.md,
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
}

export default Button;