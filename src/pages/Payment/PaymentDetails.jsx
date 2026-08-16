import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import PaymentStatusButton from '@/components/ui/PaymentStatusButton.jsx';
import IconAlertBlue from '@/assets/icons/IconAlertBlue.svg';
import UploadIcon from '@/assets/icons/IconUpload.svg'; // Buat atau ganti path icon upload sesuai file proyekmu

export default function PaymentDetails() {
    const navigate = useNavigate();
    const location = useLocation();

    // Mengambil data dari route state atau default data
    const registrationMode = location.state?.registrationMode || 'Individual';
    const packageType = location.state?.packageType || 'Early Bird';
    const fee = location.state?.fee || 'Rp550.000';

    const paymentStatus = location.state?.paymentStatus || 'unpaid';

    const [isPaid, setIsPaid] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmitPayment = () => {
        if (!selectedFile) return;

        // Direct kembali ke GroupForm dengan membawa status pending
        navigate('/payment/group-form', {
            state: {
                paymentStatus: 'pending',
                groupCode: location.state?.groupCode
            }
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="relative">
            <div className="px-6 xl:px-[10vw] py-5 xl:py-15">
                <div className="flex flex-col items-center gap-6">
                    {/* Two Columns Layout */}
                    <div className="flex flex-col xl:flex-row items-stretch justify-center w-full gap-4 xl:gap-5">

                        {/* Left Column - Payment Details & Upload */}
                        <div className="flex w-full">
                            <Card className="flex flex-col justify-between p-8 sm:p-10 rounded-xl border-white border-[3px] w-full gap-6">
                                <div className="flex flex-col gap-6">
                                    {/* Bank Info */}
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-[#0A2745] mb-2">
                                            Payment Details
                                        </h1>
                                        <p className="text-xs sm:text-base text-[#0A2745]">
                                            Bank:
                                        </p>
                                        <p className="text-xs sm:text-base font-semibold text-[#0A2745]">
                                            BCA (A/N: BNCC - Bina Nusantara Computer Club)
                                        </p>
                                        <p className="text-xs sm:text-base text-[#0A2745] mt-3">
                                            Account Number:
                                        </p>
                                        <p className="text-xs sm:text-base font-semibold text-[#0A2745]">
                                            1234567890
                                        </p>
                                    </div>

                                    {/* Upload Section */}
                                    <div className="flex flex-col gap-3">
                                        <h2 className="text-xl sm:text-2xl font-bold text-[#0A2745]">
                                            Upload Proof Of Payment
                                        </h2>
                                        <p className="text-xs sm:text-sm text-[#0A2745]/80">
                                            Please use the following format in the transfer remark/description:
                                        </p>

                                        <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-[#0A2745] gap-2">
                                            <div>
                                                <p className="font-semibold">[REGIONCODE30] - [USER 1]</p>
                                                <p className="text-[#0A2745]/70 mt-1">
                                                    Example: <span className="font-semibold text-[#0A2745]">KMG30 - G301231233</span>
                                                </p>
                                            </div>
                                            <div className="text-xs sm:text-sm">
                                                <p className="font-medium">Region Codes:</p>
                                                <p><span className="font-semibold">ALS:</span> Alam Sutera</p>
                                                <p><span className="font-semibold">MLG:</span> Malang</p>
                                                <p><span className="font-semibold">KMG:</span> Kemanggisan</p>
                                                <p><span className="font-semibold">BDG:</span> Bandung</p>
                                            </div>
                                        </div>

                                        {/* File Input Box */}
                                        <div className="mt-3">
                                            <p className="text-xs sm:text-sm text-[#0A2745] mb-1">
                                                Upload your proof of payment
                                            </p>
                                            <label className="flex items-center justify-between border border-[#0A2745]/30 rounded-lg p-3 bg-white/50 cursor-pointer hover:bg-white/80 transition">
                                                <span className="text-xs sm:text-sm text-[#0A2745]/60 truncate">
                                                    {selectedFile ? selectedFile.name : 'Upload payment proof'}
                                                </span>

                                                <img src={UploadIcon} alt="Upload" className="w-4 h-4" />
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".jpg,.jpeg,.png,.pdf"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                            <p className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#0A2745]/70 mt-1">
                                                <img
                                                    src={IconAlertBlue}
                                                    alt="Alert"
                                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                                                />
                                                <span>The payment proof must be in jpg/png/pdf format and must not exceed 10 MB</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-start mt-2">
                                    <Button
                                        onClick={handleSubmitPayment}
                                        disabled={!selectedFile || isPaid}
                                        className="px-8"
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column - Payment Submission Info */}
                        <div className="flex w-full">
                            <Card className="flex flex-col p-8 sm:p-10 rounded-xl border-white border-[3px] w-full justify-between">
                                <div className="flex flex-col gap-5">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-xl font-bold sm:text-3xl text-[#0A2745]">
                                            Payment Submission
                                        </h1>
                                        <PaymentStatusButton status={paymentStatus} />
                                    </div>

                                    <div>
                                        <p className="text-xs sm:text-base text-[#0A2745]">Registration Mode</p>
                                        <p className="mt-1 text-sm sm:text-lg font-bold text-[#0A2745]">
                                            {registrationMode}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs sm:text-base text-[#0A2745]">Package Type</p>
                                        <p className="mt-1 text-sm sm:text-lg font-bold text-[#0A2745]">
                                            {packageType}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs sm:text-base text-[#0A2745]">Fee</p>
                                        <p className="mt-1 text-sm sm:text-lg font-bold text-[#0A2745]">
                                            {fee}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="flex flex-col items-center gap-2 mt-4">
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="border-[#0A2745] text-[#0A2745] hover:bg-[#0A2745] hover:text-white px-8"
                                onClick={handleBack}
                            >
                                BACK
                            </Button>
                            <Button disabled={!isPaid} className="px-8">
                                REGISTRATION
                            </Button>
                        </div>
                        <p className="text-xs sm:text-sm text-center text-[#0A2745]">
                            Button will be active after payment are complete
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}