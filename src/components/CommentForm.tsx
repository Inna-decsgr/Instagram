import React, { FormEvent, useState } from 'react';
import { SimplePost } from '@/model/post';
import { HomeUser } from '@/model/user';
import PostUserAvatar from './PostUserAvatar';
import { FaLongArrowAltUp } from 'react-icons/fa';

type Props = {
  onPostComment: (comment: string) => void;
  post: SimplePost;
  user: HomeUser | undefined;
}

export default function CommentForm({onPostComment, post, user}: Props) {
  const [comment, setComment] = useState('');
  const buttonDisabled = comment.length === 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onPostComment(comment);
    setComment('');
  }

  return (
    <form onSubmit={handleSubmit} className='flex items-center px-3 border-t border-neutral-300'>
      <PostUserAvatar image={user?.image} />
      <input
        className='w-full text-sm border border-gray-200 outline-none rounded-full p-2 pl-4'
        type="text"
        placeholder={`${post.username}님에게 댓글 남기기`}
        required
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <button
        disabled={buttonDisabled}
        className={`flex justify-center items-center w-12 h-8 rounded-lg text-xl text-white font-bold ml-2 ${buttonDisabled ? 'bg-sky-300' : 'bg-sky-500'}`}
      >
        <FaLongArrowAltUp />
      </button>
    </form>
  );
}

