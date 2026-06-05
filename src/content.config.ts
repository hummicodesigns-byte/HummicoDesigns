import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog posts live as Markdown in src/content/blog/.
// Frontmatter: title, description, pubDate, image, excerpt.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // Hero/card image path in /public. Leave '' to show the brand placeholder.
    image: z.string().default(''),
    excerpt: z.string(),
  }),
});

export const collections = { blog };
