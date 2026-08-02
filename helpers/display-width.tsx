import { useEffect, useState } from 'react'

export const DisplayWidth = () => {

    const [windWidth, setWindWidth] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth
        }
        return 0
    })

    useEffect(() => {
        const changeWidth = () => {
            setWindWidth(window.innerWidth)
        }

        changeWidth()

        window.addEventListener('resize', changeWidth)

        return () => {
            window.removeEventListener('resize', changeWidth)
        }

    }, [])

    return windWidth
}
