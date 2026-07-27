import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import IconLine from '../../assets/icons/IconLine.svg';
import Team from '../../assets/images/Team.svg';

export default function ContactPersonCard({
  username = '@yviluo',
  name = 'Yovi Gracia Lo',
  wa = '6285178100246',
}) {
  const openWhatsApp = (number) => {
    const formatted = number.startsWith('0') ? number.slice(1) : number;
    window.open(`https://wa.me/${formatted}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="flex flex-row px-7 py-6 sm:px-14 sm:py-8 xl:px-16 rounded-xl border-white border-[3px] shadow-sm">
      <div className="flex-1 flex flex-col justify-center items-start gap-4">
        <h1 className="font-bold sm:text-3xl text-xl w-fit">Contact Person</h1>
        <div className="flex flex-row gap-3 items-center">
          <img src={IconLine} alt="LINE" className="w-5 sm:w-7" />
          <p className="text-xs sm:text-base">
            <span className="whitespace-nowrap">{username}</span>{' '}
            <span className="whitespace-nowrap">({name})</span>
          </p>
        </div>
        <Button onClick={() => openWhatsApp(wa)}>
          <p className="text-xs sm:text-base">Contact Us</p>
        </Button>
      </div>
      <div className="flex justify-center items-center shrink-0">
        <img
          src={Team}
          alt="Team"
          className="w-32 h-32 sm:w-48 sm:h-48 object-contain"
        />
      </div>
    </Card>
  );
}