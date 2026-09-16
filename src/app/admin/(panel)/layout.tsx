import { getAccount, type Account } from "@/lib/account";
import { isDarkTheme } from "../_shared/theme";
import { Chrome } from "./Chrome";

// /admin/login sits outside this group, so it keeps its own layout.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  let account: Account;
  try {
    account = await getAccount();
  } catch (error) {
    // The pages show their own database error; the header just needs a name.
    console.error("admin account read failed", error);
    const username = process.env.ADMIN_USER ?? "admin";
    account = { username, name: username, avatar: null };
  }
  return (
    <Chrome account={account} dark={await isDarkTheme()}>
      {children}
    </Chrome>
  );
}
