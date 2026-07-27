import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Card from './Card';

const LNT_COURSES = [
  'UI/UX Design',
  'Web Development',
  'Data Science',
  'Mobile Development',
  'Cyber Security',
];

export default function ReRegistrationForm() {
  const [form, setForm] = useState({
    linkedin: '',
    github: '',
    course: '',
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.course) {
      alert('Please select an LnT Course');
      return;
    }
    // TODO: Connect to backend API
    console.log(form);
  };

  return (
    <Card className="w-full">
      <h2 className="text-xl font-bold sm:text-3xl text-[#0A2745] font-poppins">
        Re-Registration <span className="text-[#2474C0]">Form</span>
      </h2>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <div>
          <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#0A2745]/70 font-poppins">
            LinkedIn URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={form.linkedin}
              onChange={handleChange('linkedin')}
              placeholder="e.g. https://www.linkedin.com/in/abc-def/"
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-lg border border-[#99C4F4] bg-[#EBF5FF]/50 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2474C0] focus:border-[#2474C0] transition-all font-medium text-slate-700"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#0A2745]/70 font-poppins">
            GitHub URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={form.github}
              onChange={handleChange('github')}
              placeholder="e.g. https://www.github.com/abc-def/"
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-lg border border-[#99C4F4] bg-[#EBF5FF]/50 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2474C0] focus:border-[#2474C0] transition-all font-medium text-slate-700"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs sm:text-sm font-semibold text-[#0A2745]/70 font-poppins">
            LnT Course
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((p) => !p)}
              className="w-full flex items-center justify-between px-4 py-3 text-xs sm:text-sm rounded-lg border border-white/60 bg-gradient-to-r from-blue-50 to-blue-100/60 focus:outline-none focus:ring-1 focus:ring-[#2474C0] focus:border-[#2474C0] transition-all font-medium text-slate-700 cursor-pointer shadow-[2px_2px_4px_rgba(0,0,0,0.02)] text-left"
            >
              <span className={form.course ? 'text-slate-700' : 'text-slate-400'}>
                {form.course || 'Select your desired LnT Course'}
              </span>
              <ChevronDown
                size={18}
                className={`text-slate-500 transform transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="w-full rounded-lg border border-white/40 bg-[#EBF5FF]/70 divide-y divide-white/50 overflow-hidden shadow-[4px_4px_12px_rgba(0,0,0,0.02)]"
                >
                  {LNT_COURSES.map((course) => (
                    <div
                      key={course}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, course }));
                        setDropdownOpen(false);
                      }}
                      className="px-5 py-3 text-xs sm:text-sm font-semibold text-[#0A2745] cursor-pointer hover:bg-[#1E5FA8]/10 transition-colors"
                    >
                      {course}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="self-center mt-4">
          <button
            type="submit"
            className="bg-[#1E5FA8] hover:bg-[#12376B] text-white px-10 py-2.5 rounded-lg text-sm sm:text-base font-semibold shadow-md transition-colors cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </Card>
  );
}