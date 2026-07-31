import { GridCompType } from '@/types/types'

export const GridComp = ({ children, condition, extraClass, class1fr, class0fr }: GridCompType) => {
    return (
        <div
            className={`${extraClass} transition-all duration-500 ease-in-out grid overflow-hidden ${condition
                ? `grid-rows-[1fr] starting:grid-rows-[0fr] opacity-100 z-10 ${class1fr}`
                : `grid-rows-[0fr] opacity-0 ${class0fr}`
                }`}
        >
            <div className="min-h-0">
                {children}
            </div>
        </div>
    )
}
