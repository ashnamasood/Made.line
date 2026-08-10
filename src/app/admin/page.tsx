import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Lead = { email: string; items: string[]; last_added: string };

async function getLeads(): Promise<Lead[] | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const rows = await db()`
      SELECT email, array_agg(product ORDER BY created_at) AS items,
             max(created_at) AS last_added
      FROM cart_leads
      GROUP BY email
      ORDER BY last_added DESC`;
    return rows as Lead[];
  } catch {
    return [];
  }
}

export default async function Admin() {
  const leads = await getLeads();

  return (
    <div className="px-6 py-16 md:px-10">
      <h1 className="text-3xl font-bold">Cart leads</h1>

      {leads === null ? (
        <p className="mt-6">DATABASE_URL is not set.</p>
      ) : leads.length === 0 ? (
        <p className="mt-6">No cart activity yet.</p>
      ) : (
        <table className="mt-8 w-full max-w-2xl border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-ink">
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Items</th>
              <th className="py-2">Last added</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((row) => (
              <tr key={row.email} className="border-b border-ink/20">
                <td className="py-2 pr-4">{row.email}</td>
                <td className="py-2 pr-4">{row.items.join(", ")}</td>
                <td className="py-2">
                  {new Date(row.last_added).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
