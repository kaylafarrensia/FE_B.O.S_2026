import {
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaLinkedin,
  FaThreads,
  FaYoutube,
} from 'react-icons/fa6'

const links = [
  {
    icon: FaInstagram,
    href: 'https://www.instagram.com/bnccbinus/',
    label: 'Instagram',
  },
  {
    icon: FaFacebook,
    href: 'https://web.facebook.com/bina.nusantara.computer.club/',
    label: 'Facebook',
  },
  { icon: FaXTwitter, href: 'https://twitter.com/bncc_binus', label: 'X' },
  {
    icon: FaYoutube,
    href: 'https://www.youtube.com/channel/UC0BND4Aekeg90GQ1_ZX79Yw/videos?app=desktop',
    label: 'youtube',
  },
  {
    icon: FaLinkedin,
    href: 'https://www.linkedin.com/company/bina-nusantara-computer-club/',
    label: 'LinkedIn',
  },
  {
    icon: FaThreads,
    href: 'https://www.threads.net/@bnccbinus',
    label: 'Threads',
  },
]

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-3 px-4">
      {links.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-6 w-5 sm:h-9 sm:w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-900 transition hover:bg-blue-100"
        >
          <Icon size={12} className="sm:hidden" />
          <Icon size={18} className="hidden sm:block" />
        </a>
      ))}
    </div>
  )
}