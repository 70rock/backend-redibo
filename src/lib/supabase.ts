import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

// Create a server-side supabase client
export function createClient() {
  return createServerComponentClient<Database>({ cookies })
}
