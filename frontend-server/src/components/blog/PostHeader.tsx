
import React from 'react';
import { CalendarIcon, Tag } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface PostHeaderProps {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  tags: string[];
}

const PostHeader: React.FC<PostHeaderProps> = ({
  title, 
  subtitle,
  author,
  date,
  tags
}) => {
  // Get author initials for avatar
  const getAuthorInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
        {title}
      </h1>
        
      {subtitle && (
        <p className="text-xl text-gray-600 mb-6 italic">
          "{subtitle}"
        </p>
      )}
        
      <div className="flex items-center mb-6">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{getAuthorInitials(author)}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <p className="font-semibold text-gray-900">{author}</p>
          <p className="text-sm text-gray-600 flex items-center">
            <CalendarIcon size={14} className="mr-1" />
            {date}
          </p>
        </div>
      </div>
        
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map(tag => (
          <span 
            key={tag} 
            className="inline-flex items-center bg-amber-100 px-3 py-1 rounded-full text-sm text-amber-800"
          >
            <Tag size={12} className="mr-2" />
            {tag}
          </span>
        ))}
      </div>
        
      <Separator className="mb-8" />
    </header>
  );
};

export default PostHeader;
