"use client"

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const supabase = createClient()

export const useGetSession = (triggerReload?: any) => {
    const [userData, setUserData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        const fetchUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()

                if (user && isMounted) {
                    const { data: dataProf } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)

                    if (dataProf && isMounted) {
                        setUserData(dataProf)
                    }
                }
            } catch (error) {
                console.error("Error al obtener sesión:", error)
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        fetchUser()

        return () => {
            isMounted = false
        }
    }, [triggerReload])

    return { userData, loading }
}