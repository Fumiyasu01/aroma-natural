'use client'

import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { FaTrash, FaEdit } from 'react-icons/fa'

interface SwipeableCardProps {
  children: ReactNode
  onDelete?: () => void
  onEdit?: () => void
  className?: string
}

export default function SwipeableCard({ 
  children, 
  onDelete,
  onEdit,
  className = ''
}: SwipeableCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const x = useMotionValue(0)
  const controls = useAnimation()
  
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['#ef4444', '#ffffff', '#9B7EBD']
  )
  
  const opacity = useTransform(
    x,
    [-100, -50, 0, 50, 100],
    [1, 0.5, 0, 0.5, 1]
  )

  const handleDragEnd = async (event: any, info: any) => {
    const threshold = 100
    
    if (info.offset.x > threshold && onEdit) {
      await controls.start({ x: 100, opacity: 0 })
      onEdit()
      controls.start({ x: 0, opacity: 1 })
    } else if (info.offset.x < -threshold && onDelete) {
      setIsDeleting(true)
      await controls.start({ x: -300, opacity: 0 })
      onDelete()
    } else {
      controls.start({ x: 0 })
    }
  }

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ background }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="relative bg-white rounded-2xl"
      >
        {/* 左スワイプ時のアイコン（削除） */}
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ opacity }}
        >
          <FaTrash className="text-red-500 text-xl" />
        </motion.div>
        
        {/* 右スワイプ時のアイコン（編集） */}
        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2"
          style={{ opacity }}
        >
          <FaEdit className="text-[var(--primary)] text-xl" />
        </motion.div>
        
        {/* コンテンツ */}
        <div className="relative z-10 bg-white rounded-2xl">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}