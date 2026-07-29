import { CatType } from '@/types/types'

export const Categories = ({ setOpenOptions }: CatType) => {

    return (
        <div
            className='flex'
        >
            <a
                className='content-center y-2 cursor-pointer'
                onClick={() => {
                    setOpenOptions(prev => prev === 'cat' ? '' : 'cat')
                }}
            >
                Categorias
            </a>
        </div>
    )
}
