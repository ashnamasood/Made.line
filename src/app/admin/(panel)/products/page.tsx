import type { Metadata } from "next";
import Image from "next/image";
import { PRODUCTS, money, type ProductId } from "@/lib/products";
import { Card, PageHeader, pill } from "../ui";

export const metadata: Metadata = { title: "Products — MADE.line admin" };

// Read-only: the catalogue lives in src/lib/products.ts, not the database.
const ids = Object.keys(PRODUCTS) as ProductId[];

export default function Products() {
  return (
    <>
      <PageHeader title="Products" />
      <Card title="Products">
        <div className="-mx-5 overflow-x-auto md:-mx-7">
          <table className="w-full text-left">
            <thead className="border-b border-ink/10 text-sm text-ink/50">
              <tr>
                <th className="px-5 pb-3 font-normal md:px-7">Product</th>
                <th className="px-3 pb-3 font-normal">Price</th>
                <th className="hidden px-5 pb-3 font-normal sm:table-cell md:px-7">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {ids.map((id) => (
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
                        <p className="text-sm text-ink/50">{PRODUCTS[id].title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 font-bold">{money(PRODUCTS[id].price)}</td>
                  <td className="hidden px-5 py-4 sm:table-cell md:px-7">
                    <span className={`${pill} bg-green-100 text-green-800`}>In shop</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-ink/50">
          Names and prices are set in the site&apos;s code, so changes go through a
          developer for now.
        </p>
      </Card>
    </>
  );
}
