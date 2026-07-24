import { Check } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Button from '../../../components/ui/Button.jsx';
import IconView from '../../../assets/icons/IconView.svg';

const GUIDELINE_URL = 'https://drive.google.com/file/d/1ijlECABgoRxsXFxZeiw_vXNQZ2-iesvl/view?usp=sharing';

export default function GuidelineSection({ hasReadGuideline, setHasReadGuideline }) {
  return (
    <Card className="flex flex-col rounded-xl border-white border-[3px] gap-4 px-7 py-6 sm:px-14 sm:py-10 xl:px-16 xl:py-12 sm:gap-6">
      <div className="flex flex-col gap-3.5 sm:gap-5">
        <h2 className="text-lg font-bold sm:text-3xl w-fit">
          JaPres Guideline
        </h2>
        <p className="relative leading-5 sm:leading-10 text-xs sm:text-lg xl:text-xl">
          Before submitting your application, please read the official JaPres
          guideline which contains full instructions, requirements, and
          evaluation criteria.
        </p>
      </div>
      <Button
        className="w-fit h-fit"
        onClick={() => window.open(GUIDELINE_URL, '_blank', 'noopener,noreferrer')}
      >
        <img src={IconView} alt="" className="w-4 sm:w-5" />
        View Guideline
      </Button>
      <label
        htmlFor="guideline-check"
        className="flex items-center gap-2 cursor-pointer sm:gap-3"
      >
        <input
          type="checkbox"
          id="guideline-check"
          className="sr-only peer"
          checked={hasReadGuideline}
          onChange={() => setHasReadGuideline(!hasReadGuideline)}
        />
        <div
          className={`flex items-center justify-center size-3 sm:size-5 transition-colors border-2 rounded-sm shrink-0 ${hasReadGuideline ? 'bg-persian-indigo' : 'bg-transparent'}`}
        >
          <Check
            className={`size-2 sm:size-4 text-white transition-opacity ${hasReadGuideline ? 'opacity-100' : 'opacity-0'}`}
            strokeWidth={3}
            aria-hidden="true"
          />
        </div>
        <span className="text-[9px] sm:text-sm font-medium select-none">
          I have read and understood the entire guideline document.
        </span>
      </label>
    </Card>
  );
}