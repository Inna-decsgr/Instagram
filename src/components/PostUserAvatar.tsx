import React from 'react';
import Avatar from './Avatar';

type Props = {
  image: string | undefined;
  username?: string;
}

export default function PostUserAvatar({image, username}: Props) {
  return (
    <div className='flex items-center p-2'>
      <Avatar image={image} size='medium' highlight />
      <span className='text-gray-900 font-bold ml-2'>{username}</span>
    </div>
  );
}

