// User request: Create a new Studio code component named "SweetnessBar" that renders a pill-shaped segmented ratio bar from a CMS-style ratio string (e.g. "1:3"), with defensive parsing and configurable property controls for ratio, colors, segment height, gap, and padding.
import { useMemo } from "react"
import { addPropertyControls, ControlType } from "studio"

interface MyComponentProps {
    ratio: string
    trackColor: string
    aminoColor: string
    catechinColor: string
    segmentHeight: number
    gap: number
    padding: number
    trackRadius: number
    segmentRadius: number
}

function sanitizeParts(value: string): number {
    const parsed = Number.parseInt(value.trim(), 10)
    if (!Number.isFinite(parsed) || Number.isNaN(parsed)) return 0
    return Math.max(0, Math.floor(parsed))
}

/**
 * @studioSupportedLayoutWidth any-prefer-fixed
 * @studioSupportedLayoutHeight auto
 */
export default function SweetnessBar(props: MyComponentProps) {
    const {
        ratio,
        trackColor,
        aminoColor,
        catechinColor,
        segmentHeight,
        gap,
        padding,
        trackRadius,
        segmentRadius,
    } = props
    const safeTrackRadius = Math.max(
        0,
        Number.isFinite(trackRadius) ? trackRadius : 100
    )
    const safeSegmentRadius = Math.max(
        0,
        Number.isFinite(segmentRadius) ? segmentRadius : 100
    )

    const segmentColors = useMemo(() => {
        const normalized = (ratio ?? "").trim()
        if (!normalized.includes(":")) return []

        const [aminoRaw = "", catechinRaw = ""] = normalized.split(":")
        const aminoParts = sanitizeParts(aminoRaw)
        const catechinParts = sanitizeParts(catechinRaw)
        const total = aminoParts + catechinParts

        if (total <= 0) return []

        return Array.from({ length: total }, (_, index) =>
            index < aminoParts ? aminoColor : catechinColor
        )
    }, [ratio, aminoColor, catechinColor])

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
                    width: "100%",
                    backgroundColor: trackColor,
                    borderRadius: safeTrackRadius,
                    padding,
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap,
                        width: "100%",
                        minHeight: segmentHeight,
                    }}
                >
                    {segmentColors.map((color, index) => (
                        <div
                            key={`${color}-${index}`}
                            style={{
                                flex: 1,
                                height: segmentHeight,
                                borderRadius: safeSegmentRadius,
                                backgroundColor: color,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

addPropertyControls(SweetnessBar, {
    ratio: {
        type: ControlType.String,
        title: "Ratio",
        defaultValue: "1:3",
    },
    trackColor: {
        type: ControlType.Color,
        title: "Track",
        defaultValue: "rgb(238, 238, 238)",
    },
    aminoColor: {
        type: ControlType.Color,
        title: "Amino",
        defaultValue: "rgb(170, 255, 0)",
    },
    catechinColor: {
        type: ControlType.Color,
        title: "Catechin",
        defaultValue: "rgb(0, 207, 62)",
    },
    segmentHeight: {
        type: ControlType.Number,
        title: "Seg H",
        defaultValue: 8.5,
        min: 0,
        step: 0.5,
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 5,
        min: 0,
        step: 0.5,
    },
    padding: {
        type: ControlType.Number,
        title: "Padding",
        defaultValue: 5,
        min: 0,
        step: 0.5,
    },
    trackRadius: {
        type: ControlType.Number,
        title: "Track Radius",
        defaultValue: 100,
        min: 0,
        max: 999,
        step: 1,
    },
    segmentRadius: {
        type: ControlType.Number,
        title: "Segment Radius",
        defaultValue: 100,
        min: 0,
        max: 999,
        step: 1,
    },
})