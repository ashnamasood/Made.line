const MAX_EDGE = 2000;

/**
 * Resizes a photo in the browser before upload: phone photos are often 5 MB+,
 * past what a Vercel function accepts. Returns the original when it can't be
 * decoded, or when shrinking wouldn't make it smaller.
 */
export async function shrinkImage(file: File): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  // JPEG has no transparency; paint white under any transparent PNG areas.
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.86),
  );
  if (!blob || blob.size >= file.size) return file;
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}

/** Swaps an input's chosen file for a shrunk copy and returns that copy. */
export async function shrinkInput(input: HTMLInputElement) {
  const file = input.files?.[0];
  if (!file) return null;
  const small = await shrinkImage(file);
  const list = new DataTransfer();
  list.items.add(small);
  input.files = list.files;
  return small;
}
