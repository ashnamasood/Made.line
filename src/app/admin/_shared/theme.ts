import { cookies } from "next/headers";

export const THEME_COOKIE = "admin_theme";

/** Read on the server, so the page arrives in the right theme without a flash. */
export async function isDarkTheme() {
  return (await cookies()).get(THEME_COOKIE)?.value === "dark";
}
