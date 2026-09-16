"use server";

import { revalidatePath } from "next/cache";
import {
  checkCurrentPassword,
  getAccount,
  saveProfile,
  savePassword,
} from "@/lib/account";
import { blobConfigured, checkImage, deleteImage, isUpload, uploadImage } from "@/lib/blob";
import { requireAdmin, startSession } from "../../requireAdmin";

export type FormState = { error?: string; saved?: boolean };

const noDatabase = { error: "No database is connected, so changes can't be saved." };
const dbError = { error: "Couldn't save — the database returned an error." };

export async function updateProfile(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name can't be empty." };
  if (name.length > 60) return { error: "Name must be 60 characters or fewer." };

  const username = String(formData.get("username") ?? "").trim();
  if (!/^[A-Za-z0-9._-]{3,32}$/.test(username)) {
    return { error: "Username must be 3–32 letters, numbers, dots, dashes or underscores." };
  }

  const photo = formData.get("avatar");
  const upload = isUpload(photo) ? photo : null;
  if (upload) {
    if (!blobConfigured()) {
      return { error: "Photo uploads need a Vercel Blob store connected to the project first." };
    }
    const problem = checkImage(upload);
    if (problem) return { error: problem };
  }

  if (!process.env.DATABASE_URL) return noDatabase;

  let oldAvatar: string | null;
  try {
    oldAvatar = (await getAccount()).avatar;
  } catch (error) {
    console.error("account read failed", error);
    return dbError;
  }

  let avatar = oldAvatar;
  if (upload) {
    try {
      avatar = await uploadImage("admin", upload);
    } catch (error) {
      console.error("avatar upload failed", error);
      return { error: "Couldn't upload the photo. Please try again." };
    }
  } else if (formData.get("avatarReset") === "on") {
    avatar = null;
  }

  try {
    await saveProfile({ name, username, avatar });
  } catch (error) {
    console.error("profile save failed", error);
    if (upload) await deleteImage(avatar);
    return dbError;
  }
  if (avatar !== oldAvatar) await deleteImage(oldAvatar);

  revalidatePath("/admin", "layout");
  return { saved: true };
}

export async function updatePassword(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 8) return { error: "The new password must be at least 8 characters." };
  if (next.length > 128) return { error: "The new password must be 128 characters or fewer." };
  if (next !== confirm) return { error: "The new passwords don't match." };
  if (!process.env.DATABASE_URL) return noDatabase;

  try {
    if (!(await checkCurrentPassword(current))) {
      return { error: "Your current password is incorrect." };
    }
    if (next === current) return { error: "Choose a password different from the current one." };
    await savePassword(next);
  } catch (error) {
    console.error("password change failed", error);
    return dbError;
  }

  // The session key includes the password hash, so every existing session is
  // now invalid. Sign this browser back in so the admin isn't bounced out.
  await startSession();
  return { saved: true };
}
