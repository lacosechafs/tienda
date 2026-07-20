import { createClient } from "@/lib/supabase/client"

const translateSupabaseError = (message: string): string => {
    const msg = message.trim()

    switch (true) {
        case msg.includes("Invalid login credentials"):
            return "La contraseña actual es incorrecta."

        case msg.includes("Email not confirmed"):
            return "El correo electrónico aún no ha sido confirmado."

        case msg.includes("Too many requests"):
        case msg.includes("rate limit"):
            return "Demasiados intentos fallidos. Inténtalo más tarde."

        case msg.includes("User not found"):
            return "No se encontró el usuario."

        case msg.includes("New password should be different from the old password") ||
            msg.includes("Password should be different"):
            return "La nueva contraseña debe ser diferente a la contraseña actual."

        case msg.includes("Password should be at least"):
            return "La contraseña debe tener al menos 6 caracteres."

        case msg.includes("Password is too weak") ||
            msg.includes("Pwned password") ||
            msg.includes("Password should contain"):
            return "La contraseña es muy débil. Debe ser más compleja."

        case msg.includes("Auth session missing") ||
            msg.includes("User from sub claim in JWT does not exist"):
            return "Tu sesión ha expirado. Por favor, vuelve a iniciar sesión."

        case msg.includes("Same password"):
            return "La nueva contraseña no puede ser igual a la anterior."

        default:
            return message || "Ocurrió un error al intentar cambiar la contraseña."
    }
}

export const ChangePass = async (
    email: string,
    currentPass: string,
    newPass: string,
    status: (msg: string) => void
) => {
    const supabase = createClient()

    const { error: currentError } = await supabase.auth.signInWithPassword({
        email: email,
        password: currentPass,
    })

    if (currentError) {
        status(translateSupabaseError(currentError.message))
        return
    }

    const { error: actualError } = await supabase.auth.updateUser({
        password: newPass
    })

    if (actualError) {
        status(translateSupabaseError(actualError.message))
        return
    }

    status("Cambio realizado con éxito")
}