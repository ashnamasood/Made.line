"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { blobConfigured, checkImage, deleteImage, isUpload, uploadImage } from "@/lib/blob";
import { CATALOG_TAG, readCatalog, saveProduct } from "@/lib/catalog";
import { MAX_DISCOUNT, isProductId, type ProductInfo } from "@/lib/products";
import { requireAdmin } from "../../requireAdmin";

export type SaveState = { error?: string; saved?: boolean };

// Form field name → catalogue key, for the two photo slots.
const SLOTS = [
  ["image", "image"],
  ["shopImage", "shopImage"],
] as const;

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

  const discountText = String(formData.get("discount") ?? "0").trim() || "0";
  const discount = Number(discountText);
  if (!/^\d{1,2}$/.test(discountText) || discount > MAX_DISCOUNT) {
    return { error: `Discount must be a whole number from 0 to ${MAX_DISCOUNT}.` };
  }

  const description = String(formData.get("description") ?? "").trim() || null;
  if (description && description.length > 1500) {
    return { error: "Description must be 1,500 characters or fewer." };
  }

  // Check every photo before uploading any, so a bad second photo can't
  // leave the first one stored with nothing pointing at it.
  const uploads = SLOTS.flatMap(([field, key]) => {
    const file = formData.get(field);
    return isUpload(file) ? [{ key, file }] : [];
  });
  if (uploads.length > 0 && !blobConfigured()) {
    return { error: "Photo uploads need a Vercel Blob store connected to the project first." };
  }
  for (const { file } of uploads) {
    const problem = checkImage(file);
    if (problem) return { error: problem };
  }

  if (!process.env.DATABASE_URL) {
    return { error: "No database is connected, so changes can't be saved." };
  }

  let current: ProductInfo;
  try {
    current = (await readCatalog())[id];
  } catch (error) {
    console.error("product read failed", error);
    return { error: "Couldn't save — the database returned an error." };
  }

  const next: ProductInfo = {
    title,
    price,
    discount,
    description,
    active: formData.get("active") === "on",
    image: current.image,
    shopImage: current.shopImage,
  };

  const uploaded: string[] = [];
  const replaced: (string | null)[] = [];
  try {
    for (const { key, file } of uploads) {
      const url = await uploadImage(`products/${id}`, file);
      uploaded.push(url);
      replaced.push(current[key]);
      next[key] = url;
    }
  } catch (error) {
    console.error("photo upload failed", error);
    await Promise.all(uploaded.map(deleteImage));
    return { error: "Couldn't upload the photo. Please try again." };
  }

  // "Use original photo" only applies when no new photo was chosen for that slot.
  for (const [field, key] of SLOTS) {
    if (formData.get(`${field}Reset`) === "on" && !uploads.some((u) => u.key === key)) {
      replaced.push(current[key]);
      next[key] = null;
    }
  }

  try {
    await saveProduct(id, next);
  } catch (error) {
    console.error("product save failed", error);
    await Promise.all(uploaded.map(deleteImage));
    return { error: "Couldn't save — the database returned an error." };
  }
  await Promise.all(replaced.map(deleteImage));

  // Expire the storefront's cached catalogue now, not in the background, and
  // re-render the prerendered pages that embed it.
  revalidateTag(CATALOG_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return { saved: true };
}
