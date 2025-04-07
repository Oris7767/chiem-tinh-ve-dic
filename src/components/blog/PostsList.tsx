
import React from 'react';
import { useBlog } from '@/context/BlogContext';
import PostListItem from './PostListItem';

const PostsList = () => {
  const { posts } = useBlog();
  
  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No posts yet. Create your first post!</p>
      ) : (
        posts.map(post => (
          <PostListItem key={post.id} post={post} />
        ))
      )}
    </div>
  );
};

export default PostsList;
