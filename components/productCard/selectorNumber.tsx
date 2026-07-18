
export const SelectorNumber = ({ digit, delay }: { digit: number, delay?: number }) => {

    const numbers = Array.from({ length: 10 }, (_, i) => i)

    return (
        <div className="flex flex-col duration-300"
            style={{ transform: `translateY(-${(digit) * 24}px)`, transitionDelay: `${delay}ms` }}
        >
            {numbers.map(num => {
                return (
                    <span className="w-[9px]" key={num}>{num}</span>
                )
            })}
        </div>
    )
}
