import { SearchUser } from '@/model/user';
import Link from 'next/link';
import React from 'react';
import Avatar from './Avatar';

type Props = {
  user: SearchUser
}

export default function UserCard({user: { name, username, image} }: Props) {

  return (
    <Link className='flex items-center w-full rounded-sm  mb-2 p-4 bg-neutral-50 hover:bg-white' href={`/user/${username}`}>
      <Avatar image={image} />
      <div className='text-neutral-500 ml-3'>
        <p className='text-black font-bold leading-4'>{username}</p>
        <p className='mt-1'>{name}</p>
      </div>
    </Link>
  );
}

