import Link from "next/link";

import { getAllPosts } from "@/lib/posts";

export default function WallPage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">
        Wall
      </h1>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/wall/${post.slug}`}
            className="block border rounded-lg p-4 hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold mb-2">
              {post.title}
            </h2>

            <p className="text-gray-600 mb-2">
              {post.content}
            </p>

            <div className="text-sm text-gray-500">
              {String(post.createdAt)}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}