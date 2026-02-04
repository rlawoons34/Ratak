"use client"

import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="particle absolute top-1/4 left-1/4 w-1 h-1 bg-red-500/40 rounded-full" />
        <div className="particle-delayed absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/20 rounded-full" />
        <div className="particle-slow absolute bottom-1/4 left-1/2 w-1 h-1 bg-red-400/30 rounded-full" />
        <div className="particle absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-white/30 rounded-full" />
        <div className="particle-delayed absolute bottom-1/3 left-1/3 w-1 h-1 bg-red-500/20 rounded-full" />
      </div>
      
      <div className="relative text-center space-y-6">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white whitespace-pre-wrap"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
          }}
        >
          {/* 첫 번째 줄: '직감이 아닌' + '데이터'(빨강) + '로,' */}
          <span className="block">
            {"직감이 아닌 ".split("").map((char, i) => (
              <motion.span 
                key={`line1-${i}`} 
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              >
                {char}
              </motion.span>
            ))}
            <span className="text-red-600">
              {"데이터".split("").map((char, i) => (
                <motion.span 
                  key={`highlight-${i}`} 
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            {"로,".split("").map((char, i) => (
              <motion.span 
                key={`line1-end-${i}`} 
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              >
                {char}
              </motion.span>
            ))}
          </span>

          {/* 두 번째 줄 */}
          <span className="block mt-2 md:mt-4">
            {"당신의 탁구를 ".split("").map((char, i) => (
              <motion.span 
                key={`line2-${i}`} 
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              >
                {char}
              </motion.span>
            ))}
            <span className="text-red-600">
              {"증명".split("").map((char, i) => (
                <motion.span 
                  key={`highlight2-${i}`} 
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            {"하세요.".split("").map((char, i) => (
              <motion.span 
                key={`line2-end-${i}`} 
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
          대학 탁구의 새로운 기준, TakuRating
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span>실시간 레이팅 업데이트</span>
        </div>
      </div>
    </section>
  )
}
