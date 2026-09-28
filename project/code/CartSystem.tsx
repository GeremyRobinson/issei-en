import {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    startTransition,
    type CSSProperties,
    type ComponentType,
    type KeyboardEvent,
    type MouseEvent,
    type ReactNode,
} from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "studio"

/* Store */

export type CartItem = {
    productId: string
    title: string
    price: number
    size: string
    quantity: number
    image?: string
}

const SAMPLE_ITEMS: CartItem[] = [
    {
        productId: "sample",
        title: "Sample Tea",
        price: 18,
        size: "250g",
        quantity: 1,
    },
]

type CartKey = Pick<CartItem, "productId" | "size">

const STORAGE_KEY = "studio:minimal-cart:v1"
const listeners = new Set<(items: CartItem[]) => void>()

const sameLine = (a: CartKey, b: CartKey) =>
    a.productId === b.productId && a.size === b.size

function normalizeCart(value: unknown): CartItem[] {
    if (!Array.isArray(value)) return []
    return value
        .map((item) => ({
            productId: String(item?.productId ?? "").trim(),
            title: String(item?.title ?? "").trim(),
            price: Number(item?.price ?? 0),
            size: String(item?.size ?? "").trim(),
            quantity: Math.max(0, Math.floor(Number(item?.quantity ?? 0))),
        }))
        .filter(
            (item) =>
                item.productId &&
                item.title &&
                Number.isFinite(item.price) &&
                item.quantity > 0
        )
}

function readCart(): CartItem[] {
    if (typeof window === "undefined") return []
    try {
        return normalizeCart(
            JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]")
        )
    } catch {
        return []
    }
}

function writeCart(items: CartItem[]): void {
    if (typeof window === "undefined") return
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
        // Storage can be unavailable in private mode; the in-memory update still runs.
    }
}

function updateCart(recipe: (items: CartItem[]) => CartItem[]): void {
    const next = normalizeCart(recipe(readCart()))
    writeCart(next)
    for (const listener of listeners) listener(next)
}

export const cart = {
    read: readCart,
    add(item: Omit<CartItem, "quantity">, quantity = 1) {
        updateCart((items) =>
            items.some((x) => sameLine(x, item))
                ? items.map((x) =>
                      sameLine(x, item)
                          ? { ...x, quantity: x.quantity + quantity }
                          : x
                  )
                : [...items, { ...item, quantity }]
        )
    },
    change(key: CartKey, delta: number) {
        updateCart((items) =>
            items.map((x) =>
                sameLine(x, key) ? { ...x, quantity: x.quantity + delta } : x
            )
        )
    },
    remove(key: CartKey) {
        updateCart((items) => items.filter((x) => !sameLine(x, key)))
    },
    removeByProduct(productId: string) {
        updateCart((items) => items.filter((x) => x.productId !== productId))
    },
    changeByProduct(productId: string, delta: number) {
        updateCart((items) =>
            items.map((x) =>
                x.productId === productId ? { ...x, quantity: x.quantity + delta } : x
            )
        )
    },
    clear() {
        updateCart(() => [])
    },
}

export function useCart(): CartItem[] {
    const isStaticRenderer = useIsStaticRenderer()
    const [items, setItems] = useState<CartItem[]>([])

    useEffect(() => {
        if (isStaticRenderer) return
        const sync = (next: CartItem[]) => startTransition(() => setItems(next))
        const onStorage = (event: StorageEvent) => {
            if (event.key === STORAGE_KEY) sync(readCart())
        }
        sync(readCart())
        listeners.add(sync)
        window.addEventListener("storage", onStorage)
        return () => {
            listeners.delete(sync)
            window.removeEventListener("storage", onStorage)
        }
    }, [isStaticRenderer])

    return items
}

/* Shared styles */

/**
 * Matches the site's "Body" text style (Trainer Grotesk, the project's
 * primary typeface) and its auto light/dark ink color token, so components
 * read as part of the site instead of carrying their own look.
 */
const SITE_FONT = '"Trainer Grotesk", "Inter", sans-serif'
const INK_COLOR = "var(--token-b02124b3-4ff5-4cae-8e64-520884cca2e5)"

function textStyle(font?: CSSProperties, color?: string): CSSProperties {
    return {
        fontFamily: SITE_FONT,
        fontSize: 14,
        lineHeight: "1.2em",
        ...font,
        color: color ?? INK_COLOR,
    }
}

const BUTTON_RESET: CSSProperties = {
    appearance: "none",
    border: "none",
    padding: 0,
    margin: 0,
    background: "transparent",
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    fontWeight: "inherit",
    lineHeight: "inherit",
    letterSpacing: "inherit",
    cursor: "pointer",
}

function formatMoney(value: number, symbol: string, decimals: number) {
    const places = Math.max(0, Math.min(4, Math.round(decimals)))
    return `${symbol}${value.toFixed(places)}`
}

/* Primitives */

type Underline = "hoverOff" | "hoverOn" | "always" | "none"

interface LinkButtonProps {
    children: ReactNode
    onClick?: () => void
    underline?: Underline
    ariaLabel?: string
    ariaLive?: "polite" | "off"
    style?: CSSProperties
}

function LinkButton({
    children,
    onClick,
    underline = "hoverOff",
    ariaLabel,
    ariaLive,
    style,
}: LinkButtonProps) {
    const [hovered, setHovered] = useState(false)
    const underlined =
        underline === "always" ||
        (underline === "hoverOff" && !hovered) ||
        (underline === "hoverOn" && hovered)

    return (
        <button
            type="button"
            aria-label={ariaLabel}
            aria-live={ariaLive}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                ...BUTTON_RESET,
                textDecorationLine: underlined ? "underline" : "none",
                textDecorationThickness: "1px",
                textUnderlineOffset: "0.15em",
                ...style,
            }}
        >
            {children}
        </button>
    )
}

function Row({
    children,
    style,
}: {
    children: ReactNode
    style?: CSSProperties
}) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 8,
                ...style,
            }}
        >
            {children}
        </div>
    )
}

/* Shared controls */

const UNDERLINE_CONTROL = {
    type: ControlType.Enum as const,
    title: "Underline",
    options: ["hoverOff", "hoverOn", "always", "none"],
    optionTitles: ["Hover Off", "Hover On", "Always", "None"],
    defaultValue: "hoverOff",
}

const fontControl = (lineHeight: string) =>
    ({
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: { fontSize: 14, lineHeight },
    }) as const

const colorControl = (title = "Color") =>
    ({
        type: ControlType.Color,
        title,
        defaultValue: INK_COLOR,
        optional: true,
    }) as const

/* Add To Cart */

interface AddToCartProps {
    productId?: string
    title?: string
    price?: number
    size?: string
    image?: string
    buttonLabel?: string
    addedLabel?: string
    addedDuration?: number
    underline?: Underline
    font?: CSSProperties
    color?: string
    style?: CSSProperties
}

/**
 * @studioSupportedLayoutWidth any
 * @studioSupportedLayoutHeight auto
 */
export function AddToCart(props: AddToCartProps) {
    const {
        productId = "product-001",
        title = "Signature Tea",
        price = 18,
        size = "250g",
        image,
        buttonLabel = "Add To Cart",
        addedLabel = "Added",
        addedDuration = 1.2,
        underline = "hoverOff",
        font,
        color,
        style,
    } = props
    const [justAdded, setJustAdded] = useState(false)
    const timer = useRef<number | undefined>(undefined)

    useEffect(() => () => window.clearTimeout(timer.current), [])

    const onClick = useCallback(() => {
        const item = {
            productId: String(productId ?? "").trim(),
            title: String(title ?? "").trim(),
            price: Number(price),
            size: String(size ?? "").trim(),
            image: image || undefined,
        }
        if (!item.productId || !item.title || !Number.isFinite(item.price))
            return

        cart.add(item)
        startTransition(() => setJustAdded(true))
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(
            () => startTransition(() => setJustAdded(false)),
            Math.max(0, addedDuration) * 1000
        )
    }, [addedDuration, image, price, productId, size, title])

    const label = (justAdded ? addedLabel : buttonLabel).trim() || "Add To Cart"

    return (
        <LinkButton
            onClick={onClick}
            underline={underline}
            ariaLabel={label}
            ariaLive="polite"
            style={{
                ...style,
                ...textStyle(font, color),
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "flex-start",
                minWidth: "max-content",
            }}
        >
            {label}
        </LinkButton>
    )
}

addPropertyControls(AddToCart, {
    productId: {
        type: ControlType.String,
        title: "Product ID",
        defaultValue: "product-001",
    },
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Signature Tea",
    },
    price: {
        type: ControlType.Number,
        title: "Price",
        defaultValue: 18,
        min: 0,
        step: 0.5,
    },
    size: { type: ControlType.String, title: "Size", defaultValue: "250g" },
    image: { type: ControlType.Image, title: "Image" },
    buttonLabel: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "Add To Cart",
    },
    addedLabel: {
        type: ControlType.String,
        title: "Added",
        defaultValue: "Added",
    },
    addedDuration: {
        type: ControlType.Number,
        title: "Added For",
        defaultValue: 1.2,
        min: 0,
        max: 5,
        step: 0.1,
        unit: "s",
    },
    underline: UNDERLINE_CONTROL,
    font: fontControl("1.2em"),
    color: colorControl(),
})

/* Cart Item */

type QtyStyle = "box" | "link"

interface CartItemProps {
    productId?: string
    size?: string
    title?: string
    price?: number
    quantity?: number
    image?: string
    currency?: string
    decimals?: number
    removeLabel?: string
    qtyStyle?: QtyStyle
    underline?: Underline
    dividers?: boolean
    mutedOpacity?: number
    font?: CSSProperties
    color?: string
    style?: CSSProperties
}

/**
 * A single cart line: title, price, size, and quantity controls. Fully
 * self-contained and stylable on its own — `Cart` renders one of these per
 * line item, but it also stands on its own as a reusable, independently
 * insertable component with sensible defaults for previewing on canvas.
 *
 * @studioSupportedLayoutWidth any
 * @studioSupportedLayoutHeight auto
 */
export function CartItemRow(props: CartItemProps) {
    const {
        productId = "product-001",
        size = "250g",
        title = "Signature Tea",
        price = 18,
        quantity = 1,
        image,
        currency = "$",
        decimals = 2,
        removeLabel = "Remove",
        qtyStyle = "link",
        underline = "hoverOff",
        dividers = false,
        mutedOpacity = 0.75,
        font,
        color,
        style,
    } = props

    const key = useMemo(() => ({ productId, size }), [productId, size])
    const money = useCallback(
        (value: number) => formatMoney(value, currency, decimals),
        [currency, decimals]
    )

    const boxed = qtyStyle === "box"
    const qtyButtonStyle: CSSProperties = boxed
        ? { border: "1px solid currentColor", padding: "0 6px" }
        : {}
    const qtyUnderline: Underline = boxed ? "none" : underline

    return (
        <div
            style={{
                ...textStyle(font, color),
                ...(dividers ? { borderTop: "1px solid currentColor" } : undefined),
                ...style,
                display: "flex",
                gap: 12,
            }}
        >
            {image && (
                <img
                    src={image}
                    alt=""
                    style={{
                        width: 64,
                        height: 64,
                        objectFit: "cover",
                        flexShrink: 0,
                    }}
                />
            )}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    minWidth: 0,
                }}
            >
                <Row>
                    <span>{title}</span>
                    <LinkButton
                        ariaLabel={`Remove ${title}`}
                        onClick={() => cart.remove(key)}
                        underline={underline}
                    >
                        {removeLabel}
                    </LinkButton>
                </Row>
                {size && <div style={{ opacity: mutedOpacity }}>({size})</div>}
                <Row>
                    <span>{money(price * quantity)}</span>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <LinkButton
                            ariaLabel={`Decrease quantity of ${title}`}
                            onClick={() => cart.change(key, -1)}
                            underline={qtyUnderline}
                            style={qtyButtonStyle}
                        >
                            —
                        </LinkButton>
                        <span aria-live="polite">{quantity}</span>
                        <LinkButton
                            ariaLabel={`Increase quantity of ${title}`}
                            onClick={() => cart.change(key, 1)}
                            underline={qtyUnderline}
                            style={qtyButtonStyle}
                        >
                            +
                        </LinkButton>
                    </div>
                </Row>
            </div>
        </div>
    )
}

addPropertyControls(CartItemRow, {
    productId: {
        type: ControlType.String,
        title: "Product ID",
        defaultValue: "product-001",
    },
    size: { type: ControlType.String, title: "Size", defaultValue: "250g" },
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Signature Tea",
    },
    price: {
        type: ControlType.Number,
        title: "Price",
        defaultValue: 18,
        min: 0,
        step: 0.5,
    },
    quantity: {
        type: ControlType.Number,
        title: "Quantity",
        defaultValue: 1,
        min: 0,
        step: 1,
        displayStepper: true,
    },
    image: { type: ControlType.Image, title: "Image" },
    currency: {
        type: ControlType.String,
        title: "Currency",
        defaultValue: "$",
    },
    decimals: {
        type: ControlType.Number,
        title: "Decimals",
        defaultValue: 2,
        min: 0,
        max: 4,
        step: 1,
        displayStepper: true,
    },
    removeLabel: {
        type: ControlType.String,
        title: "Remove",
        defaultValue: "Remove",
    },
    qtyStyle: {
        type: ControlType.Enum,
        title: "Quantity",
        options: ["box", "link"],
        optionTitles: ["Box", "Link"],
        defaultValue: "link",
        displaySegmentedControl: true,
    },
    underline: UNDERLINE_CONTROL,
    dividers: {
        type: ControlType.Boolean,
        title: "Top Divider",
        defaultValue: false,
    },
    mutedOpacity: {
        type: ControlType.Number,
        title: "Size Opacity",
        defaultValue: 0.75,
        min: 0,
        max: 1,
        step: 0.05,
    },
    font: fontControl("1.2em"),
    color: colorControl(),
})

/* Cart */

interface CartProps {
    emptyMessage?: string
    currency?: string
    decimals?: number
    showSubtotal?: boolean
    subtotalLabel?: string
    removeLabel?: string
    qtyStyle?: QtyStyle
    underline?: Underline
    dividers?: boolean
    gap?: number
    mutedOpacity?: number
    font?: CSSProperties
    color?: string
    style?: CSSProperties
}

/**
 * @studioSupportedLayoutWidth any
 * @studioSupportedLayoutHeight any
 */
export function Cart(props: CartProps) {
    const {
        emptyMessage = "Your cart is empty.",
        currency = "$",
        decimals = 2,
        showSubtotal = true,
        subtotalLabel = "Subtotal",
        removeLabel = "Remove",
        qtyStyle = "box",
        underline = "hoverOff",
        dividers = true,
        gap = 8,
        mutedOpacity = 0.75,
        font,
        color,
        style,
    } = props
    const isStaticRenderer = useIsStaticRenderer()
    const items = useCart()
    const lines = isStaticRenderer ? SAMPLE_ITEMS : items

    const subtotal = useMemo(
        () => lines.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [lines]
    )
    const money = useCallback(
        (value: number) => formatMoney(value, currency, decimals),
        [currency, decimals]
    )

    const rootStyle: CSSProperties = {
        ...style,
        ...textStyle(font, color),
        position: "relative",
    }

    if (lines.length === 0) return <div style={rootStyle}>{emptyMessage}</div>

    return (
        <div
            style={{
                ...rootStyle,
                display: "flex",
                flexDirection: "column",
                gap,
            }}
        >
            {lines.map((item) => (
                <CartItemRow
                    key={`${item.productId}:${item.size}`}
                    productId={item.productId}
                    size={item.size}
                    title={item.title}
                    price={item.price}
                    quantity={item.quantity}
                    image={item.image}
                    currency={currency}
                    decimals={decimals}
                    removeLabel={removeLabel}
                    qtyStyle={qtyStyle}
                    underline={underline}
                    dividers={dividers}
                    mutedOpacity={mutedOpacity}
                    font={font}
                    color={color}
                    style={{ paddingTop: dividers ? gap : 0 }}
                />
            ))}
            {showSubtotal && (
                <Row style={dividers ? { borderTop: "1px solid currentColor", paddingTop: gap } : undefined}>
                    <span>{subtotalLabel}</span>
                    <span>{money(subtotal)}</span>
                </Row>
            )}
        </div>
    )
}

addPropertyControls(Cart, {
    emptyMessage: {
        type: ControlType.String,
        title: "Empty Message",
        defaultValue: "Your cart is empty.",
    },
    currency: {
        type: ControlType.String,
        title: "Currency",
        defaultValue: "$",
    },
    decimals: {
        type: ControlType.Number,
        title: "Decimals",
        defaultValue: 2,
        min: 0,
        max: 4,
        step: 1,
        displayStepper: true,
    },
    showSubtotal: {
        type: ControlType.Boolean,
        title: "Show Subtotal",
        defaultValue: true,
    },
    subtotalLabel: {
        type: ControlType.String,
        title: "Subtotal",
        defaultValue: "Subtotal",
    },
    removeLabel: {
        type: ControlType.String,
        title: "Remove",
        defaultValue: "Remove",
    },
    qtyStyle: {
        type: ControlType.Enum,
        title: "Quantity",
        options: ["box", "link"],
        optionTitles: ["Box", "Link"],
        defaultValue: "box",
        displaySegmentedControl: true,
    },
    underline: UNDERLINE_CONTROL,
    dividers: {
        type: ControlType.Boolean,
        title: "Dividers",
        defaultValue: true,
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 8,
        min: 0,
        max: 64,
        step: 1,
    },
    mutedOpacity: {
        type: ControlType.Number,
        title: "Size Opacity",
        defaultValue: 0.75,
        min: 0,
        max: 1,
        step: 0.05,
    },
    font: fontControl("1.2em"),
    color: colorControl(),
})

/* Live Values */

interface CartCountProps {
    font?: CSSProperties
    color?: string
    style?: CSSProperties
}

/**
 * The live number of items in the cart (summed quantity). Drop this in
 * anywhere a static count placeholder sits, e.g. inside "Cart (0)".
 *
 * @studioSupportedLayoutWidth auto
 * @studioSupportedLayoutHeight auto
 */
export function CartCount(props: CartCountProps) {
    const { font, color, style } = props
    const isStaticRenderer = useIsStaticRenderer()
    const items = useCart()
    const lines = isStaticRenderer ? SAMPLE_ITEMS : items
    const count = lines.reduce((sum, item) => sum + item.quantity, 0)

    return <span style={{ ...style, ...textStyle(font, color) }}>{count}</span>
}

addPropertyControls(CartCount, {
    font: fontControl("1.2em"),
    color: colorControl(),
})

interface CartSubtotalProps {
    currency?: string
    decimals?: number
    font?: CSSProperties
    color?: string
    style?: CSSProperties
}

/**
 * The live cart subtotal, formatted as money. Drop this in anywhere a
 * static "$0" placeholder sits.
 *
 * @studioSupportedLayoutWidth auto
 * @studioSupportedLayoutHeight auto
 */
export function CartSubtotal(props: CartSubtotalProps) {
    const { currency = "$", decimals = 2, font, color, style } = props
    const isStaticRenderer = useIsStaticRenderer()
    const items = useCart()
    const lines = isStaticRenderer ? SAMPLE_ITEMS : items
    const subtotal = useMemo(
        () => lines.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [lines]
    )

    return (
        <span style={{ ...style, ...textStyle(font, color) }}>
            {formatMoney(subtotal, currency, decimals)}
        </span>
    )
}

addPropertyControls(CartSubtotal, {
    currency: { type: ControlType.String, title: "Currency", defaultValue: "$" },
    decimals: {
        type: ControlType.Number,
        title: "Decimals",
        defaultValue: 2,
        min: 0,
        max: 4,
        step: 1,
        displayStepper: true,
    },
    font: fontControl("1.2em"),
    color: colorControl(),
})

interface CartItemQtyProps {
    productId?: string
    font?: CSSProperties
    color?: string
    style?: CSSProperties
}

/**
 * Live quantity for a single product, looked up by product ID. Drop this in
 * anywhere a static per-row quantity placeholder sits — e.g. the "0" in a
 * "— 0 +" qty stepper.
 *
 * @studioSupportedLayoutWidth auto
 * @studioSupportedLayoutHeight auto
 */
export function CartItemQty(props: CartItemQtyProps) {
    const { productId = "", font, color, style } = props
    const items = useCart()
    const quantity =
        items.find((item) => item.productId === productId)?.quantity ?? 0

    return <span style={{ ...style, ...textStyle(font, color) }}>{quantity}</span>
}

addPropertyControls(CartItemQty, {
    productId: { type: ControlType.String, title: "Product ID" },
    font: fontControl("1.2em"),
    color: colorControl(),
})

/* Overrides */

function scrollToIdOnClick(
    Component: ComponentType<any>,
    targetId: string
): ComponentType<any> {
    return forwardRef<HTMLElement, any>(function ScrollToId(props, ref) {
        const scroll = useCallback(() => {
            if (typeof document === "undefined") return
            document
                .getElementById(targetId)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, [])

        const handleClick = useCallback(
            (event: MouseEvent<HTMLElement>) => {
                event.preventDefault()
                props.onClick?.(event)
                scroll()
            },
            [props, scroll]
        )

        const handleKeyDown = useCallback(
            (event: KeyboardEvent<HTMLElement>) => {
                props.onKeyDown?.(event)
                if (event.defaultPrevented) return
                if (event.key !== "Enter" && event.key !== " ") return
                event.preventDefault()
                scroll()
            },
            [props, scroll]
        )

        return (
            <Component
                ref={ref}
                {...props}
                role={props.role ?? "button"}
                tabIndex={props.tabIndex ?? 0}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                style={{ ...props.style, cursor: "pointer" }}
            />
        )
    })
}

export function withCurrentPageCartScroll(
    Component: ComponentType<any>
): ComponentType<any> {
    return scrollToIdOnClick(Component, "cart")
}

/**
 * Checkout isn't built yet — this keeps the button inert (no navigation,
 * no submit) until a real checkout flow is wired up.
 */
export function withCheckoutPlaceholder(
    Component: ComponentType<any>
): ComponentType<any> {
    return forwardRef<HTMLElement, any>(function CheckoutPlaceholder(props, ref) {
        const handleClick = useCallback((event: MouseEvent<HTMLElement>) => {
            event.preventDefault()
        }, [])

        return <Component ref={ref} {...props} onClick={handleClick} />
    })
}

/**
 * Maps each Product's "ID" field value (what the cart stores) to its
 * Products collection item node id (what the "In Cart" reference variable
 * needs). Regenerate this if products are added, removed, or renumbered.
 */
const PRODUCT_NODE_ID_BY_ID: Record<string, string> = {
    "1": "RZivE851H", // 0100, SEI
    "2": "IAWK20SAC", // 0110, UJI
    "3": "rKvSdAxBv", // 0120, KYO
}

/**
 * Drives the "Cart (New)" component's live variables — `total`,
 * `totalCount`, and the `inCart` collection-reference filter that decides
 * which products the item list shows. Attach to a "Cart (New)" instance.
 */
export function withLiveCartTotals(
    Component: ComponentType<any>
): ComponentType<any> {
    return forwardRef<HTMLElement, any>(function LiveCartTotals(props, ref) {
        const items = useCart()
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
        // Newest-added first: cart.add() appends, so reverse for display.
        const inCart = items
            .slice()
            .reverse()
            .map((item) => PRODUCT_NODE_ID_BY_ID[item.productId])
            .filter((id): id is string => Boolean(id))

        return (
            <Component
                ref={ref}
                {...props}
                total={total}
                totalCount={totalCount}
                inCart={inCart}
            />
        )
    })
}

/**
 * Removes an item from the cart. Reads the `productID` / `size` values off
 * the wrapped "Remove" button instance (bound per-row to that product's
 * fields in the Cart (New) 2 item template) and clears that line.
 */
export function withRemoveFromCart(
    Component: ComponentType<any>
): ComponentType<any> {
    return forwardRef<HTMLElement, any>(function RemoveFromCart(props, ref) {
        const handleClick = useCallback(
            (event: MouseEvent<HTMLElement>) => {
                event.preventDefault()
                const productId = String(props.productID ?? "").trim()
                const size = String(props.size ?? "").trim()
                if (!productId) return
                // `size` isn't reliably bound on this instance yet — fall back
                // to removing every line for this product until it is.
                if (size) cart.remove({ productId, size })
                else cart.removeByProduct(productId)
            },
            [props.productID, props.size]
        )

        return <Component ref={ref} {...props} onClick={handleClick} />
    })
}

function changeQtyOnClick(
    Component: ComponentType<any>,
    delta: number
): ComponentType<any> {
    return forwardRef<HTMLElement, any>(function ChangeQty(props, ref) {
        const handleClick = useCallback(
            (event: MouseEvent<HTMLElement>) => {
                event.preventDefault()
                const productId = String(props.productID ?? "").trim()
                const size = String(props.size ?? "").trim()
                if (!productId) return
                // `size` isn't reliably bound on this instance yet — fall back
                // to changing every line for this product until it is.
                if (size) cart.change({ productId, size }, delta)
                else cart.changeByProduct(productId, delta)
            },
            [props.productID, props.size]
        )

        return <Component ref={ref} {...props} onClick={handleClick} />
    })
}

/** Attach to the "—" qty button, bound to a row's Product ID. */
export function withDecreaseQty(
    Component: ComponentType<any>
): ComponentType<any> {
    return changeQtyOnClick(Component, -1)
}

/** Attach to the "+" qty button, bound to a row's Product ID. */
export function withIncreaseQty(
    Component: ComponentType<any>
): ComponentType<any> {
    return changeQtyOnClick(Component, 1)
}
