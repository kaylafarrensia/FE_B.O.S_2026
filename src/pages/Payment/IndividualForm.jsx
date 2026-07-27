import { useState } from 'react';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import IconSchedule from '@/assets/icons/IconSchedule.svg';
import IconTime from '@/assets/icons/IconTime.svg';
import { formatDate, formatStartEndTime } from '@/utils/index.js';
import Calendar from './Calendar.jsx';
import RegistrationTypeDropdown from './RegistrationTypeDropdown.jsx';
import ContactPerson from '@/pages/Dashboard/Japres/ContactPerson.jsx';
import { useNavigate } from 'react-router-dom';

// ── Dummy Data (replace with API when backend is ready) ───────────────────────
const DUMMY_USER = {
    name: 'John Doe',
    nim: '2802312312'
};
const DUMMY_REGISTRATION_MODE = 'Individual';
const DUMMY_PACKAGE_TYPE = 'Early Bird';
const DUMMY_FEE = 'Rp550.000';
// ── Page ──────────────────────────────────────────────────────────────────────
export default function IndividualForm() {
    const [tempType, setTempType] = useState(null);
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();
    const [isPaid, setIsPaid] = useState(false); // Dummy state for payment status

    const handlePayment = () => {
        // Simulate payment process
        setIsPaid(true);
    }
    const handleConfirm = () => {
        if (!tempType) return;
        setUserType(tempType);
        if (tempType.type === 'Individual') {
            navigate('/payment/individual-form');
        }
        setTempType(null);
    };

    return (
        <div className="relative">
            <div className="px-6 xl:px-[10vw] py-5 xl:py-15">
                <div className="flex flex-col items-center gap-5">
                    {/* Two Columns */}
                    <div className="flex flex-col xl:flex-row justify-center w-full gap-4 xl:gap-5">
                        {/* Left Column */}
                        <div className="flex flex-col w-full">
                            <Card className="flex flex-col p-10 rounded-xl border-white border-[3px]">
                                <h1 className="text-xl font-bold sm:text-3xl w-fit">
                                    Individual
                                </h1>

                                <p className="pt-2 xl:pt-5 text-xs sm:text-lg">
                                    {DUMMY_USER.name} - {DUMMY_USER.nim}
                                </p>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col w-full">
                            <Card className="flex flex-col p-10 rounded-xl border-white border-[3px]">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-xl font-bold sm:text-3xl">
                                            Payment Submission
                                        </h1>

                                        <button
                                            disabled
                                            className={`px-6 py-2 rounded-full text-sm font-semibold text-white cursor-default ${isPaid ? 'bg-green-500' : 'bg-red-500'
                                                }`}
                                        >
                                            {isPaid ? 'Paid' : 'Unpaid'}
                                        </button>
                                    </div>

                                    <div>
                                        <p className="text-xs sm:text-lg">
                                            Registration Mode
                                        </p>
                                        <p className="mt-1 text-sm sm:text-lg font-semibold">
                                            {DUMMY_REGISTRATION_MODE}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs sm:text-lg">
                                            Package Type
                                        </p>
                                        <p className="mt-1 text-sm sm:text-lg font-semibold">
                                            {DUMMY_PACKAGE_TYPE}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs sm:text-lg">
                                            Fee
                                        </p>
                                        <p className="mt-1 text-sm sm:text-lg font-semibold">
                                            {DUMMY_FEE}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 mt-5 items-center">
                                    <div className="w-fit">
                                        <Button disabled={isPaid} onClick={handlePayment}>
                                            PAY NOW
                                        </Button>
                                    </div>
                                    {isPaid && (
                                        <p className="text-center sm:text-lg">
                                            Payment successful! Time to complete your registration
                                        </p>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}
                            >
                                BACK
                            </Button>

                            <Button
                                onClick={handleConfirm}
                                disabled={!isPaid}
                            >
                                REGISTRATION
                            </Button>
                        </div>

                        {!isPaid && (
                            <p className="text-sm text-center text-primary">
                                Button will be active after payment is complete.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
