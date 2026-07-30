import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';

function AuthHeader({ showBackBtn = true }) {
  const navigate = useNavigate();

  return (
    <>
      {showBackBtn && (
        <button
          onClick={() => navigate(-1)}
          className="fixed top-6 left-6 z-40 bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-lg border border-white/30 cursor-pointer"
        >
          <IoArrowBackOutline className="w-6 sm:w-7 md:w-9 h-6 sm:h-7 md:h-9 text-persianIndigo" />
        </button>
      )}

      {/* Background blur circles */}
      <div className="background-blur-circles fixed inset-0 z-0 pointer-events-none">
        <div className="w-[60vw] h-[40vh] lg:w-[823px] lg:h-[793px] right-[5%] top-[20%] absolute bg-purple-300/50 rounded-full blur-3xl" />
        <div className="w-[45vw] h-[35vh] lg:w-[714px] lg:h-[693px] right-[10%] top-[50%] absolute bg-blue-300/50 rounded-full blur-3xl" />
        <div className="w-[50vw] h-[35vh] lg:w-[684px] lg:h-[681px] left-[30%] top-[25%] absolute bg-indigo-300/50 rounded-full blur-3xl" />
        <div className="w-[55vw] h-[40vh] lg:w-[702px] lg:h-[721px] left-[5%] top-[60%] absolute bg-sky-300/50 rounded-full blur-3xl" />
      </div>

      {/* BNCC Badge */}
      <div className="absolute top-[130px] sm:top-22 md:top-[30px] left-1/2 transform -translate-x-1/2 z-30">
        <div className="px-4 sm:px-6 md:px-8 lg:px-9 py-1.5 sm:py-2 md:py-2.5 lg:py-3 bg-white/30 backdrop-blur-3xl rounded-full border-2 border-white/60 inline-flex justify-center items-center">
          <div
            className="text-[12px] md:text-[16px] lg:text-[20px] font-semibold leading-tight whitespace-nowrap"
            style={{
              background: 'linear-gradient(to right, #251369, #528CDC)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            BNCC OPENING SEASON 2026
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthHeader;
