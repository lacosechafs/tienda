import { Dispatch, SetStateAction, SubmitEvent } from "react";

export async function signUser(e: SubmitEvent<HTMLFormElement>, dataAcc: Record<string, string>, action: (data: any) => Promise<any>, refresh: Dispatch<SetStateAction<boolean>>, isSignUp: boolean, setErrorUser: Dispatch<SetStateAction<any>>) {
    e.preventDefault()

    setErrorUser(null)

    try {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        const emailRaw = dataAcc?.mail || "";
        const passwordRaw = dataAcc?.password || "";
        const nameRaw = dataAcc?.name || "";

        const email = emailRaw.trim();
        const password = passwordRaw.trim();
        const name = nameRaw.trim();


        if (!emailRaw && !passwordRaw) {
            throw new Error(`Debes indicar mail y contraseña`);
        }
        if (!emailRaw) {
            throw new Error(`No has indicado tu mail`);
        }
        if (!passwordRaw) {
            throw new Error(`No has indicado tu contraseña`);
        }

        if (!regex.test(dataAcc.mail)) throw new Error("El formato del mail no es valido")
        if (dataAcc.password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres")

        const data: {
            email: string;
            password: string;
            options?: {
                data: {
                    name: string;
                    role: string;
                }
            }
        } = {
            email: email,
            password: password,
        }

        if (isSignUp) {
            data.options = {
                data: {
                    name: name,
                    role: "client"
                }
            }
        }

        const { error } = await action(data)

        if (error) throw error;

        refresh(prev => !prev)

    } catch (error) {
        setErrorUser((error as any).message)
    }

}
