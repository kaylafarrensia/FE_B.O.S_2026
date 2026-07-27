import { useState } from 'react';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import { useLocation } from 'react-router-dom';
import PaymentStatusButton from '@/components/ui/PaymentStatusButton.jsx';
import AlertPopup from './AlertPopup.jsx';
import IconTrash from '@/assets/icons/IconTrash.svg';
import AlertDeleteAllMembers from './AlertDeleteAllMembers.jsx';
import IconWhatsapp from '@/assets/icons/IconWhatsapp.svg';

const DUMMY_REGISTRATION_MODE = 'Group';
const DUMMY_PACKAGE_TYPE = 'Group';
const DUMMY_FEE = 'Rp550.000';
// ── Page ──────────────────────────────────────────────────────────────────────
export default function GroupForm() {
    const [popupOpen, setPopupOpen] = useState(false);
    const [deleteAllPopupOpen, setDeleteAllPopupOpen] = useState(false);
    const location = useLocation();
    const groupCode = location.state?.groupCode || 'N/A'; // Default to 'N/A' if groupCode is not provided
    const [isPaid, setIsPaid] = useState(false); // Dummy state for payment status
    const [isEditing, setIsEditing] = useState(false);

    const handleWhatsApp = () => {
        window.open(
            "https://chat.whatsapp.com/xxxx",
            "_blank",
            "noopener,noreferrer"
        );
    }

    const [group, setGroup] = useState({
        code: groupCode,
        maxMembers: 3,
        members: [
            {
                id: 1,
                name: "John Doe",
                nim: "2802312312",
            },
            {
                id: 2,
                name: "Jane Smith",
                nim: "2802312456",
            },
            {
                id: 3,
                name: "Jane Smith",
                nim: "2802312456",
            },
        ],
    });
    const isMembersFull =
        group.members.filter((member) => member.name.trim() !== "").length >=
        group.maxMembers;

    const handlePayment = () => {
        // Simulate payment process
        setIsPaid(true);
    }
    const handleConfirm = () => {

    };
    const handleBack = () => {
        setPopupOpen(true);
    }
    const handleDeleteAllMembers = () => {
        setDeleteAllPopupOpen(true);
    }
    const confirmDeleteAllMembers = () => {
        setGroup({
            ...group,
            members: group.members.map((member) => ({
                ...member,
                name: "",
                nim: "",
            })),
        });

        setDeleteAllPopupOpen(false);
    };

    return (
        <>
            {popupOpen && <AlertPopup setIsOpen={setPopupOpen} />}
            {deleteAllPopupOpen && (
                <AlertDeleteAllMembers
                    setIsOpen={setDeleteAllPopupOpen}
                    onConfirm={confirmDeleteAllMembers}
                />
            )}
            <div className="relative">
                <div className="px-6 xl:px-[10vw] py-5 xl:py-15">
                    <div className="flex flex-col items-center gap-5">
                        {/* Two Columns */}
                        <div className="flex flex-col xl:flex-row items-start justify-center w-full gap-4 xl:gap-5">
                            {/* Left Column */}
                            <div className="flex w-full">
                                <Card className="flex flex-col justify-between p-10 rounded-xl border-white border-[3px] w-full gap-13">
                                    <div className="flex flex-col gap-3">
                                        <h1 className="text-4xl font-bold text-primary">
                                            Group
                                        </h1>

                                        <div>
                                            <p className="text-xs sm:text-lg">
                                                Group Code :{" "}
                                                <span className="font-semibold">
                                                    {group.code}
                                                </span>
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs sm:text-lg">
                                                Number of code users (

                                                {group.members.filter((m) => m.name.trim() !== "").length}/
                                                {group.maxMembers}

                                                ):
                                            </p>

                                            <div className="space-y-2 text-xs sm:text-lg">
                                                {group.members.map((member, index) => (
                                                    <div
                                                        key={member.id}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span>{index + 1}.</span>

                                                        <div className="flex-1">
                                                            {member.name
                                                                ? `${member.name} - ${member.nim}`
                                                                : ""}
                                                        </div>

                                                        {isEditing && (
                                                            <button
                                                                className="flex-shrink-0"
                                                                onClick={() => {
                                                                    const updated = group.members.filter(
                                                                        (_, memberIndex) => memberIndex !== index
                                                                    );

                                                                    // Tambahkan slot kosong lagi supaya jumlah member tetap 3
                                                                    updated.push({
                                                                        id: Date.now(),
                                                                        name: "",
                                                                        nim: "",
                                                                    });

                                                                    setGroup({
                                                                        ...group,
                                                                        members: updated,
                                                                    });
                                                                }}
                                                            >
                                                                <img
                                                                    src={IconTrash}
                                                                    alt="Delete"
                                                                    className="w-[18px] h-[18px] cursor-pointer"
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            {isEditing && (
                                                <div className="flex gap-3 mt-6 justify-center">

                                                    <Button
                                                        variant="outline"
                                                        className="border-[#0A2745] text-[#0A2745] hover:bg-[#0A2745] hover:text-white"
                                                        onClick={() => {
                                                            handleDeleteAllMembers();
                                                        }}
                                                    >
                                                        DELETE ALL
                                                    </Button>

                                                    <Button
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                        }}
                                                    >
                                                        SAVE CHANGES
                                                    </Button>

                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <Button onClick={() => setIsEditing(true)}>
                                            EDIT GROUP
                                        </Button>
                                    </div>
                                </Card>
                            </div>

                            {/* Right Column */}
                            <div className="flex w-full">
                                <Card className="flex flex-col p-10 rounded-xl border-white border-[3px] w-full">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <h1 className="text-xl font-bold sm:text-3xl">
                                                Payment Submission
                                            </h1>

                                            <PaymentStatusButton isPaid={isPaid} />
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
                                            <Button disabled={isPaid || !isMembersFull} onClick={handlePayment}>
                                                PAY NOW
                                            </Button>
                                        </div>
                                        {!isMembersFull ? (
                                            <p className="text-sm text-center text-[#0A2745]/70">
                                                Button will be active after group has 3 members.
                                            </p>
                                        ) : null}
                                        {isPaid && (
                                            <p className="text-center sm:text-lg">
                                                Payment successful! Time to complete your registration
                                            </p>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </div>
                        {/* WhatsApp Teammate Banner */}

                        <div className="w-full">
                            <div className="relative mt-2 flex items-center justify-start">
                                <div className="
                                    w-fit
                                    rounded-full
                                    border border-white
                                    bg-white/40
                                    py-3
                                    pl-20
                                    pr-6
                                    text-sm sm:text-lg
                                    text-[#0A2745]
                                ">
                                    Looking for teammates? Join our WhatsApp group to find others!
                                </div>
                                {/* WhatsApp Icon */}
                                <div className="
                                    absolute
                                    left-0
                                    w-16 h-16
                                    rounded-full
                                    bg-white
                                    border-[6px]
                                    border-white
                                    flex
                                    items-center
                                    justify-center
                                    shadow-md
                                ">
                                    <button className="cursor-pointer" onClick={handleWhatsApp}>
                                        <img
                                            src={IconWhatsapp}
                                            alt="Whatsapp"
                                            className="w-8 h-8 sm:w-10 sm:h-10"
                                        />
                                    </button>
                                </div>
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
                                <p className="text-sm text-center text-primary">
                                    Button will be active after payment is complete.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
