import { useState, useEffect, useCallback, useRef } from 'react'
import IcBnccWhitebg from '../../assets/icons/ic-bncc-whitebg.svg'
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
  const containerRef = useRef(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 })
  const targetHref = hovered ?? activeSection

  useEffect(() => {
    if (!targetHref || !containerRef.current) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }))
      return
    }
    const el = containerRef.current.querySelector(`[data-href="${targetHref}"]`)
    if (!el) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }))
      return
    }
    const containerBox = containerRef.current.getBoundingClientRect()
    const box = el.getBoundingClientRect()
    setIndicator({
      left: box.left - containerBox.left,
      width: box.width,
      opacity: 1,
    })
  }, [targetHref])

  const handleClick = (event, href) => {
    event.preventDefault()
    scrollToSection(href, headerHeight)
  }

  return (
    <ul
      ref={containerRef}
      onMouseLeave={() => setHovered(null)}
      className="relative hidden items-center gap-24 text-[15px] uppercase tracking-[2px] lg:flex"
    >
      <motion.span
        aria-hidden
        animate={{
          left: indicator.left,
          width: indicator.width,
          opacity: indicator.opacity,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
        className="pointer-events-none absolute -bottom-2.5 h-[2px] rounded-full bg-primary"
      />
      {links.map((link) => {
        const isActive = activeSection === link.href
        return (
          <li key={link.label}>
            <a
              href={link.href}
              data-href={link.href}
              onMouseEnter={() => setHovered(link.href)}
              onClick={(event) => handleClick(event, link.href)}
              aria-current={isActive ? 'true' : undefined}
              className={`relative font-normal transition-colors duration-300 ${isActive ? 'font-semibold text-primary' : 'text-secondary/70 hover:text-primary'}`}
            >
              {link.label}
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
        className="absolute h-[3px] w-6 origin-center rounded-full bg-primary"
      />
      <motion.span
        variants={middleVariants}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute h-[3px] w-6 origin-center rounded-full bg-primary"
      />
      <motion.span
        variants={bottomVariants}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
        className="absolute h-[3px] w-6 origin-center rounded-full bg-primary"
      />
    </button>
  )
}

function MobileMenu({ isOpen, links, onClose, headerHeight }) {
  const overlayVariants = {
    hidden: {
      clipPath: 'circle(0% at calc(100% - 35px) 36px)',
      transition: { duration: 0.4, ease: [0.65, 0, 0.35, 1] },
    },
    visible: {
      clipPath: 'circle(150% at calc(100% - 35px) 36px)',
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      clipPath: 'circle(0% at calc(100% - 35px) 36px)',
      transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] },
    },
  }

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
    exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: -12,
      filter: 'blur(4px)',
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  }

  const handleClick = (event, href) => {
    event.preventDefault()
    onClose()
    window.setTimeout(() => scrollToSection(href, headerHeight), 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex flex-col border border-white/30 backdrop-blur-2xl"
          style={{
            background:
              'radial-gradient(circle at 80% 10%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.18) 55%, rgba(255,255,255,0.06) 100%)',
          }}
        >
          <div
            className="flex flex-1 flex-col items-center justify-center gap-10"
            onClick={onClose}
          >
            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center gap-15"
              onClick={(event) => event.stopPropagation()}
            >
              {links.map((link) => (
                <motion.li key={link.label} variants={itemVariants}>
                  <motion.a
                    href={link.href}
                    onClick={(event) => handleClick(event, link.href)}
                    whileHover={{ scale: 1.06, color: '#2474C0' }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-block text-[22px] font-medium uppercase tracking-[3px] text-[#0A2745]"
                  >
                    {link.label}
                  </motion.a>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Navbar() {
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
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href="#signin"
              className="relative hidden h-[42px] w-[115px] items-center justify-center overflow-hidden rounded-sm bg-[linear-gradient(135deg,#0C4076_0%,#4489D4_100%)] font-semibold text-white transition-shadow duration-300 hover:shadow-[0_6px_20px_rgba(12,64,118,0.35)] lg:flex"
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-white/20"
                whileHover={{ translateX: '100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              <span className="relative">Sign In</span>
            </motion.a>

            <HamburgerButton isOpen={isOpen} onClick={toggleMenu} />
          </motion.div>
        </motion.nav>
      </header>

      <MobileMenu
        isOpen={isOpen}
        links={NAV_LINKS}
        onClose={closeMenu}
        headerHeight={currentHeaderHeight}
      />
    </>
  )
}
