
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BlogPost } from '@/context/BlogContext';
import { useBlog } from '@/context/BlogContext';
import { Loader2 } from 'lucide-react';

interface PostListItemProps {
  post: BlogPost;
}

const PostListItem = ({ post }: PostListItemProps) => {
  const navigate = useNavigate();
  const { isLoading } = useBlog();
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <h3 className="font-bold truncate">{post.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(post.date).toLocaleDateString()} • {post.author}
          </p>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default PostListItem;
