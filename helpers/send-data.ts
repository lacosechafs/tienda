import { createClient } from "@/lib/supabase/client"

export const SendData = async (type: string, value: string | number | null | Array<string>, setStatus?: (value: string) => void) => {

  const supabase = createClient()

  const { data } = await supabase.auth.getUser()

  if (!data.user) return

  const { error } = await supabase
    .from('profiles')
    .update({
      [type]: value || null
    })
    .eq('id', data.user.id)

  if (error) {
    setStatus?.(error.message)
    return
  }

  setStatus?.("ok")

}
