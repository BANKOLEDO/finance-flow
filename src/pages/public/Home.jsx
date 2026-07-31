import Navbar from '../../components/layout/Navbar'
import Hero from '../../components/landing/Hero'
import Features from '../../components/landing/Features'
import HowItWorks from '../../components/landing/HowItWorks'
import StatsSection from '../../components/landing/StatsSection'
import Footer from '../../components/layout/Footer'
import ScrollToTop from '../../components/ui/ScrollToTop'

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <StatsSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
