import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/makeStore'
import { dataProducts, InputResultsType } from '@/types/types'
import { useRef } from 'react'
import { InputBycat } from './navbar/input-bycat'
import { GridComp } from './grid-comp'

export const ResultSearch = ({ findProduct, setOpenOptions, openOptions }: InputResultsType) => {

    const products = useAppSelector((state: RootState) => state.data.products)

    const normalizeText = (text: string) =>
        text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()

    const search = normalizeText(findProduct.trim())
    const searchSplit = search.split(/\s+/).filter(Boolean);

    const flatProducts = products.flatMap(fmap => {
        const cat = fmap.name
        const element = fmap.products.map((e: dataProducts) => ({ ...e, category: cat }))

        return element
    }).filter(f => {

        if (findProduct.length < 3) return false;
        const nameProd = normalizeText(f.name)

        return searchSplit.every(s =>
            nameProd.includes(s)
        )
    })

    const hasCatMatch = search.length >= 3 && products.some(c => normalizeText(c.name).includes(search))
    const anyResult = flatProducts.length > 0 || hasCatMatch

    return (
        <GridComp
            condition={openOptions === 'search' && anyResult}
            extraClass="px-3 bg-(--backgroundlt)"
            class1fr="my-1"
            class0fr="my-0"
        >
            <div className='grid lg:grid-flow-row-dense lg:[grid-template-columns:repeat(auto-fill,minmax(270px,1fr))]'>
                {products.map(f => {
                    const productsByCategory = flatProducts.filter(m =>
                        m.category === f.name
                    );

                    const findCat = (search.length >= 3 && normalizeText(f.name).includes(search) || search === "")

                    if (!productsByCategory.length) return


                    return (
                        <InputBycat
                            key={f.name}
                            categoryName={f.name}
                            slug={f.slug}
                            currentProducts={productsByCategory}
                            findCat={findCat}
                            setOpenOptions={setOpenOptions}
                        />
                    )
                })
                }
            </div>
        </GridComp>
    )
}

