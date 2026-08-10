"use server";

import { revalidatePath } from "next/cache";
import { isStatus, setOrderStatus } from "@/lib/orders";

/** Called from the admin list's form buttons. Only reachable behind the proxy's Basic Auth. */
export async function updateStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = formData.get("status");
  if (!Number.isInteger(id) || !isStatus(status)) return;
  await setOrderStatus(id, status);
  revalidatePath("/admin");
}
