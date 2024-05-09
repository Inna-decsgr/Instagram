import React from 'react';
import HeartIcon from './ui/icons/HeartIcon';
import BookmarkIcon from './ui/icons/BookmarkIcon';
import { parseDate } from '@/util/date';
import ToggleButton from './ui/ToggleButton';
import HeartFillIcon from './ui/icons/HeartFillIcon';
import BookmarkFillIcon from './ui/icons/BookmarkFillIcon';
import { Comment, SimplePost } from '@/model/post';
import usePosts from '@/hooks/posts';
import useMe from '@/hooks/me';
import CommentForm from './CommentForm';

type Props = {
  post: SimplePost;
  children?: React.ReactNode;
  onComment: (comment: Comment) => void;
}

export default function ActionBar({ post, children, onComment }: Props) {
  const { id, likes, createdAt } = post;
  const { user, setBookmark } = useMe();
  const { setLike } = usePosts();

  const liked = user ? likes.includes(user.username) : false;
  const bookmarked = user?.bookmarks.includes(id) ?? false;

  const handleLike = (like: boolean) => {
    user && setLike(post, user.username, like);
  }
  const handleBookmark = (bookmark: boolean) => {
    user && setBookmark(id, bookmark);
  }
  const handleComment = (comment: string) => {
    user && onComment({comment, username: user.username, image: user.image})
  }

  return (
    <>
      <div className='flex justify-between my-2 px-4'>
        <ToggleButton
          title = {liked ? 'unlike' : 'like'}
          toggled={liked}
          onToggle={handleLike}
          onIcon={<HeartFillIcon />}
          offIcon={<HeartIcon />}
        />
        <ToggleButton
          title={bookmarked ? 'unbookmark' : 'bookmark'}
          toggled={bookmarked}
          onToggle={handleBookmark}
          onIcon={<BookmarkFillIcon />}
          offIcon={<BookmarkIcon />}
        />
      </div>
      <div className='px-4'>
        <p className='text-sm font-bold'>
          {`좋아요 ${likes?.length ?? 0}개`}
        </p>
        {children}
        <p className='text-xs text-neutral-500 uppercase mb-4'>{parseDate(createdAt)}</p>
      </div>
      <CommentForm onPostComment={handleComment} post={post} user={user} />
    </>
  );
}

