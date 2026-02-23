import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated) {
            router.push('/');
            return;
        }

        if (user?.role !== 'admin') {
            router.push('/');
        }
    }, [isAuthenticated, user, router, loading]);

    if (loading || !isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-[#0d0d12] overflow-x-hidden relative">
            <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <main className={`flex-1 transition-transform duration-300 ${isOpen ? 'translate-x-56 lg:translate-x-0' : 'translate-x-0'}`}>
                {children}
            </main>
        </div>
    );
}
