import { Chrome } from "./Chrome";

// /admin/login sits outside this group, so it keeps its plain layout.
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <Chrome user={process.env.ADMIN_USER ?? "Admin"}>{children}</Chrome>;
}
