import Link from "next/link";
import React from "react";

type Props = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  isPaginationPage: boolean;
};

const SinglePost = (props: Props) => {
  const { title, description, date, tags, slug, isPaginationPage } = props;
  return (
    <>
      {isPaginationPage ? (
        <section className=" bg-sky-700 text-gray-100 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
          <div className="lg:flex items-center cursor-pointer">
            <h2 className="text-2xl font-medium mb-2">
              <Link href={`/posts/${slug}`}>{title}</Link>
            </h2>

            <div className="text-gray-300 mx-2">{date}</div>
            <div>
              {tags.map((tag: string, index: number) => (
                <Link href={`/posts/tag/${tag}/page/1`} key={index}>
                  <span
                    className="text-white bg-gray-600 rounded-xl mx-1 p-1 px-2 font-medium shadow-2xl hover:bg-white hover:text-gray-600 transition-all duration-300"
                    key={index}
                  >
                    {tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <p>{description}</p>
        </section>
      ) : (
        <section className="lg:w-1/2 bg-sky-700 text-gray-100 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3 cursor-pointer">
            <h2 className="text-2xl font-medium mb-2">
              <Link href={`/posts/${slug}`}>{title}</Link>
            </h2>
            <div className="text-gray-300 mx-2">{date}</div>
            <div>
              {tags.map((tag: string, index: number) => (
                <Link href={`/posts/tag/${tag}/page/1`} key={index}>
                  <span className="text-white bg-gray-600 rounded-xl mx-1 p-1 px-2 font-medium shadow-2xl hover:bg-white hover:text-gray-600 transition-all duration-300">
                    {tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <p>{description}</p>
        </section>
      )}
    </>
  );
};

export default SinglePost;
