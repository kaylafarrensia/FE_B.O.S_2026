import { useState } from 'react';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import IconSchedule from '@/assets/icons/IconSchedule.svg';
import IconTime from '@/assets/icons/IconTime.svg';
import { formatDate, formatStartEndTime } from '@/utils/index.js';
import Calendar from './Calendar.jsx';
import RegistrationTypeDropdown from './RegistrationTypeDropdown.jsx';
import ContactPerson from '@/pages/Dashboard/Japres/ContactPerson.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentStatusButton from '@/components/ui/PaymentStatusButton.jsx';
import AlertPopup from './AlertPopup.jsx';

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
    const [popupOpen, setPopupOpen] = useState(false);
    const [tempType, setTempType] = useState(null);
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Mengambil status dari state lokasi navigasi (default ke 'unpaid' jika kosong)
    const paymentStatus = location.state?.paymentStatus || 'unpaid';
    const isPaid = paymentStatus === 'success';
    const isPending = paymentStatus === 'pending';

    const handlePayment = () => {
        navigate('/payment/individual-details', {
            state: {
                registrationMode: DUMMY_REGISTRATION_MODE,
                packageType: DUMMY_PACKAGE_TYPE,
                fee: DUMMY_FEE
            }
        });
    };

    const handleBack = () => {
        setPopupOpen(true);
    };

    const handleConfirm = () => {

    };

    return (
        <>
            {popupOpen && <AlertPopup setIsOpen={setPopupOpen} />}
            <div className="relative">
                <div className="px-6 xl:px-[10vw] py-5 xl:py-15">
                    <div className="flex flex-col items-center gap-5">
                        {/* Two Columns */}
                        <div className="flex flex-col xl:flex-row items-stretch justify-center w-full gap-4 xl:gap-5">
                            {/* Left Column */}
                            <div className="flex w-full">
                                <Card className="flex flex-col p-10 rounded-xl border-white border-[3px] w-full">
                                    <h1 className="text-xl font-bold sm:text-3xl w-fit">
                                        Individual
                                    </h1>

                                    <p className="pt-2 xl:pt-5 text-xs sm:text-lg">
                                        {DUMMY_USER.name} - {DUMMY_USER.nim}
                                    </p>
                                </Card>
                            </div>

                            {/* Right Column */}
                            <div className="flex w-full">
                                <Card className="flex flex-col p-10 rounded-xl border-white border-[3px] w-full">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <h1 className="text-xl font-bold sm:text-3xl w-fit">
                                                <span className="bg-[#FFF200] px-1.5 py-0.5 rounded-md text-[#0A2745]">
                                                    Payment
                                                </span> Submission
                                            </h1>

                                            {/* Kirim status dinamis ke tombol badge */}
                                            <PaymentStatusButton status={paymentStatus} isPaid={isPaid} />
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
                                            {/* Kondisi label dan penanganan klik tombol bayar */}
                                            <Button
                                                disabled={isPaid || isPending}
                                                onClick={handlePayment}
                                            >
                                                PAY NOW
                                            </Button>
                                        </div>

                                        {isPaid && (
                                            <p className="text-xs sm:text-sm text-center text-[#0A2745]/70">
                                                <span className="bg-[#FFF200] px-1.5 py-0.5 rounded-md text-[#0A2745] font-medium">
                                                    Payment
                                                </span>{' '}
                                                successful! Time to complete your registration
                                            </p>
                                        )}

                                        {isPending && (
                                            <p className="text-xs sm:text-sm text-center text-[#0A2745]/70">
                                                Your payment is currently being reviewed. Please wait while we verify your transaction.
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
                                    className="border-[#0A2745] text-[#0A2745] hover:bg-[#0A2745] hover:text-white"
                                    onClick={handleBack}
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
                                <p className="text-xs sm:text-sm text-center text-[#0A2745]/70">
                                    Button will be active after{' '}
                                    <span className="bg-[#FFF200] px-1.5 py-0.5 rounded-md text-[#0A2745] font-medium">
                                        Payment
                                    </span>{' '}
                                    is complete.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}