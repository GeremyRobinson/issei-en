// User request: Create a visual-only Studio code component named `UmamiDots` with no visible text, rendering 20 responsive dots from a numeric value and configurable colors.
import { useMemo } from "react"
import { addPropertyControls, ControlType } from "studio"

interface MyComponentProps {
    value: number
    green: string
    paleGreen: string
    neutral: string
}

/**
 * @studioSupportedLayoutWidth any-prefer-fixed
 * @studioSupportedLayoutHeight auto
 */
export default function UmamiDots(props: MyComponentProps) {
    const { value, green, paleGreen, neutral } = props
    const safeValue = Number.isFinite(value) ? value : 0

    const dotColors = useMemo(() => {
        const filledCount = Math.max(0, Math.min(20, Math.round(safeValue / 0.1)))
        return Array.from({ length: 20 }, (_, index) => {
            const dotNumber = index + 1
            if (dotNumber > filledCount) return neutral
            return dotNumber <= 18 ? green : paleGreen
        })
    }, [safeValue, green, paleGreen, neutral])

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(10, minmax(0, 1fr))",
                    gap: 5,
                    width: "100%",
                    maxWidth: 135,
                    boxSizing: "border-box",
                }}
            >
                {dotColors.map((dotColor, index) => (
                    <div
                        key={`umami-dot-${index}`}
                        style={{
                            width: 9,
                            height: 9,
                            borderRadius: 999,
                            backgroundColor: dotColor,
                            justifySelf: "start",
                            boxSizing: "border-box",
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

addPropertyControls(UmamiDots, {
    value: {
        type: ControlType.Number,
        title: "Value",
        defaultValue: 2.2,
        min: 0,
        max: 2,
        step: 0.1,
    },
    green: {
        type: ControlType.Color,
        title: "Green",
        defaultValue: "rgb(0,207,62)",
    },
    paleGreen: {
        type: ControlType.Color,
        title: "Pale Green",
        defaultValue: "rgb(170,255,0)",
    },
    neutral: {
        type: ControlType.Color,
        title: "Neutral",
        defaultValue: "rgb(204,204,204)",
    },
})