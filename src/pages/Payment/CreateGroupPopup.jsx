import { createPortal } from 'react-dom';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import IconSuccess from '@/assets/icons/IconSuccess.svg';

export default function CreateGroupPopup({ setIsOpen, groupCode }) {
  return createPortal(
    <div className="inset-0 flex backdrop-blur-md fixed justify-center items-center z-[999] px-4">
      <Card className="flex w-full max-w-3xl flex-col items-center justify-center gap-4 sm:gap-6 text-center border-2 border-white rounded-2xl px-6 py-10 sm:px-12 sm:py-14 md:px-20 md:py-20">
        <img
          src={IconSuccess}
          alt="Check mark"
          className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32"
        />
        <div className="flex flex-col items-center gap-5">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold md:whitespace-nowrap">
            Awesome! Your Group Code is ready!
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-lg sm:text-2xl text-[#0A2745]">
              Your Group Code:
            </p>

            <div
              className="
                rounded-lg
                border
                border-[#0A2745]
                bg-white/40
                px-6
                py-2
                text-xl
                sm:text-2xl
                font-medium
                text-[#0A2745]
              "
            >
              {groupCode}
            </div>
          </div>
          <p className="text-sm sm:text-base">
            Each group member must use the group code shown above.
          </p>
        </div>
        <Button className="rounded-lg px-10 sm:px-14 w-auto" onClick={() => setIsOpen(false)}>
          OK
        </Button>
      </Card>
    </div>,
    document.body
  );
}