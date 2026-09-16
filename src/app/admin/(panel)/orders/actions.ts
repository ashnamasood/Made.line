"use server";

import { revalidatePath } from "next/cache";
import { isStatus, setOrderStatus } from "@/lib/orders";
import { requireAdmin } from "../../requireAdmin";

/** Called from the orders list's buttons. */
export async function updateStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = formData.get("status");
  if (!Number.isInteger(id) || !isStatus(status)) return;
  await setOrderStatus(id, status);
  // The whole panel, so the dashboard's counts move too.
  revalidatePath("/admin", "layout");
}
