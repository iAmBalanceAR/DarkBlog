'use client';
import { User, MessageSquareText, LogOut  } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function UserBadge() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (status === 'loading') {
    return <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full"></div>;
  }

  if (!session) {
    return (
      <div className="flex gap-2">
        <Link 
          href="/auth/login"
         className="text-sm font-medium bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Login
        </Link>
        <Link 
          href="/auth/register"
          className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2"
      >
        {session.user?.profileImage ? (
          <img 
            src={session.user.profileImage} 
            alt={session.user.userName || ''} 
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            {session.user?.userName?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700">
          {session.user?.userName || 'User'}
        </span>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <User className="w-5 h-5 pr-1 float-left" /> Profle
            </Link>
            <Link
              href="/profile/comments"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <MessageSquareText  className="w-5 h-5 pr-1 float-left" /> My Comments
            </Link>
            <button
              onClick={() => signOut()}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <LogOut  className="w-5 h-5 pr-1 float-left" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 