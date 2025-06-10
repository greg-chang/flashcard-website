import { useState, useEffect } from 'react';
import axios from 'axios';
import CardComponent from './CardComponent';
import { useAuth } from '@clerk/nextjs';
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';

interface User {
    id: string;
    name: string;
    email: string;
}

interface CreateUserData {
    clerk_id: string;
    name: string;
    email: string;
}

export default function UserInterface() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const { getToken } = useAuth();
    const { isSignedIn, user } = useUser();

    const apiUrl = 'http://localhost:8000/api/go/users';

    useEffect(() => {
        if (isSignedIn && user) {
            // Check if user exists in our database
            checkAndCreateUser();
        }
    }, [isSignedIn, user]);

    const checkAndCreateUser = async () => {
        try {
            setIsLoading(true);
            setError('');
            const token = await getToken();
            
            // First, try to get all users to check if this user exists
            const response = await axios.get<User[]>(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Check if user already exists in our database
            const users = response.data || [];
            const userExists = users.some(u => u.email === user?.emailAddresses[0]?.emailAddress);
            
            if (!userExists && user?.emailAddresses?.[0]?.emailAddress) {
                // Create new user if they don't exist
                const newUser: CreateUserData = {
                    clerk_id: user?.id || '',
                    name: user?.firstName || user?.username || 'Unknown User',
                    email: user.emailAddresses[0].emailAddress
                };

                await axios.post<User>(apiUrl, newUser, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSuccess('User created successfully!');
            }

            // Fetch updated user list
            await fetchUsers();
        } catch (err) {
            console.error('Error checking/creating user:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Failed to check/create user');
            } else {
                setError('Failed to check/create user');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            setError('');
            const token = await getToken();
            const response = await axios.get<User[]>(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users');
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isSignedIn) {
        return (
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome to Flashcard App</h1>
                <p className="mb-4">Please sign in to continue</p>
                <SignInButton mode="modal">
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Sign In
                    </button>
                </SignInButton>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">User Management</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Welcome, {user?.firstName || user?.username}</span>
                    <SignOutButton>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                            Sign Out
                        </button>
                    </SignOutButton>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}
            
            {/* Display Users */}
            {isLoading ? (
                <div className="text-center py-4">Loading users...</div>
            ) : error ? (
                <div className="text-center py-4 text-red-600">{error}</div>
            ) : !users || users.length === 0 ? (
                <div className="text-center py-4">No users found</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                        <CardComponent key={user.id} card={user} />
                    ))}
                </div>
            )}
        </div>
    );
}
    