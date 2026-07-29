import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LabPage } from "@/components/lab-page";
import { labBySlug, labs } from "@/lib/labs";

export function generateStaticParams() {
  return labs.map((lab) => ({ slug: lab.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lab = labBySlug.get(slug);

  if (!lab) return {};

  return {
    title: lab.shortTitle,
    description: lab.summary,
  };
}

export default async function LaboratoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lab = labBySlug.get(slug);

  if (!lab) notFound();

  return <LabPage lab={lab} />;
}

