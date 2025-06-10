'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/nextjs';

interface CreateUserData {
  clerk_id: string;
  name: string;
  email: string;
}

export default function UserInterface() {
  const { getToken } = useAuth();
  const { isSignedIn, user } = useUser();
  const apiUrl = 'http://localhost:8000/api/go/users';

  useEffect(() => {
    if (isSignedIn && user) {
      checkAndCreateUser();
    }
  }, [isSignedIn, user]);

  const checkAndCreateUser = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const users = response.data || [];
      const exists = users.some((u: { email: string }) => u.email === user?.emailAddresses[0]?.emailAddress);

      if (!exists && user?.emailAddresses?.[0]?.emailAddress) {
        const newUser: CreateUserData = {
          clerk_id: user?.id || '',
          name: user?.firstName || user?.username || 'Unknown User',
          email: user?.emailAddresses[0]?.emailAddress || ''
        };
        await axios.post(apiUrl, newUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error('Error checking/creating user:', err);
    }
  };
  return null;
}
