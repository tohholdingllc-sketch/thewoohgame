import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { getLocale } from "@/lib/locale-server";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ join?: string }>;
}) {
  const { join } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (join) redirect(`/join?code=${encodeURIComponent(join)}`);
    redirect("/play");
  }

  const locale = await getLocale();
  return <AuthScreen locale={locale} nextJoin={join} />;
}
