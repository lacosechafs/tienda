import { createClient } from "@/lib/supabase/client"
import { OrderType } from "@/types/types"

export const confirmOrder = async (order: OrderType) => {

    const supabase = createClient()

    const { error } = await supabase
        .from('orders')
        .insert(order)

    if (error) {
        console.log(error.message)
        return false
    }

    return true

}
