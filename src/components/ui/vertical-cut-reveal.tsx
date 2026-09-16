'use client'

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { motion, type Transition } from "framer-motion"
import { cn } from "@/lib/utils"

export interface TextProps {
  children: React.ReactNode
  reverse?: boolean
  transition?: Transition
  splitBy?: "words" | "characters" | "lines" | string
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | "random" | number
  containerClassName?: string
  wordLevelClassName?: string
  elementLevelClassName?: string
  onClick?: () => void
  onStart?: () => void
  onComplete?: () => void
  autoStart?: boolean
}

export interface VerticalCutRevealRef {
  startAnimation: () => void
  reset: () => void
}

interface WordObject {
  characters: string[]
  needsSpace: boolean
}

const VerticalCutReveal = forwardRef<VerticalCutRevealRef, TextProps>(
  (
    {
      children,
      reverse = false,
      transition = {
        type: "spring",
        stiffness: 200,
        damping: 24,
      },
      splitBy = "words",
      staggerDuration = 0.02,
      staggerFrom = "first",
      containerClassName,
      wordLevelClassName,
      elementLevelClassName,
      onClick,
      onStart,
      onComplete,
      autoStart = true,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLSpanElement>(null)
    const text = typeof children === "string" ? children : (children != null ? String(children) : "")
    const [isAnimating, setIsAnimating] = useState(false)

    // Split text into characters with Unicode / grapheme support
    const splitIntoCharacters = (input: string): string[] => {
      if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        const segmenter = new (Intl as any).Segmenter("en", { granularity: "grapheme" })
        return Array.from(segmenter.segment(input), ({ segment }: any) => segment)
      }
      return Array.from(input)
    }

    // Split text based on splitBy parameter
    const elements = useMemo(() => {
      if (!text) return []
      if (splitBy === "characters") {
        const words = text.split(" ")
        return words.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== words.length - 1,
        }))
      }
      if (splitBy === "words") {
        return text.split(" ")
      }
      if (splitBy === "lines") {
        return text.split("\n")
      }
      return text.split(splitBy)
    }, [text, splitBy])

    // Calculate delay for stagger effect
    const getStaggerDelay = useCallback(
      (index: number) => {
        const total =
          splitBy === "characters"
            ? (elements as WordObject[]).reduce(
                (acc, word) => acc + word.characters.length + (word.needsSpace ? 1 : 0),
                0
              )
            : elements.length
        if (total <= 1) return 0
        if (staggerFrom === "first") return index * staggerDuration
        if (staggerFrom === "last") return (total - 1 - index) * staggerDuration
        if (staggerFrom === "center") {
          const center = Math.floor(total / 2)
          return Math.abs(center - index) * staggerDuration
        }
        if (staggerFrom === "random") {
          const randomIndex = Math.floor(Math.random() * total)
          return Math.abs(randomIndex - index) * staggerDuration
        }
        if (typeof staggerFrom === "number") {
          return Math.abs(staggerFrom - index) * staggerDuration
        }
        return index * staggerDuration
      },
      [elements, splitBy, staggerFrom, staggerDuration]
    )

    const startAnimation = useCallback(() => {
      setIsAnimating(true)
      onStart?.()
    }, [onStart])

    useImperativeHandle(ref, () => ({
      startAnimation,
      reset: () => setIsAnimating(false),
    }))

    useEffect(() => {
      if (autoStart) {
        startAnimation()
      }
    }, [autoStart, startAnimation])

    const variants = {
      hidden: { y: reverse ? "-100%" : "100%", opacity: 0 },
      visible: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: {
          ...transition,
          delay: ((transition?.delay as number) || 0) + getStaggerDelay(i),
        },
      }),
    }

    if (!text) return null

    // Render for lines
    if (splitBy === "lines") {
      return (
        <span
          className={cn("block", containerClassName)}
          onClick={onClick}
          ref={containerRef}
          {...props}
        >
          {(elements as string[]).map((line, lineIndex) => (
            <span
              key={lineIndex}
              className={cn("block overflow-hidden", wordLevelClassName)}
            >
              <motion.span
                custom={lineIndex}
                initial="hidden"
                animate={isAnimating ? "visible" : "hidden"}
                variants={variants}
                className="block will-change-transform"
                onAnimationComplete={
                  lineIndex === elements.length - 1 ? onComplete : undefined
                }
              >
                {line}
              </motion.span>
            </span>
          ))}
        </span>
      )
    }

    // Render for characters
    if (splitBy === "characters") {
      const wordsArray = elements as WordObject[]
      return (
        <span
          className={cn("inline leading-normal", containerClassName)}
          onClick={onClick}
          ref={containerRef}
          {...props}
        >
          {wordsArray.map((wordObj, wordIndex, array) => {
            const previousCharsCount = array
              .slice(0, wordIndex)
              .reduce((sum, word) => sum + word.characters.length, 0)

            return (
              <React.Fragment key={wordIndex}>
                <span
                  className={cn(
                    "inline-block whitespace-nowrap align-baseline",
                    wordLevelClassName
                  )}
                >
                  {wordObj.characters.map((char, charIndex) => (
                    <span
                      key={charIndex}
                      className={cn(
                        "inline-block overflow-hidden align-baseline relative",
                        elementLevelClassName
                      )}
                    >
                      <motion.span
                        custom={previousCharsCount + charIndex}
                        initial="hidden"
                        animate={isAnimating ? "visible" : "hidden"}
                        variants={variants}
                        onAnimationComplete={
                          wordIndex === array.length - 1 &&
                          charIndex === wordObj.characters.length - 1
                            ? onComplete
                            : undefined
                        }
                        className="inline-block will-change-transform"
                      >
                        {char}
                      </motion.span>
                    </span>
                  ))}
                </span>
                {wordObj.needsSpace && " "}
              </React.Fragment>
            )
          })}
        </span>
      )
    }

    // Default: splitBy === "words"
    const wordsList = elements as string[]
    return (
      <span
        className={cn("inline leading-relaxed", containerClassName)}
        onClick={onClick}
        ref={containerRef}
        {...props}
      >
        {wordsList.map((word, wordIndex) => (
          <React.Fragment key={wordIndex}>
            <span
              className={cn(
                "inline-block overflow-hidden align-baseline relative",
                wordLevelClassName
              )}
            >
              <motion.span
                custom={wordIndex}
                initial="hidden"
                animate={isAnimating ? "visible" : "hidden"}
                variants={variants}
                onAnimationComplete={
                  wordIndex === wordsList.length - 1 ? onComplete : undefined
                }
                className="inline-block will-change-transform"
              >
                {word}
              </motion.span>
            </span>
            {wordIndex < wordsList.length - 1 && " "}
          </React.Fragment>
        ))}
      </span>
    )
  }
)

VerticalCutReveal.displayName = "VerticalCutReveal"

export default VerticalCutReveal
export { VerticalCutReveal }
