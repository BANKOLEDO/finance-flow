import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { UserPlus, TrendingUp, Target, BarChart3, CheckCircle, ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  const steps = [
    {
      step: 1,
      icon: UserPlus,
      title: 'Sign Up in Seconds',
      description: 'Create your free account with just an email. No credit card required, no complex setup.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      step: 2,
      icon: TrendingUp,
      title: 'Track Your Spending',
      description: 'Quickly add transactions as you go. Categorize expenses and see where your money flows.',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100'
    },
    {
      step: 3,
      icon: Target,
      title: 'Set Simple Goals',
      description: 'Create budgets that make sense. Set spending limits and savings targets that actually work.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      step: 4,
      icon: BarChart3,
      title: 'Watch Your Progress',
      description: 'See your financial health improve with clean visual reports and real-time insights.',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  const benefits = [
    'No credit card required',
    'Setup in under 2 minutes',
    'Works on all devices',
    'Data stays private & secure',
    'Free forever - no hidden costs'
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    }
  }

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-20"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">Works</span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Getting started with Finance Flow is simple and takes just minutes
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20"
        >
          {/* Steps List */}
          <div className="space-y-8">
            {steps.map((step) => (
              <motion.div
                key={step.step}
                variants={stepVariants}
                whileHover={{ 
                  x: 10,
                  transition: { duration: 0.2 }
                }}
                className="flex space-x-6 group relative"
              >

                {/* Step Number */}
                <div className="flex-shrink-0">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform duration-200"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {step.step}
                  </motion.div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <motion.div 
                      className={`p-2 rounded-lg bg-gradient-to-r ${step.color} shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <step.icon className="h-5 w-5 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-left leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Visual Timeline */}
          <motion.div
            variants={cardVariants}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.3 }
            }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
              {/* Benefits List */}
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="flex items-center space-x-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className="flex-shrink-0"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </motion.div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Stats */}
              <motion.div 
                className="mt-8 p-2  grid grid-cols-2 gap-6 text-center"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl p-4 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-2xl font-bold text-gray-900 mb-2">2min</div>
                  <div className="text-sm text-gray-600 font-medium">Setup Time</div>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg p-4 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-2xl font-bold text-gray-900 mb-2">$0</div>
                  <div className="text-sm text-gray-600 font-medium">Cost</div>
                </motion.div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                className="absolute -top-2 -right-2 w-4 h-4 bg-primary-500/20 rounded-full"
              />
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }
                }}
                className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-500/20 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Start CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8 }}
          className="text-center mx-auto max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 px-4 py-6"
        >
            <Card className="p-8 max-w-3xl mx-auto bg-gradient-to-r from-black to-gray-800 text-white">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-32 h-32 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 border-2 border-white rounded-full"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">Ready to Start Your Financial Journey?</h3>
                <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
                  Join thousands who have already taken control of their finances
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => window.location.href = '/signup'}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 mx-auto"
                  >
                    <span>Start Free Today</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </Card>
        </motion.div>
      </div>
    </section>
  )
}