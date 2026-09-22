import { useEffect, useState } from "react";
import { PriceAnimate } from "../price-animation";
import { dataCatalog } from "@/types/types";

interface Props {
    obj: dataCatalog
    show_discount: boolean;
    percentage_discount: number;
    openAddOptions: boolean;
}

export const SizeZone = ({
    obj,
    show_discount,
    percentage_discount,
    openAddOptions
}: Props) => {

    const [priceToShow, setPriceToShow] = useState<number>(obj.normal_price)
    const [firstLoad, setFirstLoad] = useState<boolean>(false)

    useEffect(() => {
        if (firstLoad) return
        if ((show_discount && percentage_discount > 0 && openAddOptions)) {
            const timer = setTimeout(() => {
                setPriceToShow(obj.public_price)
                setFirstLoad(true)
            }, 1300);
            return () => clearTimeout(timer)
        } else {
            setPriceToShow(obj.normal_price)
        }
    }, [openAddOptions])


    return (
        <div
            className={`me-3 flex`}
        >
            <p>
                {obj.size + obj.unit}
            </p>
            <div className="flex">
                <span className="mx-1">x</span>
                <div className={`flex duration-300 currentColor`}>
                    <PriceAnimate cartProducts={[obj]} fontSize={16} priceToShow={priceToShow} delay={0} />
                    {show_discount && percentage_discount > 0 &&
                        <sup className={`text-sm ms-1 text-red-800 ${firstLoad ? "opacity-100 starting:opacity-0" : "opacity-0"} duration-500`}>
                            -{percentage_discount}%
                        </sup>
                    }

                </div>
            </div>
        </div >

    )
}
