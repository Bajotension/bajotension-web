import "server-only";
import { PRODUCTO } from "./config";
import { supabaseAdmin } from "./supabase/server";

export async function tieneLaGuia(userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin()
    .from("accesos")
    .select("id")
    .eq("user_id", userId)
    .eq("producto", PRODUCTO.id)
    .is("revocado", null)
    .limit(1);
  return Boolean(data && data.length);
}
