import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import CreateGroupPopup from './CreateGroupPopup.jsx';

export default function GroupCode() {
    const navigate = useNavigate();
    const [popupOpen, setPopupOpen] = useState(false);
    const [groupCode, setGroupCode] = useState('');

    const handleConfirm = () => {
        navigate('/payment/group-form', { state: { groupCode } });
    };
    const handleCreateGroup = () => {
        setGroupCode('ABC123'); // Simulate generating a group code
        setPopupOpen(true);
    }

    return (
        <>
            {popupOpen && <CreateGroupPopup setIsOpen={setPopupOpen} groupCode={groupCode} />}
            <div className="flex flex-col gap-6">
                <h1 className="text-xl font-bold sm:text-3xl w-fit">
                    <span className="bg-[#FFF200] px-1.5 py-0.5 rounded-md text-[#0A2745]">
                        Payment
                    </span> Submission
                </h1>

                <div className="flex flex-col gap-2">
                    <p className="text-lg font-medium text-[#0A2745]">
                        Enter your group code
                    </p>

                    <input
                        type="text"
                        value={groupCode}
                        onChange={(e) => setGroupCode(e.target.value)}
                        placeholder="Example: ABC123"
                        className="w-full rounded-xl border border-[#0A2745] bg-transparent px-6 py-3 text-[#0A2745] placeholder:text-[#0A2745]/50 outline-none focus:ring-2 focus:ring-[#0A2745]/30"
                    />
                    <p className="text-sm text-[#0A2745]">
                        Don't have a group code?{' '}
                        <button
                            type="button"
                            onClick={handleCreateGroup}
                            className="font-semibold urderline hover:opacity-80 cursor-pointer"
                        >
                            Create one here
                        </button>
                    </p>
                </div>

                <div>
                    <Button
                        onClick={handleConfirm}
                        disabled={!groupCode.trim()}
                    >
                        NEXT
                    </Button>
                </div>
            </div>
        </>
    );
}