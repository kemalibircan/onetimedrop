import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";

export const metadata: Metadata = {
  title: "Blog — File Transfer Tips & Guides",
  description:
    "Practical guides on phone-to-computer file transfer, QR code sharing, printing from your phone, and more.",
  alternates: { canonical: "https://onetimedrop.io/blog" },
};

const categories = ["All", "How-To", "Security", "Tips", "Comparison"];

export default async function BlogPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ category?: string }>;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  let posts = getAllPosts(lang);
  const { category: currentCategory } = await searchParams;

  const translatedAll = dict.blog.all || "All";
  const uniqueCategories = Array.from(new Set(posts.map(p => p.category)));
  const dynamicCategories = [translatedAll, ...uniqueCategories];

  if (currentCategory && currentCategory !== translatedAll) {
    posts = posts.filter(p => p.category === currentCategory);
  }

  return (
    <>
      <Navbar lang={lang} dict={dict.navbar} />
      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge-orange mb-3">{dict.blog.badge}</span>
          <h1 className="text-4xl font-extrabold mt-2">
            {dict.blog.title}
          </h1>
          <p className="text-[var(--color-muted)] mt-3 text-lg max-w-xl mx-auto">
            {dict.blog.subtitle}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {dynamicCategories.map((cat) => {
            const isActive = currentCategory ? currentCategory === cat : cat === translatedAll;
            const href = cat === translatedAll ? `/${lang}/blog` : `/${lang}/blog?category=${cat}`;
            return (
              <Link
                href={href}
                key={cat}
                className={isActive ? "btn-primary text-sm py-1.5 px-4" : "btn-ghost text-sm py-1.5 px-4"}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Grid */}
        {posts.length === 0 ? (
          <p className="text-center text-[var(--color-muted)] py-20">
            {dict.blog.no_posts}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${lang}/blog/${post.slug}`}
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
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}
