import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { IoChevronDown } from 'react-icons/io5';

const Select = forwardRef(function Select(
  {
    label,
    disabled,
    required = false,
    placeholder = 'Select an option',
    errorMessage,
    className,
    labelClassName,
    selectClassName,
    onBlur,
    onChange,
    value,
    options = [],
    onSelect,
    ...props
  },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    if (onChange) {
      onChange(e);
    }
    if (onSelect) {
      onSelect(selectedValue);
    }
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = (e) => {
    setIsOpen(false);
    onBlur?.(e);
  };

  return (
    <div className={cn('mb-4', className)}>
      <div className="flex justify-between">
        {label && (
          <label
            className={
              labelClassName ??
              'pb-1 font-medium text-persianIndigo text-[14px] sm:text-[16px] md:text-[18px]'
            }
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
      </div>

      <div className="relative group">
        <select
          {...props}
          ref={ref}
          value={value || ''}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={disabled}
          autoComplete="off"
          className={cn(
            'text-[11px] sm:text-[14px] md:text-[16px] !text-persianIndigo !bg-[#F7F7F51A] focus:!bg-[#F7F7F540] px-[16.5px] sm:px-[21px] md:px-[24px] py-[8.5px] sm:py-[10.5px] md:py-[12px] border border-persianIndigo rounded-[6px] sm:rounded-[7px] md:rounded-[8px] w-full focus:border-purple-600 outline-none transition-all duration-300 ease-in-out appearance-none cursor-pointer pr-[45px] sm:pr-[50px] md:pr-[55px]',
            disabled &&
              '!bg-[#F7F7F52A] !text-gray-400 cursor-not-allowed hover:border-gray-300',
            errorMessage && 'border-red-400',
            selectClassName
          )}
        >
          <option value="" disabled className="text-gray-400 bg-white">
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-[#251369] bg-white"
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-[12px] sm:right-[15px] md:right-[18px] top-1/2 transform -translate-y-1/2 pointer-events-none">
          <IoChevronDown
            className={cn(
              'w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] text-persianIndigo transition-all duration-300 ease-in-out',
              isOpen && 'rotate-180 text-purple-600',
              disabled && 'text-gray-400'
            )}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="mt-1 ml-0 text-red-500 text-[11px] sm:text-[14px] md:text-[16px]">
          {errorMessage}
        </div>
      )}
    </div>
  );
});

export default Select;
