import { del, put } from "@vercel/blob";

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_BYTES = 3.5 * 1024 * 1024;

/** True when a Blob store is connected to this deployment. */
export const blobConfigured = () =>
  !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

/** A file input that was left empty still arrives as a zero-byte File. */
export const isUpload = (v: FormDataEntryValue | null): v is File =>
  v instanceof File && v.size > 0;

/** Checks an uploaded image; returns an error message, or null when it's fine. */
export function checkImage(file: File) {
  if (!TYPES[file.type]) return "Photos must be JPG, PNG or WebP.";
  if (file.size > MAX_BYTES) return "That photo is too large. Try one under 3.5 MB.";
  return null;
}

/** Stores a checked image under `folder` and returns its public URL. */
export async function uploadImage(folder: string, file: File) {
  const { url } = await put(`${folder}/photo.${TYPES[file.type]}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });
  return url;
}

/** Best effort: a leftover file costs storage, never correctness. */
export async function deleteImage(url: string | null) {
  if (!url || !blobConfigured()) return;
  await del(url).catch((e) => console.error("blob delete failed", url, e));
}
