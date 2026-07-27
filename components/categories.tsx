import { CatType } from '@/types/types'

export const Categories = ({ setShowCat, catRef }: CatType) => {

    return (
        <div
            className='flex'
            ref={catRef}
        >
            <a
                className='content-center y-2 cursor-pointer'

                onClick={() => setShowCat(prev => !prev)}
            >
                Categorias
            </a>
        </div>
    )
}
