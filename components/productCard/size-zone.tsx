import { useAppSelector } from "@/hooks/useRedux";
import { RootState } from "@/redux/makeStore";

interface Props {
    id: number;
    size: number;
    unit: string;
    haveStock: boolean;
    price: number;
}

export const SizeZone = ({
    id,
    size,
    unit,
    haveStock,
    price
}: Props) => {

    return (
        <div
            className={`me-3 flex`}
        >
            <p>
                {size + unit}
                <span className="ms-1 opacity-80">
                    (${price.toLocaleString('es-ES', { useGrouping: 'always' })})
                </span>
            </p>
        </div >

    )
}
