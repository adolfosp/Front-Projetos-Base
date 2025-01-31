export async function getServerSideProps() {
    return {
      props: {
        time: new Date().toISOString(),
      },
    };
  }
  
  interface SSRPageProps {
    time: string;
  }

  export default function SSRPage({ time }: SSRPageProps) {
    return <h1>SSR Page - Renderizado em: {time}</h1>;
  }