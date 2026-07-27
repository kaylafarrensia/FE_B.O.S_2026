import Navbar from '../../components/Home/Navbar'
import Hero from '../../components/Home/Hero'
import AboutUs from '../../components/Home/AboutUs'
import FunFacts from '../../components/Home/FunFacts'
import WhyBNCC from '../../components/Home/WhyBNCC'
import Courses from '../../components/Home/Courses'
import Seniors from '../../components/Home/Seniors'
import PastEvents from '../../components/Home/PastEvents'
import Testimonials from '../../components/Home/Testimonials'
import Sponsorship from '../../components/Home/Sponsors'
import FAQ from '../../components/Home/FAQ'
import ContactUs from '../../components/Home/ContactUs'
import Footer from '../../components/ComingSoon/Footer'
import patternLanding from '../../assets/patterns/pattern-landing.svg'
import patternTopLanding from '../../assets/patterns/pattern-top-landing.svg'
import patternMid1Landing from '../../assets/patterns/pattern-mid1-landing.svg'
import patternMid2Landing from '../../assets/patterns/pattern-mid2-landing.svg'
import patternBottomLanding from '../../assets/patterns/pattern-bottom-landing.svg'
import { useState, useEffect } from 'react'
import CustomCursor from '../../components/common/ui/CustomCursor'
import SmoothScrollProvider from '../../components/common/animation/SmoothScrollProvider'
import ScrollToTop from '../../components/common/animation/ScrollToTop'

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isMobile
}

function PatternZone({
  src,
  fadeTop = false,
  fadeBottom = false,
  children,
  className = '',
}) {
  const maskParts = []
  if (fadeTop)
    maskParts.push('linear-gradient(to bottom, transparent 0, black 80px)')
  if (fadeBottom)
    maskParts.push('linear-gradient(to top, transparent 0, black 80px)')

  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'top center',
          backgroundSize: '100% auto',
          ...(maskParts.length && {
            maskImage: maskParts.join(', '),
            maskComposite: 'intersect',
            WebkitMaskImage: maskParts.join(', '),
            WebkitMaskComposite: 'source-in',
          }),
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

const zones = [
  {
    key: 'top',
    pattern: patternTopLanding,
    fadeBottom: true,
    sections: [AboutUs, FunFacts],
  },
  {
    key: 'mid1',
    pattern: patternMid1Landing,
    fadeTop: true,
    fadeBottom: true,
    sections: [WhyBNCC, Courses],
  },
  {
    key: 'mid2',
    pattern: patternMid2Landing,
    fadeTop: true,
    fadeBottom: true,
    sections: [Seniors, PastEvents, Testimonials, Sponsorship],
  },
  {
    key: 'bottom',
    pattern: patternBottomLanding,
    fadeTop: true,
    sections: [FAQ, ContactUs],
  },
]

function MobileContent() {
  return (
    <div className="overflow-x-hidden">
      {zones.map(({ key, pattern, fadeTop, fadeBottom, sections }) => (
        <PatternZone
          key={key}
          src={pattern}
          fadeTop={fadeTop}
          fadeBottom={fadeBottom}
        >
          {sections.map((Section, i) => (
            <Section key={i} />
          ))}
        </PatternZone>
      ))}
      <Footer />
    </div>
  )
}

function DesktopContent() {
  const allSections = zones.flatMap((zone) => zone.sections)

  return (
    <div className="relative overflow-hidden bg-landing">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${patternLanding})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
          backgroundSize: '100% auto',
        }}
      />
      <div className="relative z-10">
        {allSections.map((Section, i) => (
          <Section key={i} />
        ))}
        <Footer />
      </div>
    </div>
  )
}

export default function Home() {
  const isMobile = useIsMobile()

  return (
    <SmoothScrollProvider>
      <div className="bg-landing">
        <CustomCursor />
        <ScrollToTop />
        <Navbar />
        <Hero />
        {isMobile ? <MobileContent /> : <DesktopContent />}
      </div>
    </SmoothScrollProvider>
  )
}
