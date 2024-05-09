'use client'

import { ProfileUser } from '@/model/user';
import React, { useState, useTransition } from 'react';
import Button from './ui/Button';
import useMe from '@/hooks/me';
import { useRouter } from 'next/navigation';
import { PulseLoader } from 'react-spinners';

type Props = {
  user: ProfileUser
}

export default function FollowButton({ user }: Props) {
  const { user: loggedInUser, toggleFollow } = useMe();
  const { username } = user;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isUpdating = isPending || isFetching;

  const showButton = loggedInUser && loggedInUser.username !== username;
  const following = loggedInUser && loggedInUser.following.find(item => item.username === username);

  const text = following ? '팔로잉' : '팔로우';

  const handleFollow = async () => {
    setIsFetching(true);
    await toggleFollow(user.id, !following);
    setIsFetching(false);
    startTransition(() => {
      router.refresh();
    })
  }

  return (
    <>
      {showButton && (
        <div className='relative'>
          {isUpdating && <div className='absolute z-20 inset-0 flex justify-center items-center'>
            <PulseLoader size={6} />
          </div>}
          <Button
            disabled={isUpdating}
            text={text}
            onClick={handleFollow}
            red={text === '팔로잉'}
          />
        </div>
      )}
    </>
  );
}

