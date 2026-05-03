import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Blog | Auxiron",
  description: "Read our latest articles on health, tradition, and the benefits of Bilona Ghee.",
};

// Force dynamic so it always pulls fresh blogs from the database
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  // Fetch only published blogs, ordered by newest first
  const blogs = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="blog-page">
      <section className="section" style={{ backgroundColor: '#FFFDF7', minHeight: '80vh' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-secondary-dark)' }}>
              The Auxiron Journal
            </h1>
            <p style={{ color: 'var(--color-text-light)', fontSize: '1.2rem' }}>Stories on Tradition, Health, and Purity.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {blogs.map((post) => {
              // Generate a short excerpt from the HTML/text content
              const plainTextContent = post.content.replace(/<[^>]+>/g, '');
              const excerpt = plainTextContent.length > 120 
                ? plainTextContent.substring(0, 120) + '...' 
                : plainTextContent;

              return (
                <article key={post.id} style={{ 
                  backgroundColor: 'var(--color-surface)', 
                  borderRadius: 'var(--radius-lg)', 
                  overflow: 'hidden', 
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.3s',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {post.imageUrl ? (
                    <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={post.imageUrl} 
                        alt={post.imageAlt || post.title} 
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    </div>
                  ) : (
                    <div style={{ height: '200px', backgroundColor: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'var(--color-text-light)' }}>No Image</span>
                    </div>
                  )}
                  
                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h2 style={{ fontSize: '1.5rem', margin: '1rem 0', lineHeight: 1.4 }}>
                      <Link href={`/blog/${post.slug}`} style={{ color: 'var(--color-text)' }}>
                        {post.title}
                      </Link>
                    </h2>
                    <p style={{ color: 'var(--color-text-light)', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                      {excerpt}
                    </p>
                    <Link href={`/blog/${post.slug}`} style={{ color: 'var(--color-primary-dark)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
                      Read Article →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {blogs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-light)' }}>
              <h3>No articles published yet.</h3>
              <p>Check back later for updates on health and purity.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
