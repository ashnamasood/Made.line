"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { CATALOG_TAG, saveProduct } from "@/lib/catalog";
import { isProductId } from "@/lib/products";
import { requireAdmin } from "../../requireAdmin";

export type SaveState = { error?: string; saved?: boolean };

export async function updateProduct(_: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();

  const id = formData.get("id");
  if (!isProductId(id)) return { error: "Unknown product." };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Name can't be empty." };
  if (title.length > 80) return { error: "Name must be 80 characters or fewer." };

  // Dollars in the form, cents in the database.
  const priceText = String(formData.get("price") ?? "").trim();
  if (!/^\d{1,5}(\.\d{1,2})?$/.test(priceText)) {
    return { error: "Price must be a number like 32 or 32.50." };
  }
  const price = Math.round(Number(priceText) * 100);

  const active = formData.get("active") === "on";

  if (!process.env.DATABASE_URL) {
    return { error: "No database is connected, so changes can't be saved." };
  }
  try {
    await saveProduct(id, { title, price, active });
  } catch (error) {
    console.error("product save failed", error);
    return { error: "Couldn't save — the database returned an error." };
  }

  // Expire the storefront's cached catalogue now, not in the background, and
  // re-render the prerendered pages that embed it.
  revalidateTag(CATALOG_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return { saved: true };
}
