import { notFound } from "next/navigation";
import { LabPage } from "@/components/lab-page";
import { availableTopics, topicBySlug } from "@/lib/topics";

export function generateStaticParams() {
  return availableTopics.map((topic) => ({ slug: topic.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = topicBySlug.get(slug);

  if (!topic || topic.status !== "available") {
    notFound();
  }

  return <LabPage topic={topic} />;
}
