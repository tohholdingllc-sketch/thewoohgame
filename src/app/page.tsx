import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { getLocale } from "@/lib/locale-server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/play");

  const locale = await getLocale();
  return <AuthScreen locale={locale} />;
}
