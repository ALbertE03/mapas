import { createClient } from "@/lib/supabase/server";
import { LoginButton } from "./login-button";
import { UserMenuClient } from "./user-menu";

export async function User() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <LoginButton />;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <UserMenuClient
      user={{
        id: user.id,
        email: user.email ?? "",
        full_name: profile?.full_name ?? "",
        avatar_url: profile?.avatar_url ?? null,
      }}
    />
  );
}
