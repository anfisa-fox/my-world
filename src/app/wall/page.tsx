import Link from "next/link";

import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatDate";

export default function WallPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-10 font-serif text-5xl font-light text-[#2C2A26]">
        Wall
      </h1>

      <div className="space-y-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/wall/${post.slug}`}
            className="group block"
          >
            <article className="transition-transform duration-200 group-hover:-translate-y-0.5">
              <h2 className="font-serif text-3xl font-light text-[#2C2A26] transition-colors group-hover:text-[#6B8A6B]">
                {post.title}
              </h2>

              <div className="mt-2 font-mono text-xs text-[#8A8780]">
                {formatDate(post.createdAt)}
              </div>

              <p className="mt-4 line-clamp-3 text-base leading-7 text-[#5F5A52]">
                {post.content}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}