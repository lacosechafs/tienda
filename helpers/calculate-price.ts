import { dataCatalog } from "@/types/types";

export const calculateFinalPrice = (item: dataCatalog) => {
    if (!item.available_discount || !item.percentage_discount) {
        return item.public_price;
    }

    const now = Date.now();

    const hasStarted = item.start_discount
        ? new Date(item.start_discount).getTime() <= now
        : true;

    const hasNotEnded = item.end_discount
        ? new Date(item.end_discount).getTime() >= now
        : true;

    const isDiscountActive = hasStarted && hasNotEnded;

    if (isDiscountActive) {
        const discountAmount = item.public_price * (item.percentage_discount / 100);
        return Math.round((item.public_price - discountAmount) * 100) / 100;
    }

    return item.public_price;
};
