import { notFound } from "next/navigation";

import { getPostBySlug } from "@/lib/posts";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {post.title}
      </h1>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full rounded mb-6"
        />
      )}

      <div className="text-sm text-gray-500 mb-6">
        Created: {String(post.createdAt)}
      </div>

      <article className="text-gray-700 leading-7">
        {post.content}
      </article>
    </main>
  );
}