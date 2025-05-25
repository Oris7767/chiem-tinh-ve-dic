import { generateSitemap } from '../utils/sitemap';
import { supabase } from '../lib/supabase';

export const getSitemap = async () => {
  try {
    // Fetch all blog posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    // Generate sitemap XML
    const sitemap = generateSitemap(posts);

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}; 