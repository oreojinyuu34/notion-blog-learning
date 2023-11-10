import { Client } from "@notionhq/client";
import { NUMBER_OF_POSTS_PER_PAGE } from "constants/constants";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion});

export const getAllPosts = async () => {
  // 環境変数からdatabase_idを取得し、undefinedでないことを保証します。
  // const databaseId = process.env.NOTION_DATABASE_ID as string;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    // database_idが見つからない場合は、エラーを投げて処理を中断します。
    throw new Error("The environment variable NOTION_DATABASE_ID is not defined.");
  }

  const response = await notion.databases.query({
    database_id: databaseId, // 確実に文字列である変数を使用します。
    page_size: 100, // ページサイズを設定
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      },
    },
    sorts: [{
      property: "日付",
      //最新の投稿順
      direction: "descending",
      //古い投稿順
      // direction: "ascending",

    }]
  });

  // Notion APIからの応答から投稿の結果を取得します。
  const allPosts = response.results;

  // 投稿の結果を返します。
  return allPosts.map((post) => {
    return getPageMetaData(post)

    //return post;
    //プロパティの中身全体を見る
  });
};

const getPageMetaData = (post: any) => {

  const getTags = (tags:any) => {
    const allTags = tags.map((tag:any) => {
      return tag.name;
    });
    return allTags;
  }

  return {
    id: post.id,
    title: post.properties.名前.title[0].plain_text,
    description: post.properties.Description.rich_text[0].plain_text,
    date: post.properties.日付.date.start,
    slug: post.properties.Slug.rich_text[0].plain_text,
    //tags: post.properties.タグ.multi_select,下のコードに変更してmap関数で複数データ取得
    tags: getTags(post.properties.タグ.multi_select),
  };

};

export const getSinglePost = async (slug: string) => {
  const response =await notion.databases.query({
    database_id:process.env.NOTION_DATABASE_ID,
    filter: {
      property: "Slug",
      formula: {
        string: {
          equals: slug,
        }
      }
    }
  })
  const page = response.results[0]
  const metadata = getPageMetaData(page)
  //console.log(metadata)
  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdBlocks);
  //console.log(mdString);

  return {
    metadata,
    markdown: mdString,
  }
}

/* トップページ用記事の取得(NUMBER_OF_POSTS_PER_PAGE) */
export const getPostsForTopPage = async (pageSize = NUMBER_OF_POSTS_PER_PAGE) => {
  const allPosts = await getAllPosts();
  const fourPosts = allPosts.slice(0, pageSize);
  return fourPosts;
}

/* ページ番号に応じた記事取得 */
export const getPostsByPage = async (page:number) => {
  const allPosts =await getAllPosts();

  const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
  const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;

  return allPosts.slice(startIndex,endIndex);
}


export const getNumberOfPages =async () => {
  const allPosts = await getAllPosts();

  return(
    Math.floor(allPosts.length /NUMBER_OF_POSTS_PER_PAGE) + (allPosts.length % NUMBER_OF_POSTS_PER_PAGE > 0
    ?1
    : 0));

}


export const getPostsByTagAndPage = async (tagName: string, page: number) => {
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((post) =>
  post.tags.find((tag: string) => tag === tagName))

  const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
  const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;

  return posts.slice(startIndex,endIndex);
}

export const getNumberOfPagesByTag =async (tagName:string) => {
  const allPosts =await getAllPosts();
  const posts = allPosts.filter((post) =>
  post.tags.find((tag: string) => tag === tagName)
  )

  return(
    Math.floor(posts.length /NUMBER_OF_POSTS_PER_PAGE) + (posts.length % NUMBER_OF_POSTS_PER_PAGE > 0
    ?1
    : 0));
}

export const getAllTags =async () => {
  const allPosts = await getAllPosts();

  const allTagsDuplicationLists = allPosts.flatMap((post) => post.tags);
  const set = new Set(allTagsDuplicationLists);
const allTagsList = Array.from(set);

return allTagsList;
}
