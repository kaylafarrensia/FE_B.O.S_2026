import { motion } from 'framer-motion';
import BNCCLogo from '@/assets/images/BNCC.png';

const waveData = [
  { id: 1, className: 'wave-bg-1', height: '70%', xDirection: ['0%', '-50%'], yBob: ['0px', '15px'], xDuration: 10, yDuration: 1 },
  { id: 2, className: 'wave-bg-2', height: '95%', xDirection: ['0%', '-50%'], yBob: ['0px', '25px'], xDuration: 12, yDuration: 1.5 },
  { id: 3, className: 'wave-bg-3', height: '60%', xDirection: ['-50%', '0%'], yBob: ['0px', '12px'], xDuration: 9, yDuration: 2.5 },
  { id: 4, className: 'wave-bg-4', height: '100%', xDirection: ['-50%', '0%'], yBob: ['0px', '28px'], xDuration: 15, yDuration: 1 },
  { id: 5, className: 'wave-bg-5', height: '80%', xDirection: ['-50%', '0%'], yBob: ['0px', '20px'], xDuration: 10, yDuration: 1.5 },
];

const Footer = () => {
  return (
    <footer className="relative w-full h-[60vh] max-h-[400px] md:max-h-[500px] overflow-hidden bg-transparent">
      <div className="absolute bottom-0 left-0 w-full h-[95%] pointer-events-none">
        {waveData.map((wave) => (
          <motion.div
            key={wave.id}
            className="absolute bottom-0 left-0 flex w-full"
            animate={{ x: wave.xDirection, y: wave.yBob }}
            transition={{
              x: { repeat: Infinity, duration: wave.xDuration, ease: 'linear', repeatType: 'loop' },
              y: { repeat: Infinity, duration: wave.yDuration, ease: 'easeInOut', repeatType: 'mirror' },
            }}
            style={{
              width: '200%',
              height: wave.height,
              willChange: 'transform',
            }}
          >
            <div className={`w-1/2 wave-bg ${wave.className}`} />
            <div className={`w-1/2 wave-bg ${wave.className}`} />
          </motion.div>
        ))}
      </div>

      <div className="absolute z-10 flex flex-col items-center w-full px-4 -translate-x-1/2 bottom-12 md:bottom-16 left-1/2">
        <img
          src={BNCCLogo}
          alt="BNCC Logo"
          className="w-auto h-4 mb-3 md:h-7 2xl:h-14"
        />
        <p className="w-1/2 text-xs text-center text-white md:text-sm">
          All Rights Reserved BNCC 2026 © Bina Nusantara Computer Club
        </p>
      </div>
    </footer>
  );
};

export default Footer;
