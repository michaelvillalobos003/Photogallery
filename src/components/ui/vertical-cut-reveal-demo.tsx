'use client'

import React from "react"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"

export function WelcomeExample() {
  return (
    <div className="w-full h-full text-2xl sm:text-4xl md:text-5xl flex flex-col items-start justify-center p-10 text-white tracking-wide uppercase">
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={0.025}
        staggerFrom="first"
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 21,
        }}
      >
        {`HI 👋, FRIEND!`}
      </VerticalCutReveal>
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={0.025}
        staggerFrom="last"
        reverse={true}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 21,
          delay: 0.5,
        }}
      >
        {`🌤️ IT IS NICE ⇗ TO`}
      </VerticalCutReveal>
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={0.025}
        staggerFrom="center"
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 21,
          delay: 1.1,
        }}
      >
        {`MEET 😊 YOU.`}
      </VerticalCutReveal>
    </div>
  )
}

export function LinesSplitExample() {
  return (
    <div className="w-full h-full text-xl md:text-2xl flex flex-col items-start justify-center p-6 text-white tracking-wide">
      <div className="flex flex-col justify-center w-full items-start space-y-4">
        <VerticalCutReveal
          splitBy="lines"
          staggerDuration={0.2}
          staggerFrom="first"
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 30,
            delay: 0.2,
          }}
          containerClassName="text-white leading-relaxed"
        >
          {`→ We're on a mission\nto make the 🌐 web\nsuper fun again! ☺`}
        </VerticalCutReveal>
      </div>
    </div>
  )
}

export function WordsSplitExample() {
  return (
    <div className="w-full h-full text-lg md:text-2xl flex flex-col items-start justify-center p-10 bg-[#0015ff] text-white tracking-wide font-bold">
      <div className="flex flex-col justify-center w-full items-center space-y-4">
        <VerticalCutReveal
          splitBy="words"
          staggerDuration={0.1}
          staggerFrom="first"
          reverse={true}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 30,
          }}
        >
          {`super cool & awesome example text`}
        </VerticalCutReveal>
      </div>
    </div>
  )
}

export function StaggerDirectionsExample() {
  return (
    <div className="w-full h-full text-sm sm:text-base md:text-lg flex flex-col items-start justify-center p-4 text-white tracking-wide uppercase font-bold">
      <div className="flex flex-col justify-center w-full items-center space-y-4">
        <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.05}
          staggerFrom="first"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
          }}
        >
          {`THIS STAGGERS FROM FIRST`}
        </VerticalCutReveal>
        <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.05}
          staggerFrom="last"
          reverse={true}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
            delay: 0.8,
          }}
        >
          {`THIS STAGGERS FROM LAST`}
        </VerticalCutReveal>
      </div>
    </div>
  )
}

export function LongTextExample() {
  return (
    <div className="w-full h-full text-base md:text-lg flex items-center justify-center p-6 text-neutral-200">
      <VerticalCutReveal
        splitBy="words"
        staggerDuration={0.03}
        staggerFrom="first"
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 30,
          delay: 0.1,
        }}
        containerClassName="text-white leading-relaxed"
      >
        {`"When a small, unassuming object exceeds our expectations, we are not only surprised but pleased. Simplicity is about the unexpected pleasure derived from what is likely to be insignificant." ― John Maeda`}
      </VerticalCutReveal>
    </div>
  )
}

export default WelcomeExample
