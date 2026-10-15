"use client"

import { memo, useEffect, useMemo, useRef } from 'react'
import { GridComp } from '../grid-comp'
import { ListProductsND } from './list-products-nd'
import { ListProdByCatType } from '@/types/types'

export const ListProdByCat = memo(({
    id,
    name,
    prods,
    setProdSelected,
    prodSelected
}: ListProdByCatType) => {

    const maxDiscount = useMemo(() => {
        return prods.reduce((max: number, prod) => {
            if (!prod.catalog) return max;
            for (const item of prod.catalog) {
                if (item.percentage_discount > max) {
                    max = item.percentage_discount;
                }
            }
            return max;
        }, 0);
    }, [prods]);

    const catRef = useRef<HTMLDivElement>(null)

    // useEffect(() => {
    //     if (prodSelected.category === id && catRef.current) {
    //         const timer = setTimeout(() => {
    //             requestAnimationFrame(() => {
    //                 const element = catRef.current;
    //                 if (!element) return;

    //                 const startPosition = window.pageYOffset;
    //                 const elementRect = element.getBoundingClientRect();
    //                 const absoluteTop = elementRect.top + startPosition;

    //                 const targetPosition = absoluteTop - 100;
    //                 const distance = targetPosition - startPosition;

    //                 let startTime: number | null = null;
    //                 const duration = 300;

    //                 const animation = (currentTime: number) => {
    //                     if (startTime === null) startTime = currentTime;
    //                     const timeElapsed = currentTime - startTime;
    //                     const progress = Math.min(timeElapsed / duration, 1);

    //                     const ease = 1 - Math.pow(1 - progress, 3);
    //                     window.scrollTo(0, startPosition + distance * ease);

    //                     if (timeElapsed < duration) {
    //                         requestAnimationFrame(animation);
    //                     }
    //                 };

    //                 requestAnimationFrame(animation);
    //             });
    //         }, 500);

    //         return () => clearTimeout(timer);
    //     }
    // }, [prodSelected.index, id]);

    return (
        <div className='max-w-screen'>
            <div
                id={String(id)} ref={catRef}
                onClick={() => {
                    setProdSelected(prev => {
                        const isSameCategory = prev.category === id
                        return {
                            ...prev,
                            category: isSameCategory ? null : id,
                            catalog: null
                        }
                    })
                }}
                className='flex justify-between items-center border border-[#fce49f] rounded-lg h-full py-1 my-1 scroll-mt-[112px]
                           backdrop-blur-[6px] bg-gray-800/30
                           shadow-[inset_1px_1px_0_rgba(252,228,159,0.75),inset_0_0_5px_rgba(252,228,159,0.75)]
                '
            >
                <h2 className="font-bold text-[#fea70e] px-2">
                    {name}
                </h2>
                {maxDiscount > 0 && (
                    <div className="z-10 flex items-center gap-1 bg-background px-1.5 py-0.5 rounded-full shadow-xs">
                        <span className="text-[11px] font-extrabold uppercase tracking-tight text-[#fea70e]">
                            Hasta {maxDiscount}% off
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 1024 1024" className="shrink-0">
                            <path fill="red" d="M834.1 469.2A347.5 347.5 0 0 0 751.2 354l-29.1-26.7a8.09 8.09 0 0 0-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8c-1.4 1.5-3 1.9-4.1 2s-2.8-.1-4.3-1.5c-1.4-1.2-2.1-3-2-4.8c3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9c-11 29.5-26.8 56.9-47 81.5a295.6 295.6 0 0 1-47.5 46.1a352.6 352.6 0 0 0-100.3 121.5A347.75 347.75 0 0 0 160 610c0 47.2 9.3 92.9 27.7 136a349.4 349.4 0 0 0 75.5 110.9c32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3A348.6 348.6 0 0 0 760.8 857c32.4-32 57.8-69.4 75.5-110.9a344.2 344.2 0 0 0 27.7-136c0-48.8-10-96.2-29.9-140.9" />
                        </svg>
                    </div>
                )}
            </div>

            <GridComp
                condition={prodSelected.category === id}
                extraClass="w-full"
                class0fr="pointer-events-none"
            >
                <ListProductsND
                    products={prods}
                    setProdSelected={setProdSelected}
                />

            </GridComp>

        </div>
    )
}, (prevProps, nextProps) => {
    const wasSelected = prevProps.prodSelected.category === prevProps.id
    const isSelected = nextProps.prodSelected.category === nextProps.id

    return wasSelected === isSelected && prevProps.prods === nextProps.prods
})