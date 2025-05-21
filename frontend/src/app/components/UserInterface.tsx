import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardComponent from './CardComponent';

interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

interface UserInterfaceProps {
    backendName: string; // go backend name
}

const UserInterface: React.FC<UserInterfaceProps> = ({ backendName }) => {
    const apiUrl = `http://localhost:8000/api/go/users`;
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<User>({id: '', name: '', email: '', password: ''});
    const [updateUser, setUpdateUser] = useState<User | null>(null);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get<User[]>(apiUrl);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users');
            }
        };
        fetchUsers();
    }, [apiUrl]);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            const response = await axios.post(apiUrl, newUser);
            setUsers([...users, response.data]);
            setNewUser({id: '', name: '', email: '', password: ''});
            setSuccess('User created successfully!');
        } catch (error: any) {
            console.error('Error creating user:', error);
            setError(error.response?.data?.error || 'Failed to create user');
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <CardComponent key={user.id} card={user} />
                ))}
            </div>
        </div>
    );
};

export default UserInterface;
    