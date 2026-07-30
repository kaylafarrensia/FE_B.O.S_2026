import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  IoEye,
  IoEyeOff,
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5';

const Input = forwardRef(function Input(
  {
    label,
    disabled,
    required = false,
    placeholder,
    type = 'text',
    errorMessage,
    className,
    labelClassName,
    inputClassName,
    onBlur,
    showPasswordRequirements = false,
    value,
    name,
    autoComplete = 'off',
    maxLength,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const pwd = password || '';
    return {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
    };
  };

  const passwordValidation = isPasswordType ? validatePassword(value) : null;

  const passValidation = [
    {
      text: 'Password must be at least 8 characters long',
      isValid: passwordValidation?.minLength || false,
    },
    {
      text: 'Password must contain at least one uppercase letter',
      isValid: passwordValidation?.hasUppercase || false,
    },
    {
      text: 'Password must contain at least one lowercase letter',
      isValid: passwordValidation?.hasLowercase || false,
    },
  ];

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

      <div className="relative">
        <input
          {...props}
          ref={ref}
          value={value}
          name={name}
          placeholder={placeholder}
          onBlur={onBlur}
          disabled={disabled}
          type={inputType}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={cn(
            'text-[11px] sm:text-[14px] md:text-[16px] !text-persianIndigo !bg-[#F7F7F51A] focus:!bg-[#F7F7F540] px-[16.5px] sm:px-[21px] md:px-[24px] py-[8.5px] sm:py-[10.5px] md:py-[12px] border border-persianIndigo rounded-[6px] sm:rounded-[7px] md:rounded-[8px] w-full disabled:text-slate-400 focus:border-purple-600 outline-none transition-all duration-200 ease-in-out placeholder:text-purple-400',
            isPasswordType && 'pr-[45px] sm:pr-[50px] md:pr-[55px]',
            errorMessage && 'border-red-400',
            inputClassName
          )}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-[12px] sm:right-[15px] md:right-[18px] top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-persianIndigo transition-colors duration-200 cursor-pointer"
          >
            {showPassword ? (
              <IoEyeOff className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px]" />
            ) : (
              <IoEye className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px]" />
            )}
          </button>
        )}
      </div>

      {isPasswordType && showPasswordRequirements && (
        <div className="mt-2 space-y-1">
          {passValidation.map((requirement, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-2 text-[10px] sm:text-[13px] md:text-[14px] transition-colors duration-200',
                requirement.isValid ? 'text-green-600' : 'text-red-500'
              )}
            >
              {requirement.isValid ? (
                <IoCheckmarkCircleOutline className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px] flex-shrink-0" />
              ) : (
                <IoInformationCircleOutline className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px] flex-shrink-0" />
              )}
              <span>{requirement.text}</span>
            </div>
          ))}
        </div>
      )}

      {errorMessage && (
        <div className="mt-1 ml-0 text-red-500 text-[11px] sm:text-[14px] md:text-[16px]">
          {errorMessage}
        </div>
      )}
    </div>
  );
});

export default Input;
