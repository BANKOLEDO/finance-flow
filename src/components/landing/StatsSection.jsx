// src/components/landing/StatsSection.jsx
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, TrendingUp, Shield, Zap, Quote } from 'lucide-react'

export default function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Active Users',
      description: 'People taking control of their finances',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: TrendingUp,
      value: '$2.5M+',
      label: 'Tracked Monthly',
      description: 'In expenses managed through our platform',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Shield,
      value: '100%',
      label: 'Secure & Private',
      description: 'Your data is encrypted and protected',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      value: '2min',
      label: 'Setup Time',
      description: 'Get started in just two minutes',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const testimonials = [
    {
      quote: "Finally, a finance app that doesn't overwhelm me. Simple, clean, and actually useful.",
      author: "Sarah M.",
      role: "Freelance Designer",
      avatar: "SM"
    },
    {
      quote: "I've tried every budget app out there. FinanceFlow is the first one I've actually stuck with.",
      author: "Mike R.",
      role: "Software Engineer",
      avatar: "MR"
    },
    {
      quote: "As a student, keeping track of expenses was stressful. This made it simple and stress-free.",
      author: "Jessica T.",
      role: "College Student",
      avatar: "JT"
    }
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

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    }
  }

  const testimonialVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }


  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Stats Header */}
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
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">Thousands</span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Real people achieving real financial progress with our intuitive platform
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={statVariants}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                  <stat.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-black mb-1">{stat.value}</div>
              <div className="text-sm font-semibold text-gray-900 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-600">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.h3 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16"
          >
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">Users Say</span>
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={testimonialVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 h-full">
                  {/* Quote Icon */}
                  <div className="absolute -top-4 -left-4">
                    <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg">
                      <Quote className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="text-gray-700 mb-6 leading-relaxed text-lg italic">
                    "{testimonial.quote}"
                  </div>

                  {/* Author */}
                  <div className="flex items-center space-x-4 pt-6 border-t border-gray-200/50">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold text-sm">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>

                  {/* Hover Gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            transition: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="absolute top-1/4 left-10 w-4 h-4 bg-primary-500/20 rounded-full"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            transition: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }
          }}
          className="absolute bottom-1/4 right-10 w-6 h-6 bg-purple-500/20 rounded-full"
        />
      </div>
    </section>
  )
}