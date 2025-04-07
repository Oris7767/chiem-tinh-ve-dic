
import React from 'react';
import { useBlog } from '@/context/BlogContext';
import PostListItem from './PostListItem';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const PostsList = () => {
  const { posts, isLoading } = useBlog();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-md p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex items-center justify-end space-x-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  const handleRefresh = () => {
    // Force page reload to refresh data from Supabase
    window.location.reload();
  };
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} /> Refresh Posts
        </Button>
      </div>
      
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No posts yet. Create your first post!</p>
        ) : (
          posts.map(post => (
            <PostListItem key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default PostsList;
