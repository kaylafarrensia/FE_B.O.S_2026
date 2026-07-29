import { createPortal } from 'react-dom';
import Card from '../../../components/ui/Card.jsx';
import Button from '../../../components/ui/Button.jsx';
import IconSuccess from '../../../assets/icons/IconSuccess.svg';

export default function SavedPopup({ setIsOpen }) {
  return createPortal(
    <div className="inset-0 flex backdrop-blur-md fixed justify-center items-center z-[999] px-4">
      <Card className="flex w-full max-w-3xl flex-col items-center justify-center gap-4 sm:gap-6 text-center border-2 border-white rounded-2xl px-6 py-10 sm:px-12 sm:py-14 md:px-20 md:py-20">
        <img
          src={IconSuccess}
          alt="Check mark"
          className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32"
        />
        <div className="flex flex-col gap-2 sm:gap-3">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold md:whitespace-nowrap">
            The schedule has been successfully updated!
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Don&apos;t forget to attend the BNCC launching according to
            <br className="hidden sm:block" />
            the schedule you&apos;ve chosen.
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