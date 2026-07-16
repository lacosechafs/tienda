import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const updateSession = async (request: NextRequest) => {
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        supabaseUrl!,
        supabaseKey!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        },
    );

    const { data: { user } } = await supabase.auth.getUser()

    let dataProf = null

    if (user) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (error) {
            console.error("Error de validación:", error)
            return
        }

        dataProf = data
    }

    if (
        (!user || !dataProf?.is_admin) &&
        request.nextUrl.pathname.startsWith('/admin')
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    if (dataProf) {
        const profileBase64 = btoa(JSON.stringify(dataProf))

        request.headers.set('user-profile', profileBase64)

        supabaseResponse = NextResponse.next({
            request: {
                headers: request.headers,
            },
        })
    }

    return supabaseResponse
};