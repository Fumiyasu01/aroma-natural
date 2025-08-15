'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  delay?: number
  className?: string
  onClick?: () => void
}

export default function AnimatedCard({ 
  children, 
  delay = 0, 
  className = '',
  onClick 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        delay,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  )
}