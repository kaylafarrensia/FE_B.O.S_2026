import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import SavedPopup from './SavedPopup.jsx';

export default function GroupCode() {
    const navigate = useNavigate();
    const [popupOpen, setPopupOpen] = useState(false);
    const [groupCode, setGroupCode] = useState('');

    const handleConfirm = () => {
        setPopupOpen(true);
    };

    return (
        <>
            {popupOpen && <SavedPopup setIsOpen={setPopupOpen} />}
            <div className="flex flex-col gap-6">
                <h1 className="text-3xl font-bold text-[#251369]">
                    Payment Submission
                </h1>

                <div className="flex flex-col gap-2">
                    <p className="text-lg font-medium text-[#251369]">
                        Enter your group code
                    </p>

                    <input
                        type="text"
                        value={groupCode}
                        onChange={(e) => setGroupCode(e.target.value)}
                        placeholder="Example: ABC123"
                        className="w-full rounded-xl border border-[#251369] bg-transparent px-6 py-3 text-[#251369] placeholder:text-[#8B7FC5] outline-none focus:ring-2 focus:ring-[#AFC8F9]"
                    />

                    <p className="text-sm text-[#251369]">
                        Don't have a group code?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/payment/group-create')}
                            className="font-semibold underline hover:opacity-80 cursor-pointer"
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