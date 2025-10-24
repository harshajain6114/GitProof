"use client"

import { useEffect } from "react"

interface ToastProps {
  message: string
  type: "success" | "error"
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === "success" ? "bg-primary/20 border-primary/50" : "bg-destructive/20 border-destructive/50"
  const textColor = type === "success" ? "text-primary" : "text-destructive"

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColor} border rounded-lg p-4 ${textColor} text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-300`}
    >
      {message}
    </div>
  )
}
