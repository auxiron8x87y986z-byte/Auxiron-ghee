import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

// Dynamically generate SEO Metadata based on the database fields
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post || !post.published) {
    return {
      title: "Blog Not Found | Auxiron",
    };
  }

  return {
    title: post.metaTitle || `${post.title} | Auxiron Journal`,
    description: post.metaDescription || post.content.substring(0, 160).replace(/<[^>]+>/g, ''),
    openGraph: post.imageUrl ? {
      images: [{ url: post.imageUrl, alt: post.imageAlt || post.title }]
    } : undefined
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="blog-detail-page">
      <article style={{ backgroundColor: '#FFFDF7', minHeight: '100vh', padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <Link href="/blog" style={{ color: 'var(--color-primary-dark)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            ← Back to Journal
          </Link>

          <header style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', color: 'var(--color-secondary-dark)', lineHeight: 1.2, marginBottom: '1rem' }}>
              {post.title}
            </h1>
            <div style={{ color: 'var(--color-text-light)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span>By Auxiron</span>
              <span>•</span>
              <time dateTime={post.createdAt.toISOString()}>
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
            </div>
          </header>

          {post.imageUrl && (
            <figure style={{ margin: '0 0 3rem 0', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={post.imageUrl} 
                alt={post.imageAlt || post.title} 
                style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' }}
              />
            </figure>
          )}

          <div 
            style={{ 
              fontSize: '1.15rem', 
              lineHeight: 1.8, 
              color: 'var(--color-text)',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
        </div>
      </article>
    </div>
  );
}
