import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { readCatalog } from "@/lib/catalog";
import { PRODUCT_IDS, money } from "@/lib/products";
import { Card, DbProblem, PageHeader, loadFromDb, pill } from "../ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Products — MADE.line admin" };

export default async function Products() {
  const data = await loadFromDb("products", readCatalog);

  return (
    <>
      <PageHeader title="Products" />
      {data.state !== "ok" ? (
        <DbProblem data={data} what="products" />
      ) : (
        <Card title="Products Management">
          <div className="-mx-5 overflow-x-auto md:-mx-7">
            <table className="w-full text-left">
              <thead className="border-b border-ink/10 text-sm text-ink/50">
                <tr>
                  <th className="px-5 pb-3 font-normal md:px-7">Product</th>
                  <th className="px-3 pb-3 font-normal">Price</th>
                  <th className="hidden px-3 pb-3 font-normal sm:table-cell">Stock</th>
                  <th className="px-5 pb-3 text-right font-normal md:px-7">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {PRODUCT_IDS.map((id) => {
                  const p = data.value[id];
                  return (
                    <tr key={id}>
                      <td className="px-5 py-4 md:px-7">
                        <div className="flex items-center gap-4">
                          <Image
                            src={`/images/shop-${id}.jpg`}
                            alt=""
                            width={56}
                            height={56}
                            className="size-14 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-bold">MADE.{id}</p>
                            <p className="text-sm text-ink/50">{p.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 font-bold">{money(p.price)}</td>
                      <td className="hidden px-3 py-4 sm:table-cell">
                        <span
                          className={`${pill} ${
                            p.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {p.active ? "In stock" : "Sold out"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right md:px-7">
                        <Link
                          href={`/admin/products/${id}`}
                          className="inline-block rounded-xl border border-ink/20 px-4 py-2 text-sm font-bold hover:border-ink"
                        >
                          Edit
                          <span className="sr-only"> MADE.{id}</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
