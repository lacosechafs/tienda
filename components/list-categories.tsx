import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/makeStore'
import { CatListType, dataProducts } from '@/types/types'
import { useRef } from 'react'
import { TransitionLink } from './transition-link'
import { GridComp } from './grid-comp'

export const ListCategories = ({ setOpenOptions, openOptions }: CatListType) => {

    const data = useAppSelector((state: RootState) => state.data.products)

    const catListRef = useRef<HTMLDivElement>(null)

    return (
        <div ref={catListRef}>
            <GridComp condition={openOptions === "cat"} extraClass="bg-(--backgroundlt) ">
                <div className="md:container-md mx-auto flex flex-row justify-center md:justify-start flex-wrap max-w-full-lg pb-5">
                    {data?.map(c => {
                        const haveProducts = c.products.some((d: dataProducts) => d.catalog.length)
                        if (haveProducts) {
                            return (
                                <TransitionLink key={c.id} href={c.slug} setOpenOptions={setOpenOptions} className="text-[#fea70e] bg-(--background) px-2 me-2 whitespace-nowrap border w-fit rounded-full mt-3 md:mt-5">
                                    {c.name}
                                </TransitionLink>
                            )
                        }
                    })
                    }
                </div>
            </GridComp>
        </div>
    )
}
