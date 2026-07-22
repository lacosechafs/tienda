
export const SelectorNumber = ({ digit, fontSize, delay }: { digit: number,fontSize: number, delay?: number }) => {

    const numbers = Array.from({ length: 10 }, (_, i) => i)

    return (
        <div className="flex flex-col duration-300"
            style={{ transform: `translateY(calc(-${(digit) * (fontSize + (fontSize / 2))}px))`, transitionDelay: `${delay}ms` }}
        >
            {numbers.map(num => {
                return (
                    <span className="" key={num}>{num}</span>
                )
            })}
        </div>
    )
}
