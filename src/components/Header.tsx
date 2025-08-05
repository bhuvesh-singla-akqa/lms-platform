'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { SearchBar } from '@/components/SearchBar';
import { useAuth } from '@/lib/auth';
import { Menu, LogOut, X, Smartphone } from 'lucide-react';

export function Header() {
  console.log('Header rendered');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, loading, signIn, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Navigation links based on user role and authentication
  const getNavLinks = () => {
    if (!user) {
      return [];
    }

    const baseLinks = [
      { name: 'Categories', href: '/category' },
      { name: 'Calendar', href: '/calendar' },
    ];

    // Add role-specific links
    if (user.role === 'admin') {
      baseLinks.push({ name: 'Manage Users', href: '/add-user' });
      baseLinks.push({ name: 'Add Training', href: '/add-training' });
    } else if (user.role === 'contentAdmin') {
      baseLinks.push({ name: 'Add Training', href: '/add-training' });
    }
    // viewers only get the base links (Categories, Calendar)

    return baseLinks;
  };

  const navLinks = getNavLinks();

  const handleSignOut = async () => {
    console.log('Sign out button clicked');
    try {
      await signOut();
      console.log('signOut() completed');
    } catch (err) {
      console.error('signOut() error:', err);
    }
    setUserMenuOpen(false);
  };

  const handleSignIn = () => {
    signIn();
  };

  return (
    <>
      <header className='w-full bg-white shadow sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto flex items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-4'>
            <Link
              href={user ? '/dashboard' : '/'}
              className='flex items-center'
            >
              <Image
                src='/logo.svg'
                alt='LMS Platform'
                width={60}
                height={20}
                className='h-5 w-auto'
                priority
              />
            </Link>
            <nav className='hidden md:flex gap-4'>
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className='text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded transition-colors'
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className='flex items-center gap-3'>
            {user && (
              <div className='hidden md:block w-64'>
                <SearchBar />
              </div>
            )}

            {loading ? (
              <div className='w-8 h-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent'></div>
            ) : user ? (
              <div className='flex items-center gap-3'>
                {/* User Profile */}
                <div className='relative'>
                  <button
                    onClick={() => {
                      console.log('User menu button clicked');
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors'
                    aria-label='User menu'
                  >
                    <div className='w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm'>
                      {user.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                  </button>

                  {/* User dropdown menu */}
                  {userMenuOpen && (
                    <>
                      {/* Overlay */}
                      <div
                        className='fixed inset-0 z-10'
                        onClick={() => setUserMenuOpen(false)}
                      />
                      {/* Dropdown menu */}
                      <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20'>
                        <div className='px-4 py-3 border-b border-gray-100'>
                          <p className='text-sm font-medium text-gray-900'>
                            {user.name}
                          </p>
                          <p className='text-xs text-gray-500'>{user.email}</p>
                          <p className='text-xs text-blue-600 font-medium capitalize'>
                            {user.role}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className='flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg shadow transition-all duration-200 font-semibold'
                  aria-label='Sign out'
                >
                  <LogOut size={16} />
                  <span className='hidden sm:inline'>Sign Out</span>
                </button>
              </div>
            ) : (
              pathname !== '/' && (
                <button
                  onClick={handleSignIn}
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                >
                  Sign In with Google
                </button>
              )
            )}

            {/* Mobile Navigation Toggle */}
            <button
              className='md:hidden ml-2 p-2 rounded-lg hover:bg-gray-100 transition-colors'
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label='Toggle mobile menu'
            >
              {mobileOpen ? (
                <X size={24} className='text-gray-700' />
              ) : (
                <div className='flex items-center gap-1'>
                  <Menu size={20} className='text-gray-700' />
                  <Smartphone size={16} className='text-blue-600' />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileOpen && (
          <nav className='md:hidden bg-white border-t px-4 pb-4'>
            <div className='flex flex-col gap-2 py-2'>
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className='text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded transition-colors'
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {user && (
              <div className='w-full mt-2 pt-2 border-t border-gray-200'>
                <SearchBar />
              </div>
            )}
          </nav>
        )}
      </header>
    </>
  );
}
