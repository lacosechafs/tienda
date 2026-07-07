
export interface dataCatalog {
    available_discount: boolean;
    end_discount: string | null;
    id: number;
    percentage_discount: number;
    public_price: number;
    size: number;
    start_discount: string | null;
    min_stock: number;
    unit: string;
    bulk_stock: number;
    stored_stock: number;
}

export interface dataProducts {
    catalog: Array<dataCatalog>
    category_id: number;
    description: string | null;
    id: number;
    name: string;
    category?: string;
}

export interface dataCategories {
    id: number;
    name: string;
    products: Array<dataProducts>;
    slug: string;
}
