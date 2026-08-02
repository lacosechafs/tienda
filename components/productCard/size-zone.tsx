import { useAppSelector } from "@/hooks/useRedux";
import { RootState } from "@/redux/makeStore";

interface Props {
    size: number;
    unit: string;
    price: number;
    show_discount: boolean;
    percentage_discount: number;
}

export const SizeZone = ({
    size,
    unit,
    price,
    show_discount,
    percentage_discount
}: Props) => {

    return (
        <div
            className={`me-3 flex`}
        >
            <p>
                {size + unit}
            </p>
            <p className="ms-1">
                x ${price.toLocaleString('es-ES', { useGrouping: 'always' })}
                {/* {show_discount &&
                    <span className="relative text-sm opacity-80 line-through">
                        &nbsp;${(price / (1 - (percentage_discount) / 100)).toLocaleString('es-ES', { useGrouping: 'always' })}&nbsp;
                        <span className="absolute text-sm bottom-full -right-2 opacity-80 translate-1/2">
                            {percentage_discount}%
                        </span>
                    </span>
                } */}
            </p>
        </div >

    )
}
