export const revalidate = 500;

interface SSGPageProps {
  time: string;
}

export default function SSGPage({ time }: SSGPageProps) {
  return <h1>SSG Page - Gerado em: {time}</h1>;
}

export async function generateStaticParams() {
  return [{ time: new Date().toISOString() }];
}