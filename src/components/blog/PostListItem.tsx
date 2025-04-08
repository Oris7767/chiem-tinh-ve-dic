
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BlogPost } from '@/context/BlogContext';
import { useBlog } from '@/context/BlogContext';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PostListItemProps {
  post: BlogPost;
}

const PostListItem = ({ post }: PostListItemProps) => {
  const navigate = useNavigate();
  const { isLoading, deletePost } = useBlog();
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post.id);
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting post:", error);
        toast({
          title: "Error deleting post",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    }
  };
  
  // Format the date for better SEO and accessibility
  const formattedDate = new Date(post.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <h3 className="font-bold truncate" title={post.title}>{post.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            <time dateTime={new Date(post.date).toISOString()}>{formattedDate}</time> • {post.author}
          </p>
          {post.excerpt && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
          )}
        </div>
        <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/blog/${post.slug}`)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'View'}
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => navigate(`/blog/admin?edit=${post.id}`)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Edit'}
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostListItem;
