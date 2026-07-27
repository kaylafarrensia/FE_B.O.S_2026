import { createPortal } from 'react-dom';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import IconAlert from '@/assets/icons/IconAlert.svg';
import { useNavigate } from 'react-router-dom';

export default function AlertDeleteAllMembers({ setIsOpen, onConfirm }) {
    const navigate = useNavigate();
    return createPortal(
        <div className="inset-0 flex backdrop-blur-md fixed justify-center items-center z-[999] px-4">
            <Card className="flex w-full max-w-3xl flex-col items-center justify-center gap-4 sm:gap-6 text-center border-2 border-white rounded-2xl px-6 py-10 sm:px-12 sm:py-14 md:px-20 md:py-20">
                <img
                    src={IconAlert}
                    alt="Check mark"
                    className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32"
                />
                <div className="flex flex-col items-center gap-5">
                    <h1 className="text-lg sm:text-2xl md:text-3xl font-bold md:whitespace-nowrap">
                        Are you sure?
                    </h1>
                    <p className="text-sm sm:text-base">
                        This action will remove all members off from group.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button
                        className="rounded-lg px-10 sm:px-14 w-auto"
                        onClick={() => setIsOpen(false)}
                    >
                        NO
                    </Button>

                    <Button
                        variant="outline"
                        className="rounded-lg w-auto px-10 sm:px-14 border-[#0A2745] text-[#0A2745] hover:bg-[#0A2745] hover:text-white"
                        onClick={onConfirm}
                    >
                        YES
                    </Button>
                </div>
            </Card>
        </div>,
        document.body
    );
}