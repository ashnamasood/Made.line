"use server";

import { revalidatePath } from "next/cache";
import { isMessageStatus, setMessageStatus } from "@/lib/contact";
import { requireAdmin } from "../../requireAdmin";

/** Marks a contact form message as replied, or back to new. */
export async function updateMessageStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = formData.get("status");
  if (!Number.isInteger(id) || !isMessageStatus(status)) return;
  await setMessageStatus(id, status);
  revalidatePath("/admin", "layout");
}
