"use client"

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const supabase = createClient()

export const useGetSession = () => {
    const [userData, setUserData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    const { data: dataProf } = await supabase
                        .from('profiles')
                        .select(`*,orders(*)`)
                        .eq('id', session.user.id)

                    if (isMounted) {
                        setUserData(dataProf)
                    }
                } else if (isMounted) {
                    setUserData(null)
                }

                if (isMounted) {
                    setLoading(false)
                }
            }
        )

        return () => {
            isMounted = false
            subscription.unsubscribe()
        }
    }, [])

    return { userData, loading }
}