import { FaInstagram, FaFacebook, FaXTwitter, FaLinkedin, FaThreads } from 'react-icons/fa6'

const links = [
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FaXTwitter, href: 'https://x.com', label: 'X' },
  { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FaThreads, href: 'https://threads.net', label: 'Threads' },
]

export default function SocialLinks() {
  return (
    <div className="flex gap-3">
      {links.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-900 transition hover:bg-blue-100"
        >
          <Icon size={18} />
        </a>
      ))}
    </div>
  )
}