import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readCatalog } from "@/lib/catalog";
import { isProductId } from "@/lib/products";
import { Card, DbProblem, PageHeader, loadFromDb } from "../../ui";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit product — MADE.line admin" };

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isProductId(id)) notFound();
  const data = await loadFromDb("product", readCatalog);

  return (
    <>
      <PageHeader title="Edit Product" />
      {data.state !== "ok" ? (
        <DbProblem data={data} what="this product" />
      ) : (
        <Card title={`MADE.${id}`}>
          <Link href="/admin/products" className="text-ink/60 hover:text-ink">
            ← Back to products
          </Link>
          <div className="mt-6 flex items-center gap-4">
            <Image
              src={`/images/shop-${id}.jpg`}
              alt=""
              width={96}
              height={96}
              className="size-24 rounded-xl object-cover"
            />
            <p className="text-sm text-ink/60">
              Photos and the shop page copy are part of the site design, so they
              change through a developer.
            </p>
          </div>
          <div className="mt-8">
            <ProductForm id={id} info={data.value[id]} />
          </div>
        </Card>
      )}
    </>
  );
}
