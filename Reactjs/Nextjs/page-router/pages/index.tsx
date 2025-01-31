import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Home (Pages Router)</h1>
      <Link href="/about">Sobre</Link>
    </div>
  );
}