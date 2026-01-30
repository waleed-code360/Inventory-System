import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
    const { logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'bg-indigo-700 text-white shadow-lg' : 'text-indigo-100 hover:bg-indigo-600';

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-indigo-800 text-white flex flex-col shadow-xl">
                <div className="p-6 text-2xl font-bold tracking-tight border-b border-indigo-700/50">
                    Nexus<span className="text-indigo-300">Inventory</span>
                </div>
                <nav className="flex-1 p-4 space-y-3">
                    <Link to="/" className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/')}`}>
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link to="/inventory" className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/inventory')}`}>
                        <Package size={20} />
                        <span className="font-medium">Inventory</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-indigo-700/50">
                    <button onClick={logout} className="flex items-center space-x-3 px-4 py-3 w-full text-indigo-200 hover:text-white hover:bg-indigo-700 rounded-xl transition">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm p-6 flex justify-between items-center sticky top-0 z-10 hidden">
                    {/* Header content if needed */}
                </header>
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
