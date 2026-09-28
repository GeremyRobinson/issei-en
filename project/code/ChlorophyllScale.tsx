// User request: Revert `ChlorophyllScale.tsx` to a simpler stepped-rectangle implementation with six bars and closest-value selection.
import { useMemo } from "react"
import { addPropertyControls, ControlType } from "studio"

interface MyComponentProps {
    value: number
    inactiveRadius: number
    activeRadius: number
    inactiveHeight: number
    activeHeight: number
    gap: number
    colorScale1: string
    colorScale2: string
    colorScale3: string
    colorScale4: string
    colorScale5: string
    colorScale6: string
}

/**
 * @studioSupportedLayoutWidth any-prefer-fixed
 * @studioSupportedLayoutHeight auto
 */
export default function ChlorophyllScale(props: MyComponentProps) {
    const {
        value,
        inactiveRadius,
        activeRadius,
        inactiveHeight,
        activeHeight,
        gap,
        colorScale1,
        colorScale2,
        colorScale3,
        colorScale4,
        colorScale5,
        colorScale6,
    } = props

    const safeValue = Number.isFinite(value) ? value : 0.4
    const safeInactiveRadius = Math.max(
        0,
        Number.isFinite(inactiveRadius) ? inactiveRadius : 999
    )
    const safeActiveRadius = Math.max(
        0,
        Number.isFinite(activeRadius) ? activeRadius : 7
    )
    const safeInactiveHeight = Math.max(
        1,
        Number.isFinite(inactiveHeight) ? inactiveHeight : 14
    )
    const safeActiveHeight = Math.max(
        1,
        Number.isFinite(activeHeight) ? activeHeight : 34
    )
    const safeGap = Math.max(0, Number.isFinite(gap) ? gap : 5)

    const bars = useMemo(() => {
        const scaleValues = [0.4, 0.6, 0.8, 1.0, 1.2, 1.4]
        const colors = [
            colorScale1,
            colorScale2,
            colorScale3,
            colorScale4,
            colorScale5,
            colorScale6,
        ]

        let selectedIndex = 0
        let minDistance = Number.POSITIVE_INFINITY
        for (let i = 0; i < scaleValues.length; i++) {
            const distance = Math.abs(safeValue - scaleValues[i])
            if (distance < minDistance) {
                minDistance = distance
                selectedIndex = i
            }
        }

        return colors.map((color, index) => {
            const isSelected = index === selectedIndex
            return {
                color,
                isSelected,
                height: isSelected ? safeActiveHeight : safeInactiveHeight,
                radius: isSelected ? safeActiveRadius : safeInactiveRadius,
            }
        })
    }, [
        safeValue,
        safeInactiveRadius,
        safeActiveRadius,
        safeInactiveHeight,
        safeActiveHeight,
        colorScale1,
        colorScale2,
        colorScale3,
        colorScale4,
        colorScale5,
        colorScale6,
    ])

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
                    display: "flex",
                    alignItems: "flex-end",
                    gap: safeGap,
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                {bars.map((bar, index) => (
                    <div
                        key={`chlorophyll-bar-${index}`}
                        style={{
                            flex: 1,
                            height: bar.height,
                            borderRadius: bar.radius,
                            backgroundColor: bar.color,
                            boxSizing: "border-box",
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

addPropertyControls(ChlorophyllScale, {
    value: {
        type: ControlType.Number,
        title: "Value",
        defaultValue: 1.2,
        min: 0.4,
        max: 1.4,
        step: 0.1,
    },
    inactiveRadius: {
        type: ControlType.Number,
        title: "Radius",
        defaultValue: 999,
        min: 0,
        max: 999,
        step: 1,
    },
    activeRadius: {
        type: ControlType.Number,
        title: "Active Radius",
        defaultValue: 7,
        min: 0,
        max: 999,
        step: 1,
    },
    inactiveHeight: {
        type: ControlType.Number,
        title: "Height",
        defaultValue: 14,
        min: 1,
        max: 200,
        step: 1,
    },
    activeHeight: {
        type: ControlType.Number,
        title: "Active Height",
        defaultValue: 34,
        min: 1,
        max: 200,
        step: 1,
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 5,
        min: 0,
        max: 60,
        step: 1,
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