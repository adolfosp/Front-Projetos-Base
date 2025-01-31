import { GetStaticProps, InferGetStaticPropsType } from "next";

type Repo = {
  time: string;
};

export const getStaticProps: GetStaticProps<{ repo: Repo }> = async () => {
  return {
    props: {
      repo: {
        time: new Date().toISOString(),
      },
    },
    revalidate: 500,
  };
};

export default function SSGPage({
  repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <h1>SSG Page - Gerado em: {repo.time}</h1>;
}
