import { Dispatch, RefObject, SetStateAction } from "react";

export interface Props {
    params: Promise<{ slug: string }>
}

export interface dataCatalog {
    available_discount: boolean;
    end_discount: string | null | Date;
    id: number;
    percentage_discount: number;
    public_price: number;
    size: number;
    start_discount: string | null | Date;
    min_stock: number;
    unit: string;
    bulk_stock: number;
    product_id: number;
    stored_stock: number;
    featured: boolean;
    visible: boolean;
}

export interface ArrayProduct extends dataCatalog {
    name: string;
    quantity: number;
}

export interface dataProductsPartial {
    catalog: Array<dataCatalog>
    id: number;
    name: string;
    show_product: boolean;
}

export interface dataProducts extends dataProductsPartial {
    category_id: number;
    description: string | null;
    category?: string;
}

export interface dataCategories {
    id: number;
    name: string;
    products: Array<dataProducts>;
    slug: string;
}

export interface ProductsState {
    products: any[];
    isOpen: boolean;
    stock: boolean;
}

export interface UserObjState {
    address: Array<string>;
    phone: number | null;
    name: string;
    favs: Array<number>;
}

export interface UserState {
    data: UserObjState;
}

export interface CartType {
    products: Array<ArrayProduct>
}

export type SliceType = Partial<ArrayProduct> & Pick<ArrayProduct, 'name' | 'id' | 'size'>;

export interface InputUserType {
    user: string | number | null;
    type: string;
    placeholder: string;
    border: string;
    icon: string;
    onSave: (newValue: string | Array<string> | number, setStatus: (value: string) => void) => void;
    array?: Array<string>;
}

export interface InputPassType {
    currentPass: string | number;
    newPass: string | number;
    status: string;
}

export interface InputSearchType {
    setFindProduct: Dispatch<SetStateAction<string>>;
    setOpenOptions: Dispatch<SetStateAction<string | null>>;
}

export interface InputResultsType {
    findProduct: string;
    openOptions: string | null;
    setOpenOptions: Dispatch<SetStateAction<string | null>>;
}

export interface ButtonSignType {
    setOpenOptions: Dispatch<SetStateAction<string | null>>;
}

export interface FormSignType {
    openOptions: string | null;
}

export interface CatType {
    setOpenOptions: Dispatch<SetStateAction<string | null>>;
}

export interface CatListType extends CatType {
    openOptions: string | null;
}

export interface OrderType {
    address: string;
    phone: number | null;
    products: Array<Record<string, Array<SliceType> | undefined>>;
    total_pay: number;
    uuid: string;
}

export type ProductPayload = Omit<SliceType, 'quantity'>

export interface ValueOrderType {
    data: string | null | number;
    check: boolean
}

export interface EntriesOrderType {
    address: ValueOrderType;
    phone: ValueOrderType
}

export interface InputOrderType {
    label: string;
    name: keyof EntriesOrderType;
    placeholder: string;
    value: ValueOrderType;
    setValue: Dispatch<SetStateAction<EntriesOrderType>>;
}

export interface UserPayload {
    key: keyof UserState['data'];
    value: any;
}

export interface GridCompType {
    children: React.ReactNode;
    condition: boolean | undefined | string;
    extraClass?: string;
    class1fr?: string;
    class0fr?: string;

}

export interface BasePropsProduct {
    name: string;
    title: string;
    id: number;
}

export interface PropsBoxProduct extends BasePropsProduct {
    catalog: Array<dataCatalog>;
}

export interface PropsDataProduct extends BasePropsProduct {
    orderCatalog: Array<OrderItemCatalog>;
}

export interface PropsFavProduct {
    name: string;
}

export type OrderItemCatalog = dataCatalog & {
    finalPrice: number;
};