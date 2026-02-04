"use client"

import { motion } from "framer-motion"

interface TypewriterTextProps {
  text: string
  highlightWords?: string[]
  highlightColor?: string
  className?: string
  delay?: number
}

export function TypewriterText({
  text,
  highlightWords = ["데이터"],
  highlightColor = "text-red-600",
  className = "",
  delay = 0,
}: TypewriterTextProps) {
  // Split text into lines
  const lines = text.split("\n")

  // Function to check if a character at position belongs to a highlight word
  const getCharacterStyle = (line: string, charIndex: number) => {
    for (const word of highlightWords) {
      const wordStart = line.indexOf(word)
      if (wordStart !== -1 && charIndex >= wordStart && charIndex < wordStart + word.length) {
        return highlightColor
      }
    }
    return "text-white"
  }

  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.04,
          },
        },
      }}
    >
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="block">
          {line.split("").map((char, charIndex) => {
            const colorClass = getCharacterStyle(line, charIndex)
            
            return (
              <motion.span
                key={`${lineIndex}-${charIndex}`}
                className={`inline-block ${colorClass}`}
                style={{ minWidth: char === " " ? "0.25em" : undefined }}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      damping: 12,
                      stiffness: 200,
                    },
                  },
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            )
          })}
        </div>
      ))}
    </motion.h1>
  )
}
