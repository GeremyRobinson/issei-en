// User request: Create a new Studio code component named CaffeineRetentionBar in CaffeineRetentionBar.tsx. It should be a compact, width-responsive horizontal progress bar for hojicha caffeine retention. Expose controls for retained percentage 0–100, height, radius, fill color, and track color. Use a dark roasted-brown fill over a pale warm-neutral track. Clamp invalid values safely, keep the background transparent, and include no text because labels will remain canvas-native. Match the clean minimal visual style of HojichaRoastScale and existing project chart components. Do not modify existing files.
import { useMemo } from "react"
import { addPropertyControls, ControlType } from "studio"

interface MyComponentProps {
    retainedPercentage: number
    height: number
    radius: number
    fillColor: string
    trackColor: string
}

/**
 * @studioSupportedLayoutWidth any-prefer-fixed
 * @studioSupportedLayoutHeight auto
 */
export default function CaffeineRetentionBar(props: MyComponentProps) {
    const { retainedPercentage, height, radius, fillColor, trackColor } = props

    const safePercentage = Number.isFinite(retainedPercentage)
        ? Math.max(0, Math.min(100, retainedPercentage))
        : 0
    const safeHeight = Math.max(1, Number.isFinite(height) ? height : 10)
    const safeRadius = Math.max(0, Number.isFinite(radius) ? radius : 999)

    const fillWidth = useMemo(() => `${safePercentage}%`, [safePercentage])

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
                    width: "100%",
                    height: safeHeight,
                    borderRadius: safeRadius,
                    backgroundColor: trackColor,
                    overflow: "hidden",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        width: fillWidth,
                        height: "100%",
                        borderRadius: safeRadius,
                        backgroundColor: fillColor,
                        boxSizing: "border-box",
                    }}
                />
            </div>
        </div>
    )
}

CaffeineRetentionBar.displayName = "Caffeine Retention Bar"

addPropertyControls(CaffeineRetentionBar, {
    retainedPercentage: {
        type: ControlType.Number,
        title: "Retained %",
        defaultValue: 38,
        min: 0,
        max: 100,
        step: 1,
    },
    height: {
        type: ControlType.Number,
        title: "Height",
        defaultValue: 10,
        min: 1,
        max: 120,
        step: 1,
    },
    radius: {
        type: ControlType.Number,
        title: "Radius",
        defaultValue: 999,
        min: 0,
        max: 999,
        step: 1,
    },
    fillColor: {
        type: ControlType.Color,
        title: "Fill",
        defaultValue: "rgb(82, 48, 34)",
    },
    trackColor: {
        type: ControlType.Color,
        title: "Track",
        defaultValue: "rgb(238, 225, 205)",
    },
})