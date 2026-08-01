import { GridCompType } from '@/types/types'

export const GridComp = ({
    children,
    condition,
    extraClass,
    class1fr,
    class0fr,
    disableOpacity
}: GridCompType) => {

    const opacityClass = disableOpacity
        ? ''
        : condition ? 'opacity-100' : 'opacity-0'

    return (
        <div
            className={`${extraClass} transition-all duration-500 ease-in-out grid overflow-hidden ${condition
                ? `grid-rows-[1fr] starting:grid-rows-[0fr] z-10 ${class1fr}`
                : `grid-rows-[0fr] ${class0fr}`
                }
                ${opacityClass}
                `}
        >
            <div className="min-h-0">
                {children}
            </div>
        </div>
    )
}
