import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import IcBnccWhitebg from '../../assets/icons/ic-bncc-whitebg.svg'
import IconClose from '../../assets/icons/IconClose.svg'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'

const NAV_LINKS = [
  { label: 'About Us', href: '#about' },
  { label: 'Courses', href: '#courses' },
  { label: 'Events', href: '#events' },
  { label: 'FAQ', href: '#faq' },
]

const DESKTOP_BREAKPOINT = 1024
const SCROLL_TOP_THRESHOLD = 100
const SECTION_VISIBILITY_THRESHOLD = 0.5
const HEADER_HEIGHT = 72
const HEADER_HEIGHT_SCROLLED = 60

const headerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

function useBodyScrollLock(isLocked) {
  useEffect(() => {
    document.body.style.overflow = isLocked ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isLocked])
}

function useCloseOnDesktopResize(onDesktop) {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) onDesktop()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [onDesktop])
}

function useActiveSection(links) {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector(link.href))
      .filter(Boolean)
    if (sections.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`)
        })
      },
      { threshold: SECTION_VISIBILITY_THRESHOLD },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [links])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < SCROLL_TOP_THRESHOLD) setActiveSection('')
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return activeSection
}

function useScrolled(threshold = SCROLL_TOP_THRESHOLD) {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (latest) =>
    setIsScrolled(latest > threshold),
  )
  return isScrolled
}

function scrollToSection(href, headerHeight) {
  const target = document.querySelector(href)
  if (!target) return
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight
  window.scrollTo({ top, behavior: 'smooth' })
}

function Logo({ className = 'h-7.5 w-auto' }) {
  return <img src={IcBnccWhitebg} alt="BNCC" className={className} />
}

function DesktopNavLinks({ links, activeSection, headerHeight }) {
  const [hovered, setHovered] = useState(null)
  const targetHref = hovered ?? activeSection

  const handleClick = (event, href) => {
    event.preventDefault()
    scrollToSection(href, headerHeight)
  }

  return (
    <ul
      onMouseLeave={() => setHovered(null)}
      className="relative hidden items-center gap-24 text-[15px] uppercase tracking-[2px] lg:flex"
    >
      {links.map((link) => {
        const isActive = activeSection === link.href
        const isTarget = targetHref === link.href
        return (
          <li key={link.label}>
            <a
              href={link.href}
              onMouseEnter={() => setHovered(link.href)}
              onClick={(event) => handleClick(event, link.href)}
              aria-current={isActive ? 'true' : undefined}
              className={`relative font-normal transition-colors duration-300 ${isActive ? 'font-semibold text-primary' : 'text-secondary/70 hover:text-primary'}`}
            >
              {link.label}
              {isTarget && (
                <motion.span
                  layoutId="navbar-underline"
                  className="pointer-events-none absolute -bottom-2.5 left-0 right-0 h-[2px] rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
                />
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function HamburgerButton({ isOpen, onClick }) {
  const topVariants = {
    closed: { rotate: 0, y: -6 },
    open: { rotate: 45, y: 0 },
  }
  const middleVariants = {
    closed: { opacity: 1, scaleX: 1 },
    open: { opacity: 0, scaleX: 0 },
  }
  const bottomVariants = {
    closed: { rotate: 0, y: 6 },
    open: { rotate: -45, y: 0 },
  }

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
      aria-expanded={isOpen}
      className="relative flex h-[30px] w-[30px] items-center justify-center lg:hidden"
    >
      <motion.span
        variants={topVariants}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
        className="absolute h-[3px] w-6 origin-center rounded-full bg-gradient-to-br from-[#0C4076] to-[#4489D4]"
      />
      <motion.span
        variants={middleVariants}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute h-[3px] w-6 origin-center rounded-full bg-gradient-to-br from-[#0C4076] to-[#4489D4]"
      />
      <motion.span
        variants={bottomVariants}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
        className="absolute h-[3px] w-6 origin-center rounded-full bg-gradient-to-br from-[#0C4076] to-[#4489D4]"
      />
    </button>
  )
}

function MobileMenu({ isOpen, links, onClose, headerHeight, activeSection }) {
  const navigate = useNavigate()
  const handleClick = (event, href) => {
    event.preventDefault()
    onClose()
    window.setTimeout(() => scrollToSection(href, headerHeight), 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Sidebar overlay */}
          <div
            className="fixed inset-0 bg-transparent z-[998] lg:hidden"
            onClick={onClose}
          />

          {/* Mobile Sidebar */}
          <motion.div
            className="fixed top-0 right-0 h-full w-1/2 max-w-sm border-white border-1 backdrop-blur-md shadow-xl z-[999] lg:hidden bg-white/20 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-end items-center">
              <button className="px-8 py-3 cursor-pointer" onClick={onClose}>
                <img src={IconClose} alt="Close" className="w-8 h-8" />
              </button>
            </div>
            
            <nav className="flex flex-col py-6 px-3 space-y-4">
              {links.map((link) => {
                const isActive = activeSection === link.label
                return (
                  <motion.button
                    key={link.label}
                    className={`flex items-center justify-end gap-4 p-4 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0C4076] to-[#2474C0] text-white shadow-md shadow-[#0C4076]/30'
                        : 'text-[#0C4076] hover:bg-white/30'
                    }`}
                    onClick={(event) => handleClick(event, link.href)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-poppins text-left text-sm sm:text-lg font-bold tracking-[2.5px] uppercase">
                      {link.label}
                    </span>
                  </motion.button>
                )
              })}

              <motion.button
                className="flex items-center justify-end p-4 rounded-lg transition-all duration-300 bg-gradient-to-r from-[#0C4076] to-[#2474C0] text-white font-bold tracking-[2.5px] uppercase text-sm sm:text-lg mt-4 cursor-pointer hover:from-[#062547] hover:to-[#164C82] shadow-md shadow-[#0C4076]/30"
                onClick={() => {
                  onClose()
                  navigate('/auth/signin')
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Sign In</span>
              </motion.button>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const activeSection = useActiveSection(NAV_LINKS)
  const isScrolled = useScrolled()
  const currentHeaderHeight = isScrolled
    ? HEADER_HEIGHT_SCROLLED
    : HEADER_HEIGHT

  const closeMenu = useCallback(() => setIsOpen(false), [])
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), [])

  useBodyScrollLock(isOpen)
  useCloseOnDesktopResize(closeMenu)

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] border-b transition-colors duration-500 ${
          isScrolled
            ? 'border-white/60 bg-white/70 shadow-[0_8px_30px_rgba(10,39,69,0.08)] backdrop-blur-2xl'
            : 'border-white bg-white/10 backdrop-blur-2xl'
        }`}
      >
        <motion.nav
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center px-6 lg:px-8"
          style={{
            height: currentHeaderHeight,
            transition: 'height 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <motion.a
            variants={fadeInUp}
            href="#top"
            animate={{ scale: isScrolled ? 0.92 : 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => {
              event.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <Logo />
          </motion.a>

          <motion.div
            variants={fadeInUp}
            className="hidden justify-center lg:flex"
          >
            <DesktopNavLinks
              links={NAV_LINKS}
              activeSection={activeSection}
              headerHeight={currentHeaderHeight}
            />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-end gap-8 lg:gap-16"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/auth/signin')}
              className="relative hidden h-[42px] w-[115px] items-center justify-center overflow-hidden rounded-sm bg-[linear-gradient(135deg,#0C4076_0%,#4489D4_100%)] font-semibold text-white transition-shadow duration-300 hover:shadow-[0_6px_20px_rgba(12,64,118,0.35)] lg:flex cursor-pointer border-none"
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-white/20"
                whileHover={{ translateX: '100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              <span className="relative">Sign In</span>
            </motion.button>

            <HamburgerButton isOpen={isOpen} onClick={toggleMenu} />
          </motion.div>
        </motion.nav>
      </header>

      <MobileMenu
        isOpen={isOpen}
        links={NAV_LINKS}
        onClose={closeMenu}
        headerHeight={currentHeaderHeight}
        activeSection={activeSection}
      />
    </>
  )
}
