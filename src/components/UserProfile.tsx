import { ProfileUser } from '@/model/user';
import React from 'react';
import Avatar from './Avatar';
import FollowButton from './FollowButton';

type Props = {
  user: ProfileUser
}

export default function UserProfile({ user }: Props) {
  const { image, username, followers, following, posts } = user;
  const info = [
    {title: '게시물', data: posts},
    {title: '팔로워', data: followers},
    {title: '팔로잉', data: following},
  ]

  return (
    <section className='w-full flex flex-col md:flex-row items-center justify-center py-12 border-b border-neutral-300'>
      <Avatar image={image} highlight size='xlarge'/>
      <div className='md:ml-10 basis-1/3'>
        <div className='flex flex-col items-center md:flex-row'>
          <h1 className='text-2xl font-bold md:mr-8 my-2 md:mb-0'>{username}</h1>
          <FollowButton user={user} />
        </div>
        <ul className='my-6 flex gap-10'>
          {info.map(({title, data}, index) => <li key={index} className='flex flex-col text-center'>
            <span className='font-bold mr-1'>{data}</span>
            {title}
          </li>)}
        </ul>
      </div>
    </section>
  );
}

