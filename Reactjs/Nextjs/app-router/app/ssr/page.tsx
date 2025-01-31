export default async function SSRPage() {
    const time = new Date().toISOString();
    return <h1>SSR Page - Renderizado em: {time}</h1>;
  }