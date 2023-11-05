import { Client } from "@notionhq/client";
import { start } from "repl";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getAllPosts = async () => {
  // 環境変数からdatabase_idを取得し、undefinedでないことを保証します。
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    // database_idが見つからない場合は、エラーを投げて処理を中断します。
    throw new Error("The environment variable NOTION_DATABASE_ID is not defined.");
  }

  const response = await notion.databases.query({
    database_id: databaseId, // 確実に文字列である変数を使用します。
    page_size: 100, // ページサイズを設定
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
