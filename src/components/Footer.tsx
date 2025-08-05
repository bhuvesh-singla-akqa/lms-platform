'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export function Footer() {
  const { user } = useAuth();

  return (
    <footer className='w-full bg-gray-900 text-gray-300 py-8 mt-auto'>
      <div className='max-w-7xl mx-auto px-4'>
        <div
          className={`grid grid-cols-1 gap-8 ${user ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}
        >
          {/* Brand Section */}
          <div className='col-span-1 md:col-span-2'>
            <div className='mb-3'>
              <Image
                src='/logo.svg'
                alt='LMS Platform'
                width={75}
                height={25}
                className='h-6 w-auto brightness-0 invert'
              />
            </div>
            <p className='text-gray-400 text-sm mb-4 max-w-md'>
              A modern Learning Management System designed to streamline
              training and education. Access courses, track progress, and manage
              content all in one place.
            </p>
            <div className='flex gap-4'>
              <a
                href='https://github.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-white transition-colors'
                aria-label='GitHub'
              >
                <Github size={20} />
              </a>
              <a
                href='https://twitter.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-blue-400 transition-colors'
                aria-label='Twitter'
              >
                <Twitter size={20} />
              </a>
              <a
                href='https://linkedin.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-blue-500 transition-colors'
                aria-label='LinkedIn'
              >
                <Linkedin size={20} />
              </a>
              <a
                href='mailto:support@lms-platform.com'
                className='text-gray-400 hover:text-green-400 transition-colors'
                aria-label='Email'
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Platform Links - Only show when user is authenticated */}
          {user && (
            <div>
              <h4 className='text-white font-semibold mb-3'>Platform</h4>
              <div className='space-y-2'>
                <Link
                  href='/category'
                  className='block text-gray-400 hover:text-white text-sm transition-colors'
                >
                  Browse Categories
                </Link>
                <Link
                  href='/calendar'
                  className='block text-gray-400 hover:text-white text-sm transition-colors'
                >
                  Training Calendar
                </Link>
                <Link
                  href='/dashboard'
                  className='block text-gray-400 hover:text-white text-sm transition-colors'
                >
                  Dashboard
                </Link>
                {(user.role === 'contentAdmin' || user.role === 'admin') && (
                  <>
                    <Link
                      href='/add-training'
                      className='block text-gray-400 hover:text-white text-sm transition-colors'
                    >
                      Add Training
                    </Link>
                    <Link
                      href='/category'
                      className='block text-gray-400 hover:text-white text-sm transition-colors'
                    >
                      Categories
                    </Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <Link
                    href='/add-user'
                    className='block text-gray-400 hover:text-white text-sm transition-colors'
                  >
                    Manage Users
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Support Links */}
          <div>
            <h4 className='text-white font-semibold mb-3'>Support</h4>
            <div className='space-y-2'>
              <Link
                href='/help'
                className='block text-gray-400 hover:text-white text-sm transition-colors'
              >
                Help Center
              </Link>
              <Link
                href='/contact'
                className='block text-gray-400 hover:text-white text-sm transition-colors'
              >
                Contact Us
              </Link>
              <Link
                href='/privacy'
                className='block text-gray-400 hover:text-white text-sm transition-colors'
              >
                Privacy Policy
              </Link>
              <Link
                href='/terms'
                className='block text-gray-400 hover:text-white text-sm transition-colors'
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className='border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-gray-400 text-sm'>
            © {new Date().getFullYear()} AKQA LMS Platform. All rights
            reserved.
          </p>
          <p className='text-gray-400 text-sm mt-2 md:mt-0'>
            For better learning experiences
          </p>
        </div>
      </div>
    </footer>
  );
}
