// User request: Create a new Studio code component file named HojichaRoastScale.tsx with display name “Hojicha Roast Scale”. It should be a compact, width-responsive six-step bottom-aligned bar scale matching the existing ChlorophyllScale component’s behavior and proportions, but using a hojicha roast palette from pale straw through amber, caramel, chestnut, dark brown, and deep roast. Expose controls for numeric level 1–6, inactive height, active height, gap, inactive radius, active radius, and all six colors. The active step is the nearest rounded/clamped level and is taller. Keep it visual-only with no text, transparent background, deterministic sizing, and safe handling of invalid values. Do not modify existing code files.
import { useMemo } from "react"
import { addPropertyControls, ControlType } from "studio"

interface MyComponentProps {
    level: number
    inactiveHeight: number
    activeHeight: number
    gap: number
    inactiveRadius: number
    activeRadius: number
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
export default function HojichaRoastScale(props: MyComponentProps) {
    const {
        level,
        inactiveHeight,
        activeHeight,
        gap,
        inactiveRadius,
        activeRadius,
        colorScale1,
        colorScale2,
        colorScale3,
        colorScale4,
        colorScale5,
        colorScale6,
    } = props

    const safeLevel = Number.isFinite(level) ? level : 1
    const safeInactiveHeight = Math.max(
        1,
        Number.isFinite(inactiveHeight) ? inactiveHeight : 14
    )
    const safeActiveHeight = Math.max(
        1,
        Number.isFinite(activeHeight) ? activeHeight : 34
    )
    const safeGap = Math.max(0, Number.isFinite(gap) ? gap : 5)
    const safeInactiveRadius = Math.max(
        0,
        Number.isFinite(inactiveRadius) ? inactiveRadius : 999
    )
    const safeActiveRadius = Math.max(
        0,
        Number.isFinite(activeRadius) ? activeRadius : 7
    )

    const bars = useMemo(() => {
        const roundedLevel = Math.round(safeLevel)
        const selectedIndex = Math.max(1, Math.min(6, roundedLevel)) - 1
        const colors = [
            colorScale1,
            colorScale2,
            colorScale3,
            colorScale4,
            colorScale5,
            colorScale6,
        ]

        return colors.map((color, index) => {
            const isSelected = index === selectedIndex
            return {
                color,
                height: isSelected ? safeActiveHeight : safeInactiveHeight,
                radius: isSelected ? safeActiveRadius : safeInactiveRadius,
            }
        })
    }, [
        safeLevel,
        safeInactiveHeight,
        safeActiveHeight,
        safeInactiveRadius,
        safeActiveRadius,
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
                backgroundColor: "transparent",
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
                        key={`hojicha-roast-bar-${index}`}
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

HojichaRoastScale.displayName = "Hojicha Roast Scale"

addPropertyControls(HojichaRoastScale, {
    level: {
        type: ControlType.Number,
        title: "Level",
        defaultValue: 3,
        min: 1,
        max: 6,
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
    colorScale1: {
        type: ControlType.Color,
        title: "Pale Straw",
        defaultValue: "rgb(240, 220, 170)",
    },
    colorScale2: {
        type: ControlType.Color,
        title: "Amber",
        defaultValue: "rgb(224, 176, 98)",
    },
    colorScale3: {
        type: ControlType.Color,
        title: "Caramel",
        defaultValue: "rgb(197, 136, 72)",
    },
    colorScale4: {
        type: ControlType.Color,
        title: "Chestnut",
        defaultValue: "rgb(154, 94, 53)",
    },
    colorScale5: {
        type: ControlType.Color,
        title: "Dark Brown",
        defaultValue: "rgb(104, 62, 37)",
    },
    colorScale6: {
        type: ControlType.Color,
        title: "Deep Roast",
        defaultValue: "rgb(61, 35, 24)",
    },
})