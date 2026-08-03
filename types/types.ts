import { Dispatch, RefObject, SetStateAction } from "react";

export interface Props {
    params: Promise<{ slug: string }>
}

export interface dataCatalog {
    available_discount: boolean;
    bulk_stock: number;
    end_discount: string | number | Date;
    id: number;
    percentage_discount: number;
    public_price: number;
    normal_price: number;
    size: number;
    start_discount: string | number | Date;
    min_stock: number;
    unit: string;
    product_id: number;
    stored_stock: number;
    featured: boolean;
    visible: boolean;
    show_discount: boolean;
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

export interface OrdersUserType extends OrderType {
    id: string;
    name: string;
    uuid: string;
    created_at: Date;
}

export interface UserObjState {
    address: Array<string>;
    phone: number | null;
    name: string;
    favs: Array<number>;
    orders?: Array<OrdersUserType>;
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

export interface EntriesOrderType {
    name: string | null;
    address: string | null;
    phone: number | null
}

export interface InputOrderType {
    label: string;
    name: keyof EntriesOrderType;
    placeholder: string;
    value: string | null | number;
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
    disableOpacity?: boolean

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
    orderCatalog: Array<dataCatalog>;
    ids: Array<number>;
}

export interface PropsFavProduct {
    name: string;
}

export interface dataOrderType {
    id: number;
    name: string;
    public_price: number;
    quantity: number;
    size: number;
    unit: string;
}

export type ProductGroup = Record<string, Array<dataOrderType> | undefined>

export interface HeroProductType {
    ids: Array<number>;
    orderCatalog: Array<dataCatalog>;
}