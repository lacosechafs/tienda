import { useEffect, useState } from "react";
import { PriceAnimate } from "../price-animation";
import { dataCatalog } from "@/types/types";
import { DisplayWidth } from "@/helpers/display-width";

interface Props {
    obj: dataCatalog
    selected: boolean;
    show_discount: boolean;
    percentage_discount: number;
    openAddOptions: boolean;
}

export const SizeZone = ({
    obj,
    selected,
    show_discount,
    percentage_discount,
    openAddOptions
}: Props) => {

    const [priceToShow, setPriceToShow] = useState<number>(0)
    const [firstLoad, setFirstLoad] = useState<boolean>(false)

    const displayWidth = DisplayWidth()

    if (obj.id === 2) {
        console.log(selected && (show_discount && percentage_discount > 0) && openAddOptions)
    }

    useEffect(() => {
        if (firstLoad) return
        if (selected && (show_discount && percentage_discount > 0 && (displayWidth < 768 ? openAddOptions : true))) {
            const timer = setTimeout(() => {
                setPriceToShow(obj.public_price)
                setFirstLoad(true)
            }, 800);
            return () => clearTimeout(timer)
        } else {
            setPriceToShow(obj.normal_price)
        }


    }, [selected, openAddOptions])


    return (
        <div
            className={`me-3 flex`}
        >
            <p>
                {obj.size + obj.unit}
            </p>
            <div className="flex">
                <span className="mx-1">x</span>
                <div className={`flex duration-300 ${priceToShow !== obj.normal_price ? "text-red-300" : "currentColor"}`}>
                    <PriceAnimate cartProducts={[obj]} fontSize={16} priceToShow={priceToShow} delay={0} />
                    {show_discount && percentage_discount > 0 &&
                        <sup className={`text-sm ms-1 ${firstLoad ? "opacity-100 starting:opacity-0" : "opacity-0"} duration-500`}>
                            -{percentage_discount}%
                        </sup>
                    }

                </div>
            </div>
        </div >

    )
}
