"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { shrinkInput } from "./shrinkImage";

/**
 * One replaceable photo: shows the current image, lets the admin pick a new
 * one (shrunk in the browser, previewed before saving), and optionally put
 * the original back. Give it `key={current}` so a save that changes the photo
 * remounts it and clears the preview.
 */
export function PhotoPicker({
  name,
  label,
  hint,
  current,
  canReset,
  disabled,
  round = false,
  fallback,
  resetLabel = "Use the original photo",
}: {
  name: string;
  label: string;
  hint: string;
  /** Null shows `fallback` instead. */
  current: string | null;
  canReset: boolean;
  disabled: boolean;
  round?: boolean;
  fallback?: React.ReactNode;
  resetLabel?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reset, setReset] = useState(false);

  // Object URLs hold the file in memory until revoked.
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  const shown = preview ?? current;
  const shape = round ? "size-28 rounded-full" : "aspect-square w-40 rounded-xl";

  return (
    <div>
      <p className="font-bold">{label}</p>
      <div className="mt-2 flex flex-wrap items-end gap-4">
        <div className={`relative overflow-hidden border border-ink/15 bg-ink/5 ${shape}`}>
          {shown ? (
            <Image
              src={shown}
              alt=""
              fill
              sizes="160px"
              unoptimized={!!preview}
              className={`object-cover ${reset && !preview ? "opacity-30" : ""}`}
            />
          ) : (
            fallback
          )}
          {preview && (
            <span className="absolute left-2 top-2 rounded-full bg-butter px-2 py-0.5 text-xs font-bold">
              New
            </span>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <label
            className={`inline-block rounded-xl border border-ink/20 px-4 py-2 font-bold ${
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-ink"
            }`}
          >
            {busy ? "Preparing…" : preview ? "Choose another" : "Upload new photo"}
            <input
              type="file"
              name={name}
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={disabled || busy}
              onChange={async (e) => {
                setBusy(true);
                const file = await shrinkInput(e.currentTarget);
                setBusy(false);
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
          </label>
          {canReset && !preview && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name={`${name}Reset`}
                checked={reset}
                onChange={(e) => setReset(e.target.checked)}
                className="size-4 accent-ink"
              />
              {resetLabel}
            </label>
          )}
          <p className="max-w-56 text-ink/50">{hint}</p>
        </div>
      </div>
    </div>
  );
}
