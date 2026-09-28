// User request: Create a visual-only Studio code component named `BodyScale` with no visible text, rendering two bottom-aligned comparison circles from a numeric value and configurable colors.
import { useMemo } from "react"
import { addPropertyControls, ControlType } from "studio"

interface MyComponentProps {
    value: number
    columns: number
    gapX: number
    gapY: number
    baseSize: number
    green: string
    neutral: string
}

/**
 * @studioSupportedLayoutWidth any-prefer-fixed
 * @studioSupportedLayoutHeight auto
 */
export default function BodyScale(props: MyComponentProps) {
    const { value, columns, gapX, gapY, baseSize, green, neutral } = props
    const safeValue = Number.isFinite(value) ? value : 0
    const safeColumns = useMemo(() => {
        const rounded = Math.round(Number.isFinite(columns) ? columns : 2)
        return Math.max(1, Math.min(6, rounded))
    }, [columns])
    const safeGapX = useMemo(() => {
        return Math.max(0, Number.isFinite(gapX) ? gapX : 18)
    }, [gapX])
    const safeGapY = useMemo(() => {
        return Math.max(0, Number.isFinite(gapY) ? gapY : 18)
    }, [gapY])
    const safeBaseSize = useMemo(() => {
        return Math.max(1, Number.isFinite(baseSize) ? baseSize : 64)
    }, [baseSize])

    const cmsDiameter = useMemo(() => {
        const clamped = Math.max(1, Math.min(10, safeValue))
        const minimumRatio = 0.15625
        return Math.max(safeBaseSize * minimumRatio, safeBaseSize * (clamped / 10))
    }, [safeValue, safeBaseSize])

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
                    gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))`,
                    alignItems: "end",
                    justifyItems: "start",
                    justifyContent: "start",
                    alignContent: "start",
                    columnGap: safeGapX,
                    rowGap: safeGapY,
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        width: safeBaseSize,
                        height: safeBaseSize,
                        borderRadius: 999,
                        backgroundColor: neutral,
                        justifySelf: "start",
                        boxSizing: "border-box",
                    }}
                />
                <div
                    style={{
                        width: cmsDiameter,
                        height: cmsDiameter,
                        borderRadius: 999,
                        backgroundColor: green,
                        justifySelf: "start",
                        boxSizing: "border-box",
                    }}
                />
            </div>
        </div>
    )
}

addPropertyControls(BodyScale, {
    baseSize: {
        type: ControlType.Number,
        title: "Base Size",
        defaultValue: 64,
        min: 10,
        max: 200,
        step: 1,
    },
    gapX: {
        type: ControlType.Number,
        title: "Gap X",
        defaultValue: 18,
        min: 0,
        max: 100,
        step: 1,
    },
    gapY: {
        type: ControlType.Number,
        title: "Gap Y",
        defaultValue: 18,
        min: 0,
        max: 100,
        step: 1,
    },
    columns: {
        type: ControlType.Number,
        title: "Columns",
        defaultValue: 2,
        min: 1,
        max: 6,
        step: 1,
    },
    value: {
        type: ControlType.Number,
        title: "Value",
        defaultValue: 4,
        min: 0,
        max: 10,
        step: 0.1,
    },
    green: {
        type: ControlType.Color,
        title: "Green",
        defaultValue: "rgb(0,207,62)",
    },
    neutral: {
        type: ControlType.Color,
        title: "Neutral",
        defaultValue: "rgb(204,204,204)",
    },
})