// Rating bar with numeric value
// - Simplified to single style: label, animated bar, number in 3-column grid
// - Value between min and max (default 0–5, step 0.5)
// - One global font style for all text

import {
    useMemo,
    useEffect,
    useState,
    startTransition,
    type CSSProperties,
    useRef,
} from "react"
import { addPropertyControls, ControlType } from "studio"
import { useInView } from "studio-motion"

interface RatingBarProps {
    value: number
    min: number
    max: number
    step: number
    trackHeight: number
    fillHeight: number
    trackColor: string
    fillColor: string
    textColor: string
    font: any
    showTrailingZero: boolean
    style?: CSSProperties
    animate: boolean
    animationDuration: number
    animationDelay: number
    label: string
    gridColumnStart?: number
    gridRowStart?: number
    displayStyle: "bar" | "rating"
    gap: number
    columns: number
    rows: number
}

/**
 * @studioIntrinsicWidth 180
 * @studioIntrinsicHeight 60
 *
 * @studioSupportedLayoutWidth any-prefer-fixed
 * @studioSupportedLayoutHeight any-prefer-fixed
 */
export default function RatingBar(props: RatingBarProps) {
    const {
        value,
        min,
        max,
        step,
        trackHeight,
        fillHeight,
        trackColor,
        fillColor,
        textColor,
        font,
        showTrailingZero,
        style,
        animate,
        animationDuration,
        animationDelay,
        label,
        gridColumnStart,
        gridRowStart,
        displayStyle,
        gap,
        columns,
        rows,
    } = props

    const clampedValue = useMemo(() => {
        if (max === min) return min
        const clamped = Math.max(min, Math.min(max, value))
        const stepped = Math.round((clamped - min) / step) * step + min
        return Math.min(max, Math.max(min, stepped))
    }, [value, min, max, step])

    const [animatedValue, setAnimatedValue] = useState(min)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (!animate || !isInView) {
            if (!animate) {
                startTransition(() => setAnimatedValue(clampedValue))
            }
            return
        }

        if (typeof window === "undefined") {
            startTransition(() => setAnimatedValue(clampedValue))
            return
        }

        // Calculate duration based on distance traveled
        // This ensures values closer to min finish faster
        const totalRange = max - min
        const distanceToTravel = clampedValue - min
        const proportionalDuration =
            (distanceToTravel / totalRange) * animationDuration * 1000

        const duration = proportionalDuration // Duration in milliseconds
        const start = min
        const delay = Math.max(0, (animationDelay || 0) * 1000) // Convert seconds to milliseconds
        let frame: number | null = null
        let timeoutId: number | null = null

        const startTime = performance.now() + delay

        const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(Math.max(elapsed / duration, 0), 1)
            const nextValue = start + (clampedValue - start) * progress

            startTransition(() => setAnimatedValue(nextValue))

            if (progress < 1) {
                frame = requestAnimationFrame(tick)
            }
        }

        if (delay > 0) {
            timeoutId = window.setTimeout(() => {
                frame = requestAnimationFrame(tick)
            }, delay)
        } else {
            frame = requestAnimationFrame(tick)
        }

        return () => {
            if (frame !== null) cancelAnimationFrame(frame)
            if (timeoutId !== null) window.clearTimeout(timeoutId)
        }
    }, [
        clampedValue,
        min,
        max,
        animate,
        animationDuration,
        animationDelay,
        isInView,
    ])

    const fillPercent = useMemo(() => {
        if (max === min) return 0
        const v = Math.max(min, Math.min(max, animatedValue))
        return ((v - min) / (max - min)) * 100
    }, [animatedValue, min, max])

    const formattedValue = useMemo(() => {
        const rounded = Math.round(animatedValue * 10) / 10
        return showTrailingZero
            ? rounded.toFixed(1)
            : rounded.toString().replace(/\.0$/, "")
    }, [animatedValue, showTrailingZero])

    const isFixedWidth = style && style.width === "100%"

    // Determine grid template based on columns and rows
    const gridTemplateColumns = useMemo(() => {
        if (columns === 1) return "1fr"
        if (columns === 2) return "1fr 1fr"
        return "1fr 1fr 1fr"
    }, [columns])

    const gridTemplateRows = useMemo(() => {
        if (rows === 1) return "auto"
        if (rows === 2) return "auto auto"
        return "auto auto auto"
    }, [rows])

    // Rating-only style (no bar)
    if (displayStyle === "rating") {
        return (
            <div
                ref={ref}
                style={{
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns,
                    gridTemplateRows,
                    alignItems: "start",
                    gap: gap,
                    width: isFixedWidth ? "100%" : "auto",
                    height: "100%",
                    gridColumnStart,
                    gridRowStart,
                    ...style,
                }}
            >
                <span
                    style={{
                        minWidth: "max-content",
                        color: textColor,
                        textAlign: "left",
                        ...font,
                    }}
                >
                    {label}
                </span>
                <span
                    style={{
                        minWidth: "max-content",
                        color: textColor,
                        textAlign: "left",
                        ...font,
                    }}
                >
                    {formattedValue}
                </span>
            </div>
        )
    }

    // Bar style (original 3-column grid)
    return (
        <div
            ref={ref}
            style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns,
                gridTemplateRows,
                alignItems: "center",
                gap: gap,
                width: isFixedWidth ? "100%" : "auto",
                height: "100%",
                gridColumnStart,
                gridRowStart,
                ...style,
            }}
        >
            <span
                style={{
                    minWidth: "max-content",
                    color: textColor,
                    textAlign: "left",
                    ...font,
                }}
            >
                {label}
            </span>
            <div
                style={{
                    position: "relative",
                    height: trackHeight,
                    backgroundColor: trackColor,
                    overflow: "visible",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        left: 0,
                        height: fillHeight,
                        width: `${fillPercent}%`,
                        backgroundColor: fillColor,
                    }}
                />
            </div>
            <span
                style={{
                    minWidth: "max-content",
                    color: textColor,
                    textAlign: "left",
                    ...font,
                }}
            >
                {formattedValue}
            </span>
        </div>
    )
}

addPropertyControls(RatingBar, {
    displayStyle: {
        type: ControlType.Enum,
        title: "Style",
        options: ["bar", "rating"],
        optionTitles: ["Bar", "Rating"],
        defaultValue: "bar",
        displaySegmentedControl: true,
    },
    label: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "Rating",
    },
    columns: {
        type: ControlType.Number,
        title: "Columns",
        defaultValue: 1,
        min: 1,
        max: 3,
        step: 1,
        displayStepper: true,
    },
    rows: {
        type: ControlType.Number,
        title: "Rows",
        defaultValue: 3,
        min: 1,
        max: 3,
        step: 1,
        displayStepper: true,
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 12,
        min: 0,
        max: 100,
        step: 1,
        unit: "px",
        displayStepper: false,
    },
    value: {
        type: ControlType.Number,
        title: "Value",
        defaultValue: 1,
        min: 0,
        max: 5,
        step: 0.5,
        displayStepper: false,
    },
    min: {
        type: ControlType.Number,
        title: "Min",
        defaultValue: 0,
        min: -100,
        max: 100,
        step: 0.5,
        displayStepper: false,
    },
    max: {
        type: ControlType.Number,
        title: "Max",
        defaultValue: 5,
        min: 0,
        max: 100,
        step: 0.5,
        displayStepper: false,
    },
    step: {
        type: ControlType.Number,
        title: "Step",
        defaultValue: 0.5,
        min: 0.1,
        max: 10,
        step: 0.1,
        displayStepper: false,
    },
    showTrailingZero: {
        type: ControlType.Boolean,
        title: "Trailing .0",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    trackHeight: {
        type: ControlType.Number,
        title: "Track Height",
        defaultValue: 1,
        min: 1,
        max: 50,
        step: 1,
        unit: "px",
        hidden: ({ displayStyle }) => displayStyle === "rating",
    },
    fillHeight: {
        type: ControlType.Number,
        title: "Fill Height",
        defaultValue: 3,
        min: 1,
        max: 50,
        step: 1,
        unit: "px",
        hidden: ({ displayStyle }) => displayStyle === "rating",
    },
    trackColor: {
        type: ControlType.Color,
        title: "Track",
        defaultValue: "#CCCCCC",
        hidden: ({ displayStyle }) => displayStyle === "rating",
    },
    fillColor: {
        type: ControlType.Color,
        title: "Fill",
        defaultValue: "#000000",
        hidden: ({ displayStyle }) => displayStyle === "rating",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text",
        defaultValue: "#000000",
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        defaultValue: {
            fontSize: "15px",
            variant: "Medium",
            letterSpacing: "-0.01em",
            lineHeight: "1em",
        },
        controls: "extended",
        defaultFontType: "sans-serif",
    },
    animate: {
        type: ControlType.Boolean,
        title: "Animate",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    animationDuration: {
        type: ControlType.Number,
        title: "Duration",
        defaultValue: 0.6,
        min: 0,
        max: 5,
        step: 0.1,
        unit: "s",
        displayStepper: false,
        hidden: ({ animate }) => !animate,
    },
    animationDelay: {
        type: ControlType.Number,
        title: "Delay",
        defaultValue: 0,
        min: 0,
        max: 5,
        step: 0.1,
        unit: "s",
        displayStepper: false,
        hidden: ({ animate }) => !animate,
    },
    gridColumnStart: {
        type: ControlType.Number,
        title: "Grid Column",
        defaultValue: 1,
        min: 1,
        max: 20,
        step: 1,
        displayStepper: true,
    },
    gridRowStart: {
        type: ControlType.Number,
        title: "Grid Row",
        defaultValue: 1,
        min: 1,
        max: 20,
        step: 1,
        displayStepper: true,
    },
})
