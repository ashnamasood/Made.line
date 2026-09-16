import type { Metadata } from "next";
import { getAccount } from "@/lib/account";
import { blobConfigured } from "@/lib/blob";
import { Card, DbProblem, PageHeader, loadFromDb } from "../ui";
import { PasswordForm, ProfileForm } from "./SettingsForms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings — MADE.line admin" };

export default async function Settings() {
  const data = await loadFromDb("account", getAccount);

  return (
    <>
      <PageHeader title="Profile Settings" />
      {data.state !== "ok" ? (
        <DbProblem data={data} what="your profile" />
      ) : (
        <div className="grid items-start gap-6 xl:grid-cols-2">
          <Card title="Personal Information">
            <p className="-mt-2 mb-6 text-sm text-ink/60">Update your name, username and photo.</p>
            <ProfileForm account={data.value} blobReady={blobConfigured()} />
          </Card>
          <Card title="Change Password">
            <p className="-mt-2 mb-6 text-sm text-ink/60">
              Changing it signs out every other browser where you&apos;re signed in.
            </p>
            <PasswordForm />
          </Card>
        </div>
      )}
    </>
  );
}
