import {
    forwardRef,
    type ComponentType,
    type MutableRefObject,
    useCallback,
    useEffect,
    useRef,
} from "react"

/**
 * Overrides run in Preview/published output, not on the Studio design canvas.
 */

// Opacity for non-hovered items while one item is hovered.
const DIMMED_OPACITY = 0.25
// Opacity transition duration in seconds.
const OPACITY_TRANSITION_DURATION_SECONDS = 0.2
// Opacity transition delay in seconds.
const OPACITY_TRANSITION_DELAY_SECONDS = 0
// Opacity transition easing curve.
const OPACITY_TRANSITION_EASING = "ease-in-out"
// Tolerance for overlap checks when resolving internal grid gaps.
const GAP_OVERLAP_TOLERANCE_PX = 1

const ITEM_ATTRIBUTE = "data-hover-dim-item"
const ITEM_SELECTOR = `[${ITEM_ATTRIBUTE}]`

type InlineSnapshot = {
    opacity: string
    transition: string
}

function applyForwardedRef(ref: any, value: unknown): void {
    if (typeof ref === "function") {
        ref(value)
        return
    }
    if (ref && typeof ref === "object") {
        ;(ref as MutableRefObject<unknown>).current = value
    }
}

function findMarkedItemWithin(
    container: HTMLElement,
    target: EventTarget | null
): HTMLElement | null {
    if (!(target instanceof Element)) return null
    const candidate = target.closest(ITEM_SELECTOR)
    if (!(candidate instanceof HTMLElement)) return null
    if (!container.contains(candidate)) return null
    return candidate
}

function buildOpacityTransition(existingTransition: string): string {
    const transitionPiece = `opacity ${OPACITY_TRANSITION_DURATION_SECONDS}s ${OPACITY_TRANSITION_EASING} ${OPACITY_TRANSITION_DELAY_SECONDS}s`
    if (!existingTransition || existingTransition.trim().length === 0) {
        return transitionPiece
    }
    const hasOpacityTransition = /\bopacity\b/.test(existingTransition)
    if (hasOpacityTransition) return existingTransition
    return `${existingTransition}, ${transitionPiece}`
}

type RectItem = {
    element: HTMLElement
    rect: DOMRect
}

function isWithinRange(value: number, min: number, max: number, tolerance = 0): boolean {
    return value >= min - tolerance && value <= max + tolerance
}

function resolveInternalGapOwner(
    pointX: number,
    pointY: number,
    rectItems: RectItem[]
): HTMLElement | null {
    let bestMatch: { owner: HTMLElement; distance: number } | null = null

    for (let i = 0; i < rectItems.length; i += 1) {
        for (let j = i + 1; j < rectItems.length; j += 1) {
            const first = rectItems[i]
            const second = rectItems[j]

            const horizontalLeft =
                first.rect.right <= second.rect.left ? first : second.rect.right <= first.rect.left ? second : null
            const horizontalRight =
                horizontalLeft === first ? second : horizontalLeft === second ? first : null

            if (horizontalLeft && horizontalRight) {
                const yOverlapsBoth =
                    isWithinRange(
                        pointY,
                        horizontalLeft.rect.top,
                        horizontalLeft.rect.bottom,
                        GAP_OVERLAP_TOLERANCE_PX
                    ) &&
                    isWithinRange(
                        pointY,
                        horizontalRight.rect.top,
                        horizontalRight.rect.bottom,
                        GAP_OVERLAP_TOLERANCE_PX
                    )

                const inHorizontalGap =
                    pointX > horizontalLeft.rect.right &&
                    pointX < horizontalRight.rect.left

                if (yOverlapsBoth && inHorizontalGap) {
                    const distanceToLeftEdge = pointX - horizontalLeft.rect.right
                    const distanceToRightEdge = horizontalRight.rect.left - pointX
                    const owner =
                        distanceToLeftEdge <= distanceToRightEdge
                            ? horizontalLeft.element
                            : horizontalRight.element
                    const distance = Math.min(
                        distanceToLeftEdge,
                        distanceToRightEdge
                    )

                    if (!bestMatch || distance < bestMatch.distance) {
                        bestMatch = { owner, distance }
                    }
                }
            }

            const verticalUpper =
                first.rect.bottom <= second.rect.top ? first : second.rect.bottom <= first.rect.top ? second : null
            const verticalLower =
                verticalUpper === first ? second : verticalUpper === second ? first : null

            if (verticalUpper && verticalLower) {
                const xOverlapsBoth =
                    isWithinRange(
                        pointX,
                        verticalUpper.rect.left,
                        verticalUpper.rect.right,
                        GAP_OVERLAP_TOLERANCE_PX
                    ) &&
                    isWithinRange(
                        pointX,
                        verticalLower.rect.left,
                        verticalLower.rect.right,
                        GAP_OVERLAP_TOLERANCE_PX
                    )

                const inVerticalGap =
                    pointY > verticalUpper.rect.bottom &&
                    pointY < verticalLower.rect.top

                if (xOverlapsBoth && inVerticalGap) {
                    const distanceToUpperEdge = pointY - verticalUpper.rect.bottom
                    const distanceToLowerEdge = verticalLower.rect.top - pointY
                    const owner =
                        distanceToUpperEdge <= distanceToLowerEdge
                            ? verticalUpper.element
                            : verticalLower.element
                    const distance = Math.min(
                        distanceToUpperEdge,
                        distanceToLowerEdge
                    )

                    if (!bestMatch || distance < bestMatch.distance) {
                        bestMatch = { owner, distance }
                    }
                }
            }
        }
    }

    return bestMatch ? bestMatch.owner : null
}

export function markHoverDimItem(Component): ComponentType {
    return forwardRef(function MarkHoverDimItem(props: any, ref) {
        const localRef = useRef<unknown>(null)

        const setRefs = useCallback(
            (node: unknown) => {
                localRef.current = node
                applyForwardedRef(ref, node)
            },
            [ref]
        )

        useEffect(() => {
            const node = localRef.current
            if (!(node instanceof HTMLElement)) return

            node.setAttribute(ITEM_ATTRIBUTE, "")

            return () => {
                node.removeAttribute(ITEM_ATTRIBUTE)
            }
        }, [])

        return <Component ref={setRefs} {...props} />
    })
}

export function withItemHoverDim(Component): ComponentType {
    return forwardRef(function WithItemHoverDim(props: any, ref) {
        const localRef = useRef<unknown>(null)

        const setRefs = useCallback(
            (node: unknown) => {
                localRef.current = node
                applyForwardedRef(ref, node)
            },
            [ref]
        )

        useEffect(() => {
            const node = localRef.current
            if (!(node instanceof HTMLElement)) return

            const container = node
            const snapshots = new Map<HTMLElement, InlineSnapshot>()
            let activeItem: HTMLElement | null = null

            const registerItem = (item: HTMLElement) => {
                if (snapshots.has(item)) return
                snapshots.set(item, {
                    opacity: item.style.opacity,
                    transition: item.style.transition,
                })
                item.style.transition = buildOpacityTransition(
                    item.style.transition
                )
                if (!activeItem) item.style.opacity = "1"
            }

            const getItems = (): HTMLElement[] => {
                return Array.from(
                    container.querySelectorAll(ITEM_SELECTOR)
                ).filter(
                    (element): element is HTMLElement =>
                        element instanceof HTMLElement
                )
            }

            const syncItems = () => {
                const items = getItems()
                for (const item of items) registerItem(item)
                for (const item of Array.from(snapshots.keys())) {
                    if (
                        !container.contains(item) ||
                        !item.matches(ITEM_SELECTOR)
                    ) {
                        const previous = snapshots.get(item)
                        if (previous) {
                            item.style.opacity = previous.opacity
                            item.style.transition = previous.transition
                        }
                        snapshots.delete(item)
                        if (activeItem === item) activeItem = null
                    }
                }
                return items
            }

            const restoreAllVisible = () => {
                const items = syncItems()
                for (const item of items) {
                    item.style.opacity = "1"
                }
                activeItem = null
            }

            const activateItem = (hoveredItem: HTMLElement) => {
                const items = syncItems()
                activeItem = hoveredItem
                for (const item of items) {
                    item.style.opacity =
                        item === hoveredItem ? "1" : String(DIMMED_OPACITY)
                }
            }

            syncItems()
            restoreAllVisible()

            const onPointerMove = (event: PointerEvent) => {
                const hoveredItem = findMarkedItemWithin(container, event.target)
                if (hoveredItem) {
                    if (activeItem !== hoveredItem) activateItem(hoveredItem)
                    return
                }

                const items = syncItems()
                const rectItems: RectItem[] = items.map((item) => ({
                    element: item,
                    rect: item.getBoundingClientRect(),
                }))
                const gapOwner = resolveInternalGapOwner(
                    event.clientX,
                    event.clientY,
                    rectItems
                )

                if (gapOwner) {
                    if (activeItem !== gapOwner) activateItem(gapOwner)
                    return
                }

                if (activeItem) restoreAllVisible()
            }

            const onPointerLeave = () => {
                restoreAllVisible()
            }

            container.addEventListener("pointermove", onPointerMove)
            container.addEventListener("pointerleave", onPointerLeave)

            const observer = new MutationObserver(() => {
                syncItems()
                if (activeItem && container.contains(activeItem)) {
                    activateItem(activeItem)
                } else {
                    restoreAllVisible()
                }
            })

            observer.observe(container, { childList: true, subtree: true })

            return () => {
                observer.disconnect()
                container.removeEventListener("pointermove", onPointerMove)
                container.removeEventListener("pointerleave", onPointerLeave)

                for (const [item, previous] of snapshots.entries()) {
                    item.style.opacity = previous.opacity
                    item.style.transition = previous.transition
                }
                snapshots.clear()
            }
        }, [])

        return <Component ref={setRefs} {...props} />
    })
}
