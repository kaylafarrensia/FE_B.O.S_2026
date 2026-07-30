import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePopup = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    type: 'info',
    heading: '',
    message: '',
    buttonText: 'Continue',
  });

  const showPopup = (popupConfig) => {
    setConfig({
      ...popupConfig,
      buttonText: popupConfig.buttonText || 'Continue',
    });
    setIsOpen(true);
  };

  const hidePopup = () => {
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    if (config.onButtonClick) {
      config.onButtonClick();
    }

    if (config.buttonClickUrl) {
      navigate(config.buttonClickUrl);
    } else {
      hidePopup();
    }
  };

  return {
    isOpen,
    config,
    showPopup,
    hidePopup,
    handleButtonClick,
  };
};

export default usePopup;
