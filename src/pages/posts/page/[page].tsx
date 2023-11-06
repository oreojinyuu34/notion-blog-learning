import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import SinglePost from "components/Post/SinglePost";
import {
  getNumberOfPages,
  getPostsByPage,
  getPostsForTopPage,
} from "lib/notionAPI";
import Pagination from "components/Pagination/Pagination";

export const getStaticPaths: GetStaticPaths = async () => {
  const numberOfPage = await getNumberOfPages();

  let params = [];
  for (let i = 1; i <= numberOfPage; i++) {
    params.push({ params: { page: i.toString() } });
  }

  return {
    paths: params,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const currentPage = context.params?.page;
  const postsByPage = await getPostsByPage(
    parseInt(currentPage.toString(), 10)
  );
  const numberOfPage = await getNumberOfPages();

  return {
    props: {
      postsByPage,
      numberOfPage,
    },
    //6時間ごとに更新60秒×60分×時間
    revalidate: 60 * 60 * 6,
  };
};

const BlogPageList = ({ postsByPage, numberOfPage }: any) => {
  return (
    <div className="container h-full w-full mx-auto">
      <Head>
        <title>Notion-Blog</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">
          NotionでBlog🐴
        </h1>
        <section className="sm:grid grid-cols-2 w-6/5 gap-3 mx-auto">
          {postsByPage.map((post: any) => (
            <div key={post.id}>
              <SinglePost
                title={post.title}
                description={post.description}
                date={post.date}
                tags={post.tags}
                slug={post.slug}
                isPaginationPage={true}
              />
            </div>
          ))}
        </section>
        <Pagination numberOfPage={numberOfPage} />
      </main>
    </div>
  );
};

export default BlogPageList;
