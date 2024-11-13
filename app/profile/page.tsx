'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/header';
import { Hero } from '../components/hero';
import { Footer } from '@/app/components/footer';
import { Input } from '@/app/components/UI/input';
import { Button } from '@/app/components/UI/button';
import { Facebook, Instagram, Twitter, Linkedin, AlertCircle, User, Link as LinkIcon, Upload } from 'lucide-react';
import Image from 'next/image';
import { Comment } from '@/app/components/comments/comment';
import Layout from '@/app/components/layout';
import LoadingSpinner from '@/app/components/LoadingSpinner';

interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  user: {
    userName: string;
    profileImage?: string;
  };
  article: {
    title: string;
    slug: string;
  };
}

const SOCIAL_NETWORKS = [
  { name: 'Facebook', icon: Facebook, baseUrl: 'https://facebook.com/' },
  { name: 'Instagram', icon: Instagram, baseUrl: 'https://instagram.com/' },
  { name: 'Twitter', icon: Twitter, baseUrl: 'https://twitter.com/' },
  { name: 'LinkedIn', icon: Linkedin, baseUrl: 'https://linkedin.com/in/' },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    socialLink1: '',
    socialLink2: '',
    socialLink3: '',
    profileImage: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  // Single useEffect for initial data loading
  useEffect(() => {
    if (session?.user) {
      // Update form data
      setFormData({
        userName: session.user.userName || '',
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        email: session.user.email || '',
        socialLink1: session.user.socialLink1 || '',
        socialLink2: session.user.socialLink2 || '',
        socialLink3: session.user.socialLink3 || '',
        profileImage: session.user.profileImage || '',
      });

      // Fetch comments with error handling and cleanup
      let isMounted = true;
      
      const fetchComments = async () => {
        try {
          console.log('User ID:', session?.user?.id);
          const response = await fetch(`/api/comments/user/${session.user.id}`);
          if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response:', errorText);
            throw new Error('Failed to fetch comments');
          }
          const data = await response.json();
          console.log('Comments data:', data);
          if (isMounted) {
            setComments(data);
            setIsLoadingComments(false);
          }
        } catch (error) {
          console.error('Error fetching comments:', error);
          if (isMounted) {
            setError('Failed to load comments');
            setIsLoadingComments(false);
          }
        }
      };

      fetchComments();

      // Cleanup function
      return () => {
        isMounted = false;
      };
    }
  }, [session]);
    

  // Add authentication check in useEffect
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Return null while redirecting
  if (status === 'unauthenticated') {
    return null;
  }
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      setShowSuccess(true);
      setIsEditing(false);
      
      // Fade out success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleSocialNetworkSelect = (num: number, baseUrl: string) => {
    const linkKey = `socialLink${num}` as keyof typeof formData;
    setFormData({ ...formData, [linkKey]: baseUrl });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const { url } = await response.json();
      setFormData(prev => ({ ...prev, profileImage: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    }
  };

  const handleUpdateComment = async (id: string, content: string) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to update comment');

      const updatedComment: Comment = await response.json();
      setComments(comments.map((comment) => 
        comment.id === id ? { ...comment, content } : comment
      ));
      setSuccess('Comment updated successfully');
    } catch (error) {
      setError('Failed to update comment');
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      setComments(comments.filter((comment) => comment.id !== id));
      setSuccess('Comment deleted successfully');
    } catch (error) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', error);
    }
  };

  // View-only display component
  const ProfileView = () => (
    <div className="grid grid-cols-2 gap-8 text-lg">
      <div className="grid-cols-1">
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-black">Name</h3>
            <p className="mt-1 text-lg">{session?.user.firstName} {session?.user.lastName}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-black">Username</h3>
            <p className="mt-1 text-lg">@{session?.user.userName}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-black">Email</h3>
            <p className="mt-1 text-lg">{session?.user.email}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-black">Social Links</h3>
            <div className="mt-2 space-y-2">
              {SOCIAL_NETWORKS.map((network) => {
                const link = session?.user[`socialLink${SOCIAL_NETWORKS.indexOf(network) + 1}` as keyof typeof session.user];
                if (link && link.includes(network.baseUrl)) {
                  const Icon = network.icon;
                  return (
                    <a
                      key={network.name}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{network.name}</span>
                    </a>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="border-b pb-4 grid">
        <h3 className="text-2xl font-mono text-black">Profile Image</h3>
        <div className="mt-4">
          {session?.user.profileImage ? (
            <div className="relative float-right mr-32">
              <Image
                src={session.user.profileImage}
                alt={`${session.user.userName}'s profile`}
                width={275}
                height={275}
                className="rounded-full object-cover"
                priority
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        <Button
          type="button"
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );

  return (
    <Layout>
      <Header />
      <Hero />
      <main className="bg-white border-l-2 border-r-2 max-w-[1077px] container mx-auto px-4">
        <div className="mx-auto">
          <div className="p-4">
            <h1 className="text-4xl font-mono font-bold mb-6">Profile</h1>          
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {showSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700 animate-fade-out">
                <AlertCircle className="w-5 h-5" />
                {success}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      First Name
                    </label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Username
                  </label>
                  <Input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    disabled={true}
                    className="w-full bg-gray-50"
                  />
                  <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                </div>

                {/* Social Links */}
                {[1, 2, 3].map((num) => {
                  const linkKey = `socialLink${num}` as keyof typeof formData;
                  const currentValue = formData[linkKey];
                  let selectedNetwork = '';
                  if (currentValue?.includes('facebook.com')) selectedNetwork = 'Facebook';
                  if (currentValue?.includes('instagram.com')) selectedNetwork = 'Instagram';
                  if (currentValue?.includes('twitter.com')) selectedNetwork = 'Twitter';
                  if (currentValue?.includes('linkedin.com')) selectedNetwork = 'LinkedIn';

                  return (
                    <div key={num}>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Social Link {num}
                      </label>
                      <div className="flex gap-2">
                        <div className="relative w-48">
                          <select
                            value={selectedNetwork}
                            onChange={(e) => {
                              const selected = e.target.value;
                              if (selected === '') {
                                setFormData({ ...formData, [linkKey]: '' });
                                return;
                              }
                              const network = SOCIAL_NETWORKS.find(n => n.name === selected);
                              if (network) {
                                setFormData({ ...formData, [linkKey]: network.baseUrl });
                              }
                            }}
                            className="h-10 w-full pl-10 pr-8 py-2 rounded-md border border-gray-300 bg-white text-sm appearance-none"
                          >
                            <option value="">Select Network</option>
                            {SOCIAL_NETWORKS.map((network) => (
                              <option key={network.name} value={network.name}>
                                {network.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            {selectedNetwork && (
                              <span className="flex items-center">
                                {(() => {
                                  const NetworkIcon = SOCIAL_NETWORKS.find(n => n.name === selectedNetwork)?.icon;
                                  return NetworkIcon ? <NetworkIcon className="w-4 h-4" /> : null;
                                })()}
                              </span>
                            )}
                          </div>
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <Input
                          type="text"
                          value={currentValue}
                          onChange={(e) => setFormData({ ...formData, [linkKey]: e.target.value })}
                          className="flex-1"
                          placeholder="Full profile URL"
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Profile Image
                  </label>
                  <div className="mt-2 flex items-center gap-4">
                    {formData.profileImage ? (
                      <div className="relative w-32 h-32">
                        <Image
                          src={formData.profileImage}
                          alt="Profile preview"
                          width={128}
                          height={128}
                          className="rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <Upload className="w-5 h-5" />
                        <span>Upload new image</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <ProfileView />
            )}

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Recent Comments</h2>
              <div className="space-y-4">
                {isLoadingComments ? (
                  <div>Loading comments...</div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      id={comment.id}
                      content={comment.content}
                      userId={comment.userId}
                      userName={comment.user?.userName || 'Unknown User'}
                      profileImage={comment.user?.profileImage}
                      createdAt={comment.createdAt}
                      onDelete={handleDeleteComment}
                      onUpdate={handleUpdateComment}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Layout>
  );
}