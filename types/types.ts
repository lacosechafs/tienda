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


export interface CartType {
    products: Array<ArrayProduct>
}

export interface SliceType {
    name: string;
    id: number;
    size: number;
    unit?: string;
    quantity?: number;
    public_price?: number;
}

export interface InputUserType {
    user: string | number;
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

export type ProductPayload = Omit<SliceType, 'quantity'>