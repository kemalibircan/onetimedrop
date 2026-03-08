import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { getAllPosts } from "@/lib/blog";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — File Transfer Tips & Guides",
  description:
    "Practical guides on phone-to-computer file transfer, QR code sharing, printing from your phone, and more.",
  alternates: { canonical: "https://onetimedrop.io/blog" },
};

const categories = ["All", "How-To", "Security", "Tips", "Comparison"];

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge-orange mb-3">Blog</span>
          <h1 className="text-4xl font-extrabold mt-2">
            File Transfer Guides & Tips
          </h1>
          <p className="text-[var(--color-muted)] mt-3 text-lg max-w-xl mx-auto">
            Practical guides to help you move files faster and more securely.
          </p>
        </div>

        {/* Category filter (visual only) */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={cat === "All" ? "btn-primary text-sm py-1.5 px-4" : "btn-ghost text-sm py-1.5 px-4"}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {posts.length === 0 ? (
          <p className="text-center text-[var(--color-muted)] py-20">
            No posts yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card group hover:shadow-card-hover transition-all duration-300 flex flex-col gap-3 no-underline"
              >
                <div className="flex items-center justify-between">
                  <span className="badge-orange">{post.category}</span>
                  <span className="text-xs text-[var(--color-muted)]">{post.readingTime}</span>
                </div>
                <h2 className="font-bold text-base leading-snug group-hover:text-[#FF8A3D] transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-[var(--color-muted)] flex-1 leading-relaxed line-clamp-3">
                  {post.description}
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
