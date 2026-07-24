import Card from '../../../components/ui/Card.jsx';
import Button from '../../../components/ui/Button.jsx';
import IconLine from '../../../assets/icons/IconLine.svg';
import Team from '../../../assets/images/Team.svg';

const DUMMY_CONTACT = {
  name: 'BNCC Official',
  line: '211guyli',
  wa: '6285178100246',
};

export default function ContactPerson() {
  const openWhatsApp = (number) => {
    const formatted = number.startsWith('0') ? number.slice(1) : number;
    window.open(`https://wa.me/${formatted}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="flex flex-row px-7 py-6 sm:px-14 sm:py-8 xl:px-16 rounded-xl border-white border-[3px]">
      <div className="flex-1 flex flex-col justify-center items-start gap-4">
        <h1 className="font-bold sm:text-3xl text-xl w-fit">Contact Person</h1>
        <div className="flex flex-row gap-3 items-center">
          <img src={IconLine} alt="" className="w-5 sm:w-7" />
          <p className="text-xs sm:text-base">
            {DUMMY_CONTACT.line} ({DUMMY_CONTACT.name})
          </p>
        </div>
        <Button onClick={() => openWhatsApp(DUMMY_CONTACT.wa)}>
          <p className="text-xs sm:text-base">Contact Us</p>
        </Button>
      </div>
      <div className="flex justify-center items-center shrink-0">
        <img src={Team} alt="" className="w-32 h-32 sm:w-48 sm:h-48 object-contain" />
      </div>
    </Card>
  );
}