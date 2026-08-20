'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (!role) {
      router.push('/login');
    } else if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'motorista') {
      router.push('/motorista');
    } else {
      router.push('/cliente');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 font-medium">
      Redirecionando para o sistema...
    </div>
  );
}