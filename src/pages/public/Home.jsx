import { TrendingUp, Shield, Smartphone, BarChart3 } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import HowItWorks from '../../components/landing/HowItWorks'
import StatsSection from '../../components/landing/StatsSection'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Footer from '../../components/layout/Footer'
import ScrollToTop from '../../components/ui/ScrollToTop'

export default function Home() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Expense Tracking',
      description: 'Easily track where your money goes with simple categorization and real-time updates.'
    },
    {
      icon: BarChart3,
      title: 'Visual Reports',
      description: 'Clean charts and graphs that help you understand your spending patterns at a glance.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and secure. We never share your information.'
    },
    {
      icon: Smartphone,
      title: 'Multi-Device Sync',
      description: 'Access your finances from any device. Your data syncs seamlessly across all platforms.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading */}
            <div className="font-['Press_Start_2P'] text-2xl sm:text-3xl md:text-5xl text-black mb-8 leading-8">
              FINANCE FLOW
            </div>
            
            <h1 className="leading-10 text-3xl md:text-4xl lg:text-6xl font-bold text-black mb-6">
              Track Your Money
              <span className="text-xl md:text-2xl lg:text-3xl text-primary-500 mt-2 block">The Simple Way</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Free personal finance tracker with clean design. No subscriptions, no complexity  just straightforward money management that works.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                variant="black"
                className="text-lg px-8 py-4"
                onClick={() => window.location.href = '/signup'}
              >
                Start Tracking Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-4"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                See Features
              </Button>
            </div>

            {/* App Preview */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl h-64 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="font-['Press_Start_2P'] text-primary-400 text-xl mb-4">THE DASHBOARD</div>
                  <p className="text-gray-300">Your financial command center</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-15"
            >
              Everything you<span className="text-transparent mx-3 bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">Need</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for simple money management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Stats & Testimonials Section */}
      <StatsSection />

      {/* Foooter */}
      <Footer/>
      {/*Scroll to Top Button */}
      <ScrollToTop/>
    </div>
  )
}