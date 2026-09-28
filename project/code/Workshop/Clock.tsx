// Simple number—based text clock for local timezone
import { useEffect, useState, startTransition, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "studio"

interface LocalTextClockProps {
    font: any
    color: string
    borderRadius: number
    style?: CSSProperties
    boxShadow: string
    border: {
        borderWidth: number
        borderStyle: string
        borderColor: string
    }
    padding: string
    blendMode: string
    horizontalAlign: "flex-start" | "center" | "flex-end"
    verticalAlign: "flex-start" | "center" | "flex-end"
    showGMT: boolean
}

/**
 * Simple number—based text clock for local timezone
 *
 * @studioIntrinsicWidth 180
 * @studioIntrinsicHeight 60
 *
 * @studioSupportedLayoutWidth any
 * @studioSupportedLayoutHeight auto
 */
export default function LocalTextClock(props: LocalTextClockProps) {
    const {
        font,
        color,
        borderRadius,
        style,
        boxShadow,
        border,
        padding,
        blendMode,
        horizontalAlign,
        verticalAlign,
        showGMT,
    } = props
    const [time, setTime] = useState("")
    const [locationLabel, setLocationLabel] = useState("")
    const [gmtOffset, setGmtOffset] = useState("")

    useEffect(() => {
        function updateTime() {
            const now = new Date()
            const h = now.getHours().toString().padStart(2, "0")
            const m = now.getMinutes().toString().padStart(2, "0")
            const s = now.getSeconds().toString().padStart(2, "0")
            startTransition(() => setTime(`${h}:${m}:${s}`))

            const offset = -now.getTimezoneOffset() / 60
            const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`
            startTransition(() => setGmtOffset(`GMT${offsetStr}`))
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const city = timeZone.split("/").pop()?.replace(/_/g, " ") || "LOC"
        startTransition(() =>
            setLocationLabel(city.toUpperCase().substring(0, 3))
        )
    }, [])

    return (
        <div
            style={{
                ...style,
                display: "inline-flex",
                width: "fit-content",
                alignItems: verticalAlign,
                justifyContent: horizontalAlign,
                color: color,
                borderRadius,
                ...font,
                fontFamily: font?.fontFamily,
                fontSize: font?.fontSize,
                fontWeight: font?.fontWeight,
                fontStyle: font?.fontStyle,
                letterSpacing: font?.letterSpacing,
                textAlign: font?.textAlign,
                userSelect: "none",
                boxShadow: boxShadow,
                border: border,
                padding: padding,
                mixBlendMode: blendMode as any,
            }}
            aria-label="Local time clock"
        >
            <span style={{ marginRight: 8, fontSize: font?.fontSize }}>
                {time}
            </span>
            {showGMT && (
                <>
                    <span style={{ marginRight: 4, fontSize: font?.fontSize }}>
                        {gmtOffset}
                    </span>
                    <span style={{ fontSize: font?.fontSize }}>{locationLabel}</span>
                </>
            )}
        </div>
    )
}

addPropertyControls(LocalTextClock, {
    showGMT: {
        type: ControlType.Boolean,
        title: "Show GMT",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    horizontalAlign: {
        type: ControlType.Enum,
        title: "Horizontal",
        options: ["flex-start", "center", "flex-end"],
        optionTitles: ["Left", "Center", "Right"],
        defaultValue: "center",
        displaySegmentedControl: true,
    },
    verticalAlign: {
        type: ControlType.Enum,
        title: "Vertical",
        options: ["flex-start", "center", "flex-end"],
        optionTitles: ["Top", "Center", "Bottom"],
        defaultValue: "center",
        displaySegmentedControl: true,
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "32px",
            variant: "Regular",
            lineHeight: "1.2em",
            textAlign: "center",
        },
    },
    color: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: "#000000",
    },
    blendMode: {
        type: ControlType.Enum,
        title: "Blend Mode",
        options: [
            "normal",
            "multiply",
            "screen",
            "overlay",
            "darken",
            "lighten",
            "color-dodge",
            "color-burn",
            "hard-light",
            "soft-light",
            "difference",
            "exclusion",
            "hue",
            "saturation",
            "color",
            "luminosity",
        ],
        optionTitles: [
            "Normal",
            "Multiply",
            "Screen",
            "Overlay",
            "Darken",
            "Lighten",
            "Color Dodge",
            "Color Burn",
            "Hard Light",
            "Soft Light",
            "Difference",
            "Exclusion",
            "Hue",
            "Saturation",
            "Color",
            "Luminosity",
        ],
        defaultValue: "normal",
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Radius",
        defaultValue: 8,
        min: 0,
        max: 32,
    },
    boxShadow: {
        type: ControlType.BoxShadow,
        title: "Shadow",
        defaultValue: "none",
    },
    border: {
        type: ControlType.Border,
        title: "Border",
        defaultValue: {
            borderWidth: 0,
            borderStyle: "solid",
            borderColor: "#EEEEEE",
        },
        optional: true,
    },
    padding: {
        type: ControlType.Padding,
        title: "Padding",
        defaultValue: "0px",
    },
})
