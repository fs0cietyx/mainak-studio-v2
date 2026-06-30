"use client"

import React, { createContext, useContext, useEffect, useRef } from "react"
import { useAnimationFrame } from "framer-motion"

interface FloatingContextType {
  registerElement: (id: string, element: HTMLElement, depth: number) => void
  unregisterElement: (id: string) => void
}

const FloatingContext = createContext<FloatingContextType | null>(null)

interface FloatingProps {
  children: React.ReactNode
  className?: string
  sensitivity?: number
  easingFactor?: number
}

export default function Floating({
  children,
  className = "",
  sensitivity = 1,
  easingFactor = 0.05,
}: FloatingProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const elementsMap = useRef<Map<string, { element: HTMLElement; depth: number }>>(
    new Map()
  )
  const mousePosition = useRef({ x: 0, y: 0 })
  const currentPositions = useRef<Map<string, { x: number; y: number }>>(
    new Map()
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      
      // Calculate normalized position from center (-1 to 1)
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      
      mousePosition.current = {
        x: (mouseX - centerX) / centerX,
        y: (mouseY - centerY) / centerY,
      }
    }

    const container = containerRef.current
    if (container) {
      window.addEventListener("mousemove", handleMouseMove)
    }
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useAnimationFrame(() => {
    elementsMap.current.forEach((data, id) => {
      const targetX = mousePosition.current.x * data.depth * sensitivity * 50
      const targetY = mousePosition.current.y * data.depth * sensitivity * 50

      let current = currentPositions.current.get(id) || { x: 0, y: 0 }
      
      current.x += (targetX - current.x) * easingFactor
      current.y += (targetY - current.y) * easingFactor

      currentPositions.current.set(id, current)
      data.element.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
    })
  })

  const registerElement = (id: string, element: HTMLElement, depth: number) => {
    elementsMap.current.set(id, { element, depth })
  }

  const unregisterElement = (id: string) => {
    elementsMap.current.delete(id)
    currentPositions.current.delete(id)
  }

  return (
    <FloatingContext.Provider value={{ registerElement, unregisterElement }}>
      <div ref={containerRef} className={`relative ${className}`}>
        {children}
      </div>
    </FloatingContext.Provider>
  )
}

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  depth?: number
  style?: React.CSSProperties
}

export function FloatingElement({
  children,
  className = "",
  depth = 1,
  style,
}: FloatingElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const context = useContext(FloatingContext)
  const id = useRef(Math.random().toString(36).substring(7)).current

  useEffect(() => {
    if (elementRef.current && context) {
      context.registerElement(id, elementRef.current, depth)
    }
    return () => {
      if (context) {
        context.unregisterElement(id)
      }
    }
  }, [context, depth, id])

  return (
    <div ref={elementRef} className={`absolute ${className}`} style={style}>
      {children}
    </div>
  )
}
