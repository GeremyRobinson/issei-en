// User request: Create a new Studio code component named `ProfileMetricChart` in a new file. It must be SSR-safe, responsive, self-contained with inline styles, use addPropertyControls, support modes (Umami, Body, Color), and match the provided compact visual contract.
import { addPropertyControls, ControlType } from "studio"
import { useMemo } from "react"

interface MyComponentProps {
    mode: "Umami" | "Body" | "Color"
    value: number
    textColor: string
    mutedColor: string
    green: string
    paleGreen: string
    neutral: string
    colorScale1: string
    colorScale2: string
    colorScale3: string
    colorScale4: string
    colorScale5: string
    colorScale6: string
}

function formatOneDecimal(value: number): string {
    if (!Number.isFinite(value)) return "0"
    const rounded = Math.round(value * 10) / 10
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

/**
 * @studioSupportedLayoutWidth any-prefer-fixed
 * @studioSupportedLayoutHeight auto
 */
export default function ProfileMetricChart(props: MyComponentProps) {
    const {
        mode,
        value,
        textColor,
        mutedColor,
        green,
        paleGreen,
        neutral,
        colorScale1,
        colorScale2,
        colorScale3,
        colorScale4,
        colorScale5,
        colorScale6,
    } = props

    const safeValue = Number.isFinite(value) ? value : 0
    const formattedValue = useMemo(() => formatOneDecimal(safeValue), [safeValue])

    const umamiDots = useMemo(() => {
        const filled = Math.max(0, Math.min(20, Math.round(safeValue / 0.1)))
        return Array.from({ length: 20 }, (_, index) => {
            const dotNumber = index + 1
            const isFilled = dotNumber <= filled
            const representsValue = dotNumber * 0.1
            const color = isFilled
                ? representsValue >= 1.9
                    ? paleGreen
                    : green
                : neutral
            return color
        })
    }, [safeValue, green, paleGreen, neutral])

    const bodyDiameters = useMemo(() => {
        const clampedForScale = Math.max(1, Math.min(10, safeValue))
        const cms = Math.max(10, 64 * (clampedForScale / 10))
        return {
            reference: 64,
            cms,
        }
    }, [safeValue])

    const colorMode = useMemo(() => {
        const scaleValues = [0.4, 0.6, 0.8, 1.0, 1.2, 1.4]
        const scaleColors = [
            colorScale1,
            colorScale2,
            colorScale3,
            colorScale4,
            colorScale5,
            colorScale6,
        ]

        let selectedIndex = 0
        let smallestDistance = Number.POSITIVE_INFINITY
        for (let i = 0; i < scaleValues.length; i++) {
            const distance = Math.abs(safeValue - scaleValues[i])
            if (distance < smallestDistance) {
                smallestDistance = distance
                selectedIndex = i
            }
        }

        return scaleColors.map((color, index) => ({
            color,
            height: index === selectedIndex ? 34 : 14,
        }))
    }, [
        safeValue,
        colorScale1,
        colorScale2,
        colorScale3,
        colorScale4,
        colorScale5,
        colorScale6,
    ])

    const headingText =
        mode === "Umami"
            ? `${formattedValue}% (L-theanine)`
            : mode === "Body"
              ? `${formattedValue} μm particle size`
              : `${formattedValue}% (Chlorophyll)`

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxSizing: "border-box",
                fontFamily: "inherit",
            }}
        >
            <div
                style={{
                    fontSize: 14,
                    lineHeight: 1.2,
                    fontWeight: 400,
                    color: textColor,
                    boxSizing: "border-box",
                }}
            >
                {headingText}
            </div>

            {mode === "Umami" && (
                <>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 5,
                            width: "100%",
                            maxWidth: 140,
                            boxSizing: "border-box",
                        }}
                    >
                        {umamiDots.map((dotColor, index) => (
                            <div
                                key={`dot-${index}`}
                                style={{
                                    width: 9,
                                    height: 9,
                                    borderRadius: 100,
                                    backgroundColor: dotColor,
                                    flex: "0 0 auto",
                                    boxSizing: "border-box",
                                }}
                            />
                        ))}
                    </div>
                    <div
                        style={{
                            fontSize: 12,
                            lineHeight: 1.35,
                            color: mutedColor,
                            boxSizing: "border-box",
                        }}
                    >
                        1 dot = 0.1%. Lighter dots are above ceremonial range.
                    </div>
                </>
            )}

            {mode === "Body" && (
                <>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 18,
                            boxSizing: "border-box",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 6,
                                boxSizing: "border-box",
                            }}
                        >
                            <div
                                style={{
                                    width: bodyDiameters.reference,
                                    height: bodyDiameters.reference,
                                    borderRadius: 999,
                                    backgroundColor: neutral,
                                    boxSizing: "border-box",
                                }}
                            />
                            <div
                                style={{
                                    fontSize: 12,
                                    lineHeight: 1.35,
                                    color: mutedColor,
                                    boxSizing: "border-box",
                                }}
                            >
                                10 μm
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 6,
                                boxSizing: "border-box",
                            }}
                        >
                            <div
                                style={{
                                    width: bodyDiameters.cms,
                                    height: bodyDiameters.cms,
                                    borderRadius: 999,
                                    backgroundColor: green,
                                    boxSizing: "border-box",
                                }}
                            />
                            <div
                                style={{
                                    fontSize: 12,
                                    lineHeight: 1.35,
                                    color: mutedColor,
                                    boxSizing: "border-box",
                                }}
                            >
                                {formattedValue} μm
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            fontSize: 12,
                            lineHeight: 1.35,
                            color: mutedColor,
                            boxSizing: "border-box",
                        }}
                    >
                        Drawn to scale against a standard grind.
                    </div>
                </>
            )}

            {mode === "Color" && (
                <>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 5,
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                    >
                        {colorMode.map((bar, index) => (
                            <div
                                key={`bar-${index}`}
                                style={{
                                    flex: 1,
                                    height: bar.height,
                                    borderRadius: 3,
                                    backgroundColor: bar.color,
                                    boxSizing: "border-box",
                                }}
                            />
                        ))}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12,
                            lineHeight: 1.35,
                            color: mutedColor,
                            boxSizing: "border-box",
                        }}
                    >
                        <span style={{ boxSizing: "border-box" }}>0.4%</span>
                        <span style={{ boxSizing: "border-box" }}>1.4%</span>
                    </div>
                </>
            )}
        </div>
    )
}

addPropertyControls(ProfileMetricChart, {
    mode: {
        type: ControlType.Enum,
        title: "Mode",
        defaultValue: "Umami",
        options: ["Umami", "Body", "Color"],
        optionTitles: ["Umami", "Body", "Color"],
        displaySegmentedControl: true,
        segmentedControlDirection: "horizontal",
    },
    value: {
        type: ControlType.Number,
        title: "Value",
        defaultValue: 2.2,
        min: 0,
        max: 20,
        step: 0.1,
    },
    textColor: {
        type: ControlType.Color,
        title: "Text",
        defaultValue: "rgb(0,0,0)",
    },
    mutedColor: {
        type: ControlType.Color,
        title: "Muted",
        defaultValue: "rgb(119,119,119)",
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
    colorScale1: {
        type: ControlType.Color,
        title: "Scale 1",
        defaultValue: "rgb(205,226,166)",
    },
    colorScale2: {
        type: ControlType.Color,
        title: "Scale 2",
        defaultValue: "rgb(168,207,105)",
    },
    colorScale3: {
        type: ControlType.Color,
        title: "Scale 3",
        defaultValue: "rgb(125,188,68)",
    },
    colorScale4: {
        type: ControlType.Color,
        title: "Scale 4",
        defaultValue: "rgb(49,143,42)",
    },
    colorScale5: {
        type: ControlType.Color,
        title: "Scale 5",
        defaultValue: "rgb(42,128,34)",
    },
    colorScale6: {
        type: ControlType.Color,
        title: "Scale 6",
        defaultValue: "rgb(20,100,31)",
    },
})