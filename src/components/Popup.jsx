import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { FaCircleCheck, FaXmark, FaExclamation } from 'react-icons/fa6';
import Button from './Button';

const Popup = ({
  isOpen,
  onClose,
  type = 'info',
  customIcon,
  heading,
  message,
  children,
  buttonText,
  buttonAction = 'close',
  buttonLink,
  buttonTarget = '_self',
  onButtonClick,
  closeOnButtonClick = true,
  className,
  overlayClassName,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getIcon = () => {
    if (customIcon) return customIcon;

    switch (type) {
      case 'success':
        return (
          <FaCircleCheck className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-36 lg:h-36 text-green-500" />
        );
      case 'error':
        return (
          <FaXmark className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-36 lg:h-36 text-red-500" />
        );
      case 'info':
        return (
          <FaExclamation className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-36 lg:h-36 text-blue-500" />
        );
      default:
        return null;
    }
  };

  const getDefaultHeading = () => {
    if (heading) return heading;

    switch (type) {
      case 'success':
        return 'Success!';
      case 'error':
        return 'Error!';
      case 'info':
        return 'Information';
      default:
        return '';
    }
  };

  if (!shouldRender) return null;

  const icon = getIcon();
  const popupHeading = getDefaultHeading();

  const handleButtonClick = () => {
    switch (buttonAction) {
      case 'link':
        if (buttonLink) {
          window.open(buttonLink, buttonTarget);
        }
        break;
      case 'custom':
        if (onButtonClick) {
          onButtonClick();
        }
        break;
      case 'close':
      default:
        break;
    }

    if (closeOnButtonClick) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'transition-all duration-300 ease-out',
        isAnimating ? 'opacity-100' : 'opacity-0',
        overlayClassName
      )}
    >
      <div
        className={cn(
          'absolute inset-0 bg-black/40 transition-all duration-300 ease-out',
          isAnimating
            ? 'opacity-100 backdrop-blur-sm'
            : 'opacity-0 backdrop-blur-none'
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'relative w-full max-w-[95%] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[650px]',
          'px-6 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 md:py-10 lg:py-12',
          'bg-white/80 backdrop-blur-xl border-4 border-white/70 shadow-2xl rounded-3xl',
          'flex flex-col justify-center items-center',
          'transform transition-all duration-300 ease-out',
          isAnimating
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-90 translate-y-8',
          className
        )}
      >
        <div className="w-full flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {icon && (
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 relative overflow-hidden flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                {icon}
              </div>
            </div>
          )}

          <div className="w-full flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5">
            {popupHeading && (
              <div className="w-full text-center text-violet-950 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                {popupHeading}
              </div>
            )}

            {message && (
              <div className="w-full text-center text-violet-950 text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-relaxed">
                {message}
              </div>
            )}

            {children && (
              <div className="w-full flex flex-col items-center">
                {children}
              </div>
            )}
          </div>

          <div className="w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px] lg:max-w-[260px] mt-2">
            <Button
              onClick={handleButtonClick}
              variant="gradient"
              size="md"
              className="w-full px-6 py-3 text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold rounded-full"
            >
              {buttonText || 'OK'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
