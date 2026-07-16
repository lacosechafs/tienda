import { createClient } from "./client"

const supabase = createClient()

export async function signIn({ dataAcc }: { dataAcc: Record<string, string> }) {

    const { data, error } = await supabase.auth.signInWithPassword({
        email: dataAcc.mail,
        password: dataAcc.password,
    })

    return {
        data,
        error
    }

}
