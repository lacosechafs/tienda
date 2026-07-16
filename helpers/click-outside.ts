import { RefObject } from 'react'

export const clickOutside = (e: MouseEvent, ref: RefObject<HTMLElement | null>, status: (value: boolean) => void) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
        status(false)
    }
}

export const removeCLickOut = (handler: (e: MouseEvent) => void) => {
    document.addEventListener('mousedown', handler)
    return () => {
        document.removeEventListener('mousedown', handler)
    }
}
