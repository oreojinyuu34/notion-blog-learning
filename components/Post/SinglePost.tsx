import Link from "next/link";
import React from "react";

type Props = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
};

const SinglePost = (props: Props) => {
  const { title, description, date, tags, slug } = props;
  return (
    <section className="lg:w-1/2 bg-sky-700 text-gray-100 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
      <Link href={`/posts/${slug}`}>
        <div className="flex items-center gap-3 cursor-pointer">
          <h2 className="text-2xl font-medium mb-2">{title}</h2>
          <div>{date}</div>
          <div>
            {tags.map((tag) => (
              <span className="text-white bg-gray-600 rounded-xl mx-1 p-1 px-2 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p>{description}</p>
      </Link>
    </section>
  );
};

export default SinglePost;
