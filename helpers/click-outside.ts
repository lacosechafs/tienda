import { RefObject } from 'react'

export const clickOutside = (
    e: MouseEvent,
    refs: Array<RefObject<HTMLElement | null>>,
    status: (value: string) => void
) => {
    const target = e.target as Node;

    const isOutsideAll = refs.every(ref => ref.current && !ref.current.contains(target));

    if (isOutsideAll) {
        status('');
    }
}

export const removeCLickOut = (handler: (e: MouseEvent) => void) => {
    document.addEventListener('mousedown', handler)
    return () => {
        document.removeEventListener('mousedown', handler)
    }
}
