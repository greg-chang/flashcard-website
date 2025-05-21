import { useState, useEffect } from 'react';
import axios from 'axios';
import CardComponent from './CardComponent';

interface User {
    id: string;  // This will be a UUID string
    name: string;
    email: string;
    password: string;
}

interface CreateUserData {
    name: string;
    email: string;
    password: string;
}

export default function UserInterface() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newUser, setNewUser] = useState<CreateUserData>({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const apiUrl = 'http://localhost:8000/api/go/users';

    useEffect(() => {
        fetchUsers();
    }, [apiUrl]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await axios.get<User[]>(apiUrl);
            setUsers(response.data || []); // Ensure we always set an array
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users');
            setUsers([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            const response = await axios.post<User>(apiUrl, newUser);
            if (response.data) {
                setUsers(prevUsers => [...prevUsers, response.data]);
                setNewUser({
                    name: '',
                    email: '',
                    password: ''
                });
                setSuccess('User created successfully!');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Failed to create user');
            } else {
                setError('Failed to create user');
            }
            console.error('Error creating user:', err);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            
            {/* Create User Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Create New User</h2>
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
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={newUser.name}
                            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Create User
                    </button>
                </form>
            </div>
            
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
    