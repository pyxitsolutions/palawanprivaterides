import { blogPosts, type BlogPost } from '../data/blog';

export const BLOG_CATEGORIES = ['All', 'Travel Guide', 'Travel Tips'] as const;

export function getSortedBlogPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getTocEntries(post: BlogPost): { id: string; text: string }[] {
  return post.content
    .filter((s) => s.type === 'h2' && s.text)
    .map((s) => ({ id: slugifyHeading(s.text!), text: s.text! }));
}

export function getRelatedPosts(current: BlogPost, limit = 3): BlogPost[] {
  const bySlug = new Map(blogPosts.map((p) => [p.slug, p]));
  const picked: BlogPost[] = [];
  const seen = new Set<string>([current.slug]);

  for (const slug of current.relatedSlugs ?? []) {
    if (picked.length >= limit) break;
    const post = bySlug.get(slug);
    if (post && !seen.has(post.slug)) {
      picked.push(post);
      seen.add(post.slug);
    }
  }

  if (picked.length < limit) {
    for (const post of blogPosts) {
      if (picked.length >= limit) break;
      if (seen.has(post.slug)) continue;
      if (post.category === current.category) {
        picked.push(post);
        seen.add(post.slug);
      }
    }
  }

  if (picked.length < limit) {
    for (const post of blogPosts) {
      if (picked.length >= limit) break;
      if (!seen.has(post.slug)) {
        picked.push(post);
        seen.add(post.slug);
      }
    }
  }

  return picked;
}
