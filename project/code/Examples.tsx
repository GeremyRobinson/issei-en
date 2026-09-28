import { forwardRef, type ComponentType } from "react"
import { createStore } from "https://studio.com/m/studio/store.js@^1.0.0"
import { randomColor } from "https://studio.com/m/studio/utils.js@^0.9.0"

// Learn more: https://www.studio.com/developers/overrides/

const useStore = createStore({
    background: "#0099FF",
})

export function withRotate(Component): ComponentType {
    return forwardRef((props, ref) => {
        return (
            <Component
                ref={ref}
                {...props}
                animate={{ rotate: 90 }}
                transition={{ duration: 2 }}
            />
        )
    })
}

export function withHover(Component): ComponentType {
    return forwardRef((props, ref) => {
        return <Component ref={ref} {...props} whileHover={{ scale: 1.05 }} />
    })
}

export function withRandomColor(Component): ComponentType {
    return forwardRef((props, ref) => {
        const [store, setStore] = useStore()

        return (
            <Component
                ref={ref}
                {...props}
                animate={{
                    background: store.background,
                }}
                onClick={() => {
                    setStore({ background: randomColor() })
                }}
            />
        )
    })
}
