// BlogCard.tsx
import { ChatBubbleIcon, Pencil1Icon } from '@radix-ui/react-icons';
import React from 'react';

import CommentContainer from './blog-ui/comments/comment-list';
import type { CommentWithChildren, Post } from '~/server/schemas/schemas';
import { Link, NavLink } from '@remix-run/react';
import LikeContainer from './like-container';
import FavoriteContainer from './favorite-container';
import { ShareButton } from './share-button';
import Button from './button';
import { AnimatePresence, motion } from 'framer-motion';
import CommentBox from './blog-ui/comments/comment-box';
const dropdownVariants = {
    open: { opacity: 1, height: "auto", transition: { duration: 1 } },
    closed: { opacity: 0, height: 0 }
  };
interface Category {
  id: string;
  value: string;
  label: string;
}


interface BlogCardProps {
  post: Post;
    children?: React.ReactNode;
}

export default function BlogCard({ post,children }: BlogCardProps) {
    const [open, setOpen] = React.useState(false);
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-lg m-3">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img className="h-48 w-full object-contain md:w-48" src={post.imageUrl} alt={post.title} />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{new Date(post.createdAt).toLocaleDateString()}</div>
         <NavLink to={`/blog/${post.id}`} className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{post.title}</NavLink>
          <p className="mt-2 text-gray-500">{post.description}</p>
          <div 
           className="mt-2 text-gray-500"
            dangerouslySetInnerHTML={{ __html: post.content }}
         ></div>
          
          
         
        </div>
      </div>
      
      <div className="mt-4 p-2">
            {post.categories.map((category) => (
             <Link to={`/blog/categories/${category.value}`} key={category.id}>
                 <span key={category.id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{category.label}</span>
                </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-row gap-1 items-center">
            <LikeContainer likes={post.likes} postId={post.id} likeCounts={post._count?.likes || 0}/>
            <FavoriteContainer favorites={post.favorites} postId={post.id} />
            <ShareButton  id={post.id}/>
            <div className='flex flex-grow'/>
            <div className="flex flex-row gap-1 items-center">
            <Button
             className='text-black'
            variant='ghost'
            size='tiny'
            onClick={() => {
              setOpen(!open)
            }}
          >
                <ChatBubbleIcon />
                <p className="text-xs text-gray-500">{post.comments.length}</p>

            </Button>
          </div>

            </div>
      {/* Comment Section */}
      <div className="px-4 py-3 bg-gray-100">
     <CommentBox postId={post.id} />
  <CommentContainer open={open} postId={post.id} />
     
      
          
      </div>
    </div>
  );
}
