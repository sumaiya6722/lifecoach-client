'use client';

import { authClient } from '../../lib/auth-client';
import { Avatar } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../components/ThemeToggle'; // Adjust path if your file location differs

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isAdmin = user?.role === 'admin';

  // Links for Regular Users
  const userLinks = (
    <>
      <li>
        <Link href="/" className={pathname === '/' ? "text-emerald-600 font-semibold" : 'text-gray-600 dark:text-gray-300'}>
          Home
        </Link>
      </li>
      <li>
        <Link href="/components/dashboard/add-lesson" className={pathname === '/components/dashboard/add-lesson' ? "text-emerald-600 font-semibold" : 'text-gray-600 dark:text-gray-300'}>
          Add Lesson
        </Link>
      </li>
      <li>
        <Link href="/components/dashboard/my-lessons" className={pathname === '/components/dashboard/my-lessons' ? "text-emerald-600 font-semibold" : 'text-gray-600 dark:text-gray-300'}>
          My Lessons
        </Link>
      </li>
      <li>
        <Link href="/components/dashboard/my-favorites" className={pathname === '/components/dashboard/my-favorites' ? "text-emerald-600 font-semibold" : 'text-gray-600 dark:text-gray-300'}>
          My Favorites
        </Link>
      </li>
      <li>
        <Link href="/pricing" className={pathname === '/pricing' ? "text-emerald-600 font-semibold" : 'text-gray-600 dark:text-gray-300'}>
          Pricing
        </Link>
      </li>
    </>
  );

  // Links for Admins
  const adminLinks = (
    <>
      <li>
        <Link href="/" className={pathname === '/' ? "text-emerald-600 font-semibold" : 'text-gray-600 dark:text-gray-300'}>
          Home
        </Link>
      </li>
      <li>
        <Link href="/components/dashboard/admin" className={pathname === '/components/dashboard/admin' ? "text-emerald-600 font-semibold" : 'text-gray-600 dark:text-gray-300'}>
          Admin Dashboard
        </Link>
      </li>
      <li>
        <Link href="/components/dashboard/admin/manage-user" className={pathname === '/components/dashboard/manage-users' ? "text-emerald-600 font-semibold" : 'text-gray-600 dark:text-gray-300'}>
          Manage Users
        </Link>
      </li>
      <li>
        <Link href="/components/dashboard/admin/manage-lessons" className={pathname === '/components/dashboard/manage-lessons' ? "text-emerald-600 font-semibold" : 'text-gray-600 dark:text-gray-300'}>
          Manage Lessons
        </Link>
      </li>
      <li>
        <Link href="/components/dashboard/admin/reported-lessons" className={pathname === '/components/dashboard/reported-lessons' ? "text-emerald-600 font-semibold" : 'text-gray-600 dark:text-gray-300'}>
          Reported Lessons
        </Link>
      </li>
    </>
  );

  const signOut = async () => {
    await authClient.signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 pb-2 bg-transparent mb-10">
      {/* Floating Card Container with Dark Mode support */}
      <div className="navbar max-w-7xl mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-100 dark:border-gray-800 rounded-md shadow-sm px-4 sm:px-6 py-2 transition-colors">

        {/* Navbar Start: Logo + Mobile Hamburger */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden pl-0 pr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 dark:bg-gray-800 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              {isAdmin ? adminLinks : userLinks}
            </ul>
          </div>

          {/* lifeCoach Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-extrabold text-xl group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-gray-900 dark:text-white tracking-tight leading-none">
                life<span className="text-amber-500">Coach</span>
              </span>
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 tracking-wider uppercase leading-tight">
                Digital Wisdom
              </span>
            </div>
          </Link>
        </div>

        {/* Navbar Center: Desktop Links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2 text-sm font-medium">
            {isAdmin ? adminLinks : userLinks}
          </ul>
        </div>

        {/* Navbar End: Theme Toggle, Auth Buttons & User Avatar */}
        <div className="navbar-end flex items-center gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {user ? (
            <>
              {/* User Avatar Dropdown */}
              <div className="dropdown dropdown-end">
                <div className="flex items-center gap-2">
                  <h2 className="hidden sm:block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Hi, {user.name}!
                  </h2>
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-emerald-500/20">
                    <Avatar>
                      <Avatar.Image referrerPolicy="no-referrer" alt={user?.name || "User"} src={user?.image} />
                      <Avatar.Fallback>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</Avatar.Fallback>
                    </Avatar>
                  </div>
                </div>

                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-lg bg-white dark:bg-gray-800 rounded-box w-56 border border-gray-100 dark:border-gray-700">
                  <li className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between p-0">
                      <p className="font-bold text-gray-800 dark:text-white p-0">{user?.name}</p>
                      {isAdmin && <span className="badge badge-sm badge-warning text-xs font-bold">Admin</span>}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 p-0 truncate">{user?.email}</p>
                  </li>

                  {/* Dropdown Options */}
                  {isAdmin ? (
                    <>
                      <li className="mt-2"><Link href="/components/dashboard/admin">Admin Dashboard</Link></li>
                      <li><Link href="/components/dashboard/admin/manage-user">Manage Users</Link></li>
                      <li><Link href="/components/dashboard/admin/manage-lessons">Manage Lessons</Link></li>
                      <li><Link href="/components/dashboard/admin/reported-lessons">Reported Lessons</Link></li>
                      <li><Link href="/components/dashboard/admin/profile">Admin Profile</Link></li>
                    </>
                  ) : (
                    <>
                      <li className="mt-2"><Link href="/components/dashboard">Dashboard</Link></li>
                      <li><Link href="/components/dashboard/add-lesson">Add Lesson</Link></li>
                      <li><Link href="/components/dashboard/my-lessons">My Lessons</Link></li>
                      <li><Link href="/components/dashboard/userProfile">My Profile</Link></li>
                      <li>
                        <Link href="/components/dashboard/my-favorites" className="flex items-center justify-between">
                          My Favorites
                          <span className="badge badge-sm badge-rose">New</span>
                        </Link>
                      </li>
                    </>
                  )}

                  <li className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                    <button onClick={signOut} className="text-error hover:bg-error/10 w-full text-left">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>

              {/* Direct Sign Out Button */}
              <button
                onClick={signOut}
                className="btn btn-sm bg-[#0b1b3d] dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-medium rounded-full px-5 shadow-md border-none transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost font-xl text-gray-700 dark:text-gray-200 hover:text-amber-600">
                Log In
              </Link>
              <Link href="/signup" className="btn btn-sm bg-[#0b1b3d] dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-medium rounded-full px-6 shadow-md border-none">
                Join Us
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;