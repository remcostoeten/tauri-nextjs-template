"use client"


import type React from "react"
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
  memo,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  type Transition,
  type VariantLabels,
  type Target,
  type TargetAndTransition,
  type Variants,

} from "framer-motion"

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ")
}

interface RotatingTextRef {
  next: () => void
  previous: () => void
  jumpTo: (index: number) => void
  reset: () => void
}

interface RotatingTextProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof motion.span>,
    "children" | "transition" | "initial" | "animate" | "exit"
  > {
  texts: string[]
  transition?: Transition
  initial?: boolean | Target | VariantLabels
  animate?: boolean | VariantLabels | TargetAndTransition
  exit?: Target | VariantLabels
  animatePresenceMode?: "sync" | "wait"
  animatePresenceInitial?: boolean
  rotationInterval?: number
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | "random" | number
  loop?: boolean
  auto?: boolean
  splitBy?: "characters" | "words" | "lines" | string
  onNext?: (index: number) => void
  mainClassName?: string
  splitLevelClassName?: string
  elementLevelClassName?: string
}

const RotatingText = memo(forwardRef<RotatingTextRef, RotatingTextProps>(
  (
    {
      texts,
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-120%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 4500,
      staggerDuration = 0.01,
      staggerFrom = "last",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      ...rest
    },
    ref,
  ) => {
    const [currentTextIndex, setCurrentTextIndex] = useState<number>(0)

    const splitIntoCharacters = useCallback((text: string): string[] => {
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        try {
          const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })
          return Array.from(segmenter.segment(text), (segment) => segment.segment)
        } catch (error) {
          console.error("Intl.Segmenter failed, falling back to simple split:", error)
          return text.split("")
        }
      }
      return text.split("")
    }, [])

    const elements = useMemo(() => {
      const currentText: string = texts[currentTextIndex] ?? ""
      if (splitBy === "characters") {
        const words = currentText.split(/(\s+)/)
        let charCount = 0
        return words
          .filter((part) => part.length > 0)
          .map((part) => {
            const isSpace = /^\s+$/.test(part)
            const chars = isSpace ? [part] : splitIntoCharacters(part)
            const startIndex = charCount
            charCount += chars.length
            return { characters: chars, isSpace: isSpace, startIndex: startIndex }
          })
      }
      if (splitBy === "words") {
        return currentText
          .split(/(\s+)/)
          .filter((word) => word.length > 0)
          .map((word, i) => ({
            characters: [word],
            isSpace: /^\s+$/.test(word),
            startIndex: i,
          }))
      }
      if (splitBy === "lines") {
        return currentText.split("\n").map((line, i) => ({
          characters: [line],
          isSpace: false,
          startIndex: i,
        }))
      }
      return currentText.split(splitBy).map((part, i) => ({
        characters: [part],
        isSpace: false,
        startIndex: i,
      }))
    }, [texts, currentTextIndex, splitBy, splitIntoCharacters])

    const totalElements = useMemo(() => elements.reduce((sum, el) => sum + el.characters.length, 0), [elements])

    const getStaggerDelay = useCallback(
      (index: number, total: number): number => {
        if (total <= 1 || !staggerDuration) return 0
        const stagger = staggerDuration
        switch (staggerFrom) {
          case "first":
            return index * stagger
          case "last":
            return (total - 1 - index) * stagger
          case "center":
            const center = (total - 1) / 2
            return Math.abs(center - index) * stagger
          case "random":
            return Math.random() * (total - 1) * stagger
          default:
            if (typeof staggerFrom === "number") {
              const fromIndex = Math.max(0, Math.min(staggerFrom, total - 1))
              return Math.abs(fromIndex - index) * stagger
            }
            return index * stagger
        }
      },
      [staggerFrom, staggerDuration],
    )

    const handleIndexChange = useCallback(
      (newIndex: number) => {
        setCurrentTextIndex(newIndex)
        onNext?.(newIndex)
      },
      [onNext],
    )

    const next = useCallback(() => {
      const nextIndex = currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1
      if (nextIndex !== currentTextIndex) handleIndexChange(nextIndex)
    }, [currentTextIndex, texts.length, loop, handleIndexChange])

    const previous = useCallback(() => {
      const prevIndex = currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1
      if (prevIndex !== currentTextIndex) handleIndexChange(prevIndex)
    }, [currentTextIndex, texts.length, loop, handleIndexChange])

    const jumpTo = useCallback(
      (index: number) => {
        const validIndex = Math.max(0, Math.min(index, texts.length - 1))
        if (validIndex !== currentTextIndex) handleIndexChange(validIndex)
      },
      [texts.length, currentTextIndex, handleIndexChange],
    )

    const reset = useCallback(() => {
      if (currentTextIndex !== 0) handleIndexChange(0)
    }, [currentTextIndex, handleIndexChange])

    useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [next, previous, jumpTo, reset])

    useEffect(() => {
      if (!auto || texts.length <= 1) return
      const intervalId = setInterval(next, rotationInterval)
      return () => clearInterval(intervalId)
    }, [next, rotationInterval, auto, texts.length])

    return (
      <motion.span
        className={cn("inline-flex flex-wrap whitespace-pre-wrap relative align-bottom pb-[10px]", mainClassName)}
        {...rest}
        layout
      >
        <span className="sr-only">{texts[currentTextIndex]}</span>
        <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
          <motion.div
            key={currentTextIndex}
            className={cn(
              "inline-flex flex-wrap relative",
              splitBy === "lines" ? "flex-col items-start w-full" : "flex-row items-baseline",
            )}
            layout
            aria-hidden="true"
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {elements.map((elementObj, elementIndex) => (
              <span
                key={elementIndex}
                className={cn("inline-flex", splitBy === "lines" ? "w-full" : "", splitLevelClassName)}
                style={{ whiteSpace: "pre" }}
              >
                {elementObj.characters.map((char, charIndex) => {
                  const globalIndex = elementObj.startIndex + charIndex
                  return (
                    <motion.span
                      key={`${char}-${charIndex}`}
                      initial={initial as any}
                      animate={animate as any}
                      exit={exit as any}
                      transition={{
                        ...transition,
                        delay: getStaggerDelay(globalIndex, totalElements),
                      }}
                      className={cn("inline-block leading-none tracking-tight", elementLevelClassName)}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  )
                })}
              </span>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.span>
    )
  },
))
RotatingText.displayName = "RotatingText"

const ShinyText = memo<{ text: string; className?: string }>(({ text, className = "" }) => (
  <span className={cn("relative overflow-hidden inline-block", className)}>
    {text}
    <span
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
        animation: "shine 2s infinite linear",
        opacity: 0.5,
        pointerEvents: "none",
      }}
    ></span>
    <style>{`
            @keyframes shine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `}</style>
  </span>
))
ShinyText.displayName = "ShinyText"

interface NavLinkProps {
  href?: string
  children: ReactNode
  className?: string
  onClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void
}

const NavLink = memo<NavLinkProps>(({ href = "#", children, className = "", onClick }) => (
  <motion.a
    href={href}
    onClick={onClick}
    className={cn(
      "relative group text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 flex items-center py-1",
      className,
    )}
    whileHover="hover"
  >
    {children}
    <motion.div
      className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-[#0CF2A0]"
      variants={{ initial: { scaleX: 0, transformOrigin: "center" }, hover: { scaleX: 1, transformOrigin: "center" } }}
      initial="initial"
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  </motion.a>
))
NavLink.displayName = "NavLink"

interface Dot {
  x: number
  y: number
  baseColor: string
  targetOpacity: number
  currentOpacity: number
  opacitySpeed: number
  baseRadius: number
  currentRadius: number
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number | null>(null)
  const lastFrameTime = useRef<number>(0)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [dots, setDots] = useState<Dot[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isDarkMode, setIsDarkMode] = useState(false)

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10)
  })

  const gridRef = useRef<Record<string, number[]>>({})
  const canvasSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 })
  const mousePositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null })
  const debouncedMouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null })

  // Performance constants
  const DOT_SPACING = 30 // Increased from 25 to reduce dot count
  const BASE_OPACITY_MIN = 0.4
  const BASE_OPACITY_MAX = 0.5
  const BASE_RADIUS = 1
  const INTERACTION_RADIUS = 120 // Reduced from 150
  const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS
  const OPACITY_BOOST = 1.2
  const RADIUS_BOOST = 4.0
  const GRID_CELL_SIZE = Math.max(50, Math.floor(INTERACTION_RADIUS / 1.5))
  const TARGET_FPS = 60
  const FRAME_TIME = 1000 / TARGET_FPS
  const MOUSE_DEBOUNCE_MS = 16 // ~60fps mouse updates

  // Debounced mouse position update
  const lastMouseUpdate = useRef<number>(0)
  const handleMouseMove = useCallback((event: globalThis.MouseEvent) => {
    const now = performance.now()
    if (now - lastMouseUpdate.current < MOUSE_DEBOUNCE_MS) return
    lastMouseUpdate.current = now

    const canvas = canvasRef.current
    if (!canvas) {
      mousePositionRef.current = { x: null, y: null }
      debouncedMouseRef.current = { x: null, y: null }
      return
    }
    const rect = canvas.getBoundingClientRect()
    const canvasX = event.clientX - rect.left
    const canvasY = event.clientY - rect.top
    mousePositionRef.current = { x: canvasX, y: canvasY }
    debouncedMouseRef.current = { x: canvasX, y: canvasY }
  }, [MOUSE_DEBOUNCE_MS])

  const generateDots = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    const newDots: Dot[] = []
    const numDots = Math.floor((width * height) / 10000) // Adjust density as needed

    // Theme colors
    const primaryColor = isDarkMode ? 'oklch(0.7724 0.1308 38.7559)' : 'oklch(0.6171 0.1375 39.0427)'
    const accentColor = isDarkMode ? 'oklch(0.1130 0.0078 95.4245)' : 'oklch(0.9245 0.0138 92.9892)'

    for (let i = 0; i < numDots; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const baseColor = Math.random() > 0.5 ? primaryColor : accentColor
      const targetOpacity = Math.random() * 0.5 + 0.1 // Random opacity between 0.1 and 0.6
      const baseRadius = Math.random() * 2 + 1 // Random radius between 1 and 3

      newDots.push({
        x,
        y,
        baseColor,
        targetOpacity,
        currentOpacity: 0,
        opacitySpeed: Math.random() * 0.02 + 0.01,
        baseRadius,
        currentRadius: baseRadius,
      })
    }

    setDots(newDots)
  }, [isDarkMode])

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const { width, height } = canvas
    canvasSizeRef.current = { width, height }
    generateDots()
  }, [generateDots])

  const animateDots = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    dots.forEach((dot: Dot) => {
      // Update opacity
      if (dot.currentOpacity < dot.targetOpacity) {
        dot.currentOpacity = Math.min(dot.currentOpacity + dot.opacitySpeed, dot.targetOpacity)
      } else if (dot.currentOpacity > dot.targetOpacity) {
        dot.currentOpacity = Math.max(dot.currentOpacity - dot.opacitySpeed, dot.targetOpacity)
      }

      // Draw dot
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2)
      ctx.fillStyle = dot.baseColor
      ctx.globalAlpha = dot.currentOpacity
      ctx.fill()
    })

    requestAnimationFrame(animateDots)
  }, [dots])

  useEffect(() => {
    // Check if dark mode is enabled
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)

    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    darkModeMediaQuery.addEventListener('change', handleDarkModeChange)
    return () => darkModeMediaQuery.removeEventListener('change', handleDarkModeChange)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  useEffect(() => {
    handleResize()
    const handleMouseLeave = () => {
      mousePositionRef.current = { x: null, y: null }
      debouncedMouseRef.current = { x: null, y: null }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("resize", handleResize)
    document.documentElement.addEventListener("mouseleave", handleMouseLeave)

    animationFrameId.current = requestAnimationFrame(animateDots)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [handleResize, handleMouseMove, animateDots])

  // Memoized variants to prevent recreation
  const headerVariants: Variants = useMemo(() => ({
    top: {
      backgroundColor: "rgba(17, 17, 17, 0.8)",
      borderBottomColor: "rgba(55, 65, 81, 0.5)",
      position: "fixed",
      boxShadow: "none",
    },
    scrolled: {
      backgroundColor: "rgba(17, 17, 17, 0.95)",
      borderBottomColor: "rgba(75, 85, 99, 0.7)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      position: "fixed",
    },
  }), [])

  const contentDelay = 0.3
  const itemDelayIncrement = 0.1

  const animationVariants = useMemo(() => ({
    bannerVariants: {
      hidden: { opacity: 0, y: -10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: contentDelay } },
    },
    headlineVariants: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement } },
    },
    subHeadlineVariants: {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement * 2 } },
    },
    formVariants: {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement * 3 } },
    },
    trialTextVariants: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.5, delay: contentDelay + itemDelayIncrement * 4 } },
    },
    imageVariants: {
      hidden: { opacity: 0, scale: 0.95, y: 20 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.6, delay: contentDelay + itemDelayIncrement * 6, ease: [0.16, 1, 0.3, 1] },
      },
    },
  }), [contentDelay, itemDelayIncrement])

  return (
    <div className="relative bg-[#111111] text-gray-300 h-screen flex flex-col overflow-x-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, #111111 90%), radial-gradient(ellipse at center, transparent 40%, #111111 95%)",
        }}
      ></div>
{/*
      <motion.header
        variants={headerVariants}
        initial="top"
        animate={isScrolled ? "scrolled" : "top"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="px-6 w-full md:px-10 lg:px-16 sticky top-0 z-30 backdrop-blur-md border-b"
      >
        <nav className="flex justify-between items-center max-w-screen-xl mx-auto h-[70px]">
          <div className="flex items-center flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="#0CF2A0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="#0CF2A0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="#0CF2A0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-bold text-white ml-2">Nexus</span>
          </div>

          <div className="flex items-center flex-shrink-0 space-x-4 lg:space-x-6">
            <NavLink href="/dashboard" className="hidden md:inline-block">
              Dashboard
            </NavLink>

            <NavLink href="/login" className="hidden md:inline-block">
              Login
            </NavLink>

            <motion.a
              href="/register"
              className="bg-[#0CF2A0] text-[#111111] px-4 py-[6px] rounded-md text-sm font-semibold hover:bg-opacity-90 transition-colors duration-200 whitespace-nowrap shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              Register
            </motion.a>
          </div>
        </nav>
      </motion.header> */}

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 pb-16 relative z-10">
        <div className="flex flex-col items-center justify-center pt-16">
          <motion.div variants={animationVariants.bannerVariants} initial="hidden" animate="visible" className="mb-6">
            <ShinyText
              text="I also don't know"
              className="bg-[#1a1a1a] border border-gray-700 text-[#0CF2A0] px-4 py-1 rounded-full text-xs sm:text-sm font-medium cursor-pointer hover:border-[#0CF2A0]/50 transition-colors"
            />
          </motion.div>
          <motion.h1
            variants={animationVariants.headlineVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-4xl font-semibold text-white leading-tight max-w-4xl mb-4"
          >
            Why use Tauri over Electron?
            <br />{" "}
            <span className="inline-block h-[1.2em] sm:h-[1.2em] lg:h-[1.2em] overflow-hidden align-bottom">
              <RotatingText
                texts={["Self hate", "Depression", "PERfoRManCE"]}
                mainClassName="text-[#0CF2A0] mx-1"
                staggerFrom={"last"}
                initial={{ y: "-100%", opacity: 0 } as any}
                animate={{ y: 0, opacity: 1 } as any}
                exit={{ y: "110%", opacity: 0 } as any}
                staggerDuration={0.01}
                transition={{ type: "spring", damping: 18, stiffness: 250 }}
                rotationInterval={4500}
                splitBy="characters"
                auto={true}
                loop={true}
              />
            </span>
          </motion.h1>
          <motion.p
            variants={animationVariants.subHeadlineVariants}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-8 text-pretty"
          >
            Support your customers on Slack, Microsoft Teams, Discord and many more – and move from answering tickets to
            building genuine relationships.
          </motion.p>
          <motion.div
            variants={animationVariants.formVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mx-auto mb-3"
          >
            <motion.button
              className="bg-[#0CF2A0] text-[#111111] px-8 py-3 rounded-lg text-base font-semibold hover:bg-opacity-90 transition-colors duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              Get Started
            </motion.button>
            <motion.a
              href="/login"
              className="text-[#0CF2A0] px-8 py-3 rounded-lg text-base font-semibold hover:underline transition-colors duration-200"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              Login
            </motion.a>
            </motion.div>
        </div>
      </main>
    </div>
  )
}

