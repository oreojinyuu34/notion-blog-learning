import React from "react";
import { getAllPosts, getSinglePost } from "../../../lib/notionAPI";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Link from "next/link";

export const getStaticPaths = async () => {
  const allPosts = await getAllPosts();
  const paths = allPosts.map(({ slug }) => ({ params: { slug } }));
  return {
    paths: paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }: any) => {
  const post = await getSinglePost(params.slug);
  console.log(post.markdown); // 実際のマークダウンテキストが表示されるべきです。
  return {
    props: {
      post,
    },
    //6時間ごとに更新60秒×60分×時間
    revalidate: 60 * 60 * 6,
  };
};

const Post = ({ post }: any) => {
  return (
    <section className="container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20">
      <h2 className="w-full text-2xl font-medium">{post.metadata.title}</h2>
      <div className="border-b-2 w-1/3 mt-1 border-sky-700"></div>
      <span className="text-gray-500">投稿日:{post.metadata.date}</span>
      <br />
      {post.metadata.tags.map((tag: string, index: number) => (
        <p
          className="text-white bg-sky-700 rounded-xl font-medium mt-2 pb-1 px-2 inline-block mr-2"
          key={index}
        >
          {tag}
        </p>
      ))}
      {/* ReactMarkdownを適切に使用する */}
      <div className="prose lg:prose-xl mt-10">
        <ReactMarkdown
          components={{
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.markdown.parent}
        </ReactMarkdown>
        <Link href="/">
          <span className="block text-lg font-medium p-3 pb-10 mt-3">
            ←ホームに戻る
          </span>
        </Link>
      </div>
    </section>
  );
};

export default Post;
