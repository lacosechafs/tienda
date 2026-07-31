import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { RootState } from '@/redux/makeStore';
import { PropsFavProduct } from '@/types/types';
import { QuantityInput } from './quantity-input';

export const DataFavs = ({
    name
}: PropsFavProduct) => {

    return (
        <div className="flex flex-col flex-1 p-2 justify-between">
            <div className="flex w-full">
                <h2 className="w-fit font-bold text-[#fea70e]">{name}</h2>
            </div>
        </div>
    )
}
