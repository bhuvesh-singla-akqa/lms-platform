'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function ManageUserRoles() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'viewer' as 'viewer' | 'contentAdmin' | 'admin',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingUsers, setExistingUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showUsersList, setShowUsersList] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/unauthorized');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchExistingUsers();
    }
  }, [user]);

  const fetchExistingUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const users = await response.json();
        setExistingUsers(users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        const action = result.action === 'updated' ? 'updated' : 'added';
        toast.success(`User role ${action} successfully!`);
        setFormData({
          name: '',
          email: '',
          role: 'viewer',
        });
        fetchExistingUsers(); // Refresh the user list
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to manage user');
      }
    } catch (error) {
      toast.error('Error: Failed to manage user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, role: newRole }),
      });

      if (response.ok) {
        toast.success('User role updated successfully!');
        fetchExistingUsers(); // Refresh the user list
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update user role');
      }
    } catch (error) {
      toast.error('Error: Failed to update user role');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-600 text-xl font-semibold mb-4'>
            Access Denied
          </div>
          <p className='text-gray-600 mb-4'>
            You don&apos;t have permission to manage users.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (user && user.role === 'admin') {
    if (loading) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-white'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
        </div>
      );
    }

    if (!user) {
      return null;
    }

    return (
      <div className='min-h-screen relative flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100'>
        {/* Animated background shapes */}
        <div className='absolute inset-0 pointer-events-none z-0'>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 0.18, y: 0 }}
            transition={{ duration: 1.2 }}
            className='absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-3xl opacity-30 animate-pulse'
          />
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 0.15, x: 0 }}
            transition={{ duration: 1.5 }}
            className='absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-pink-400 to-yellow-300 rounded-full blur-3xl opacity-30 animate-pulse'
          />
          <motion.img
            src='/globe.svg'
            alt='Learning Globe'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1.8 }}
            className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] object-contain select-none pointer-events-none'
          />
        </div>
        <div className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full z-10'>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2 drop-shadow-lg'>
                User Role Management
              </h1>
              <p className='text-gray-600'>
                Assign roles to new users or update existing user permissions
              </p>
            </div>
          </motion.div>

          <div className='space-y-6'>
            {/* Role Assignment Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='bg-white/80 shadow rounded-lg backdrop-blur-md'
            >
              <div className='px-6 py-6'>
                <h2 className='text-lg font-medium text-gray-900 mb-6'>
                  Assign User Role
                </h2>
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Email Address *
                    </label>
                    <input
                      type='email'
                      id='email'
                      required
                      value={formData.email}
                      onChange={e =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                      placeholder="Enter user's email address"
                    />
                    <p className='mt-1 text-sm text-gray-500'>
                      If the user exists, their role will be updated. If not, a
                      new account will be created.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Full Name
                    </label>
                    <input
                      type='text'
                      id='name'
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                      placeholder="Enter user's full name (required only for new users)"
                    />
                    <p className='mt-1 text-sm text-gray-500'>
                      Only required when creating a new user account.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor='role'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Role *
                    </label>
                    <select
                      id='role'
                      value={formData.role}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          role: e.target.value as any,
                        })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value='viewer'>
                        Viewer - Can view training content
                      </option>
                      <option value='contentAdmin'>
                        Content Admin - Access to manage content
                      </option>
                      <option value='admin'>
                        Admin - Full access to manage all users and content
                      </option>
                    </select>
                  </div>

                  <div className='flex justify-end space-x-3'>
                    <motion.button
                      type='button'
                      onClick={() => router.push('/dashboard')}
                      className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type='submit'
                      disabled={isSubmitting}
                      className='bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      {isSubmitting ? 'Processing...' : 'Assign Role'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Existing Users Management */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className='bg-white/80 shadow rounded-lg backdrop-blur-md'
            >
              <div className='px-6 py-6'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-lg font-medium text-gray-900'>
                    Existing Users
                  </h2>
                  <motion.button
                    onClick={() => setShowUsersList(!showUsersList)}
                    className='bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showUsersList ? 'Hide Users' : 'Show Users'}
                  </motion.button>
                </div>

                {showUsersList && (
                  <div className='space-y-4'>
                    {loadingUsers ? (
                      <p className='text-gray-500'>Loading users...</p>
                    ) : existingUsers.length === 0 ? (
                      <p className='text-gray-500'>No users found.</p>
                    ) : (
                      <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-200'>
                          <thead className='bg-gray-50'>
                            <tr>
                              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Name
                              </th>
                              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Email
                              </th>
                              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Current Role
                              </th>
                              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Update Role
                              </th>
                            </tr>
                          </thead>
                          <tbody className='bg-white divide-y divide-gray-200'>
                            {existingUsers.map(existingUser => (
                              <tr key={existingUser.id}>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                  {existingUser.name}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                  {existingUser.email}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      existingUser.role === 'contentAdmin'
                                        ? 'bg-red-100 text-red-800'
                                        : existingUser.role === 'admin'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-green-100 text-green-800'
                                    }`}
                                  >
                                    {existingUser.role}
                                  </span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                  <select
                                    onChange={e => {
                                      if (
                                        e.target.value !== existingUser.role
                                      ) {
                                        handleRoleUpdate(
                                          existingUser.id,
                                          e.target.value
                                        );
                                      }
                                    }}
                                    className='border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    defaultValue={existingUser.role}
                                  >
                                    <option value='viewer'>Viewer</option>
                                    <option value='contentAdmin'>
                                      Content Admin
                                    </option>
                                    <option value='admin'>Admin</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
}
