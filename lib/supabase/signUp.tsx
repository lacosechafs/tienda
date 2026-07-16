import { createClient } from "./client"

const supabase = createClient()

export async function signUpNewUser({ dataAcc }: { dataAcc: Record<string, string> }) {
    const { data, error } = await supabase.auth.signUp({
        email: dataAcc.mail,
        password: dataAcc.password,
        options: {
            data: {
                name: dataAcc.name,
                role: "client"
            }
        },
    })

    return {
        data,
        error
    }

}