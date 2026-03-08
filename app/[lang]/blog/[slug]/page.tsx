import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { getDictionary } from "@/lib/dictionaries";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { remark } from "remark";
import remarkHtml from "remark-html";
import Link from "next/link";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: post.canonical || `https://onetimedrop.io/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://onetimedrop.io/blog/${slug}`,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await params;
  const dict = await getDictionary(lang);
  const post = getPostBySlug(slug, lang);
  if (!post) notFound();

  const processed = await remark().use(remarkHtml).process(post.content);
  const html = processed.toString();

  const allPosts = getAllPosts();
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <Navbar lang={lang} dict={dict.navbar} />
      <main className="max-w-3xl mx-auto px-4 py-16">
        {/* Article header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge-orange">{post.category}</span>
            <span className="text-sm text-[var(--color-muted)]">{post.readingTime}</span>
            <span className="text-sm text-[var(--color-muted)]">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-[var(--color-muted)]">{post.description}</p>
        </div>

        {/* Article body */}
        <article
          className="prose prose-neutral dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-[var(--color-text)]
            prose-a:text-[#FF8A3D] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[var(--color-text)] prose-code:text-[#FF8A3D]
            prose-li:text-[var(--color-muted)] prose-p:text-[var(--color-muted)]
            prose-p:leading-relaxed mb-12"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* CTA */}
        <div className="card bg-gradient-to-br from-[#FFB86B]/20 to-[#FF8A3D]/10 text-center mb-12">
          <h2 className="text-xl font-bold mb-2">Try OneTimeDrop free</h2>
          <p className="text-[var(--color-muted)] text-sm mb-4">
            Send files from your phone to any computer in seconds.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/" className="btn-primary text-sm">
              Start a session →
            </Link>
            <Link href="/join" className="btn-secondary text-sm">
              Join with code
            </Link>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section aria-labelledby="related-posts">
            <h2 id="related-posts" className="text-xl font-bold mb-5">
              Related posts
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.slice(0, 2).map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="card hover:shadow-card-hover transition-all duration-300 no-underline"
                >
                  <span className="badge-orange mb-2 inline-block">{p.category}</span>
                  <h3 className="font-semibold text-sm leading-snug hover:text-[#FF8A3D] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[var(--color-muted)] mt-1.5 line-clamp-2">
                    {p.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}
