import { generateSitemap } from '../utils/sitemap';
import { supabase } from '../integrations/supabase/client';

export const getSitemap = async () => {
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, date')
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