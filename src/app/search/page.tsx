import UserSearch from '@/components/UserSearch';
import { Metadata } from 'next';
import React from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'User Search',
  description: 'Search users to follow'
}

export default function Searchpage() {
  return <UserSearch />
}

