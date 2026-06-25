import { notFound } from "next/navigation";

import { formatDate } from "@/lib/formatDate";
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

  const createdAt = formatDate(post.createdAt);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[#8A8780]">
        Из дневника
      </p>

      <h1 className="mb-4 font-serif text-5xl font-light text-[#2C2A26]">
        {post.title}
      </h1>

      {createdAt && (
        <div className="mb-8 font-mono text-xs text-[#8A8780]">
          {createdAt}
        </div>
      )}

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="mb-8 w-full rounded-md"
        />
      )}

      <article className="text-base leading-8 text-[#3E3A34]">
        {post.content}
      </article>
    </main>
  );
}