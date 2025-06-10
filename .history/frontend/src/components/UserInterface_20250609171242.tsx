'use client';

import { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import axios from 'axios';

export default function UserInterface() {
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const checkAndCreateUser = async () => {
      if (!user) return;

      const token = await getToken();
      const newUser = {
        id: user.id,
        fullName: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
      };

      try {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/go/users`, newUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Error ensuring user in database:', error);
      }
    };

    checkAndCreateUser();
  }, [user, getToken]);
  return null;
}
