import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useGamification } from '../../context/GamificationContext';
import { motion } from 'framer-motion';
import { Icons } from '../common/Icons';

export function UserProfileMenu({ onSignOut }) {
    const { user, profile } = useAuth();
    const { stats } = useGamification();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const progress = Math.min((stats.xp / stats.nextLevelXp) * 100, 100);
    // Check if user has elite role (President, Secretary, Treasurer, Counselor, Host, etc)
    const isElite = [
        'president', 'secretary', 'treasurer', 'counselor',
        'host', 'founder', 'dev', 'hr', 'management', 'agent'
    ].includes(profile?.role?.toLowerCase());

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {/* Semi-transparent backdrop when menu is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className="relative" ref={menuRef}>
                {/* User Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${isElite
                        ? 'bg-gradient-to-br from-orange-50 to-orange-100 border border-[#c0672a]/30 hover:border-[#c0672a]/50'
                        : 'bg-white border border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm'
                        }`}
                >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${isElite
                        ? 'bg-gradient-to-br from-[#c0672a] to-orange-500 text-white'
                        : 'bg-gradient-to-br from-[#1a2b4b] to-blue-800 text-white'
                        }`}>
                        {isElite ? '👑' : stats.level}
                    </div>

                    {/* User Info - Hidden on small screens */}
                    <div className="hidden lg:flex flex-col items-start min-w-[100px]">
                        <span className={`text-xs font-bold leading-tight ${isElite
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#c0672a] to-orange-500'
                            : 'text-gray-900'
                            }`}>
                            {profile?.display_name || user?.email?.split('@')[0]}
                        </span>
                        <span className="text-[10px] text-gray-500 leading-tight">
                            {stats.roleLevel} • Lv.{stats.level}
                        </span>
                    </div>

                    {/* Chevron */}
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown Menu - Max 85vh height */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden max-h-[85vh] flex flex-col ring-1 ring-black/5">
                        {/* Header with Stats - Scrollable */}
                        <div className={`p-4 flex-shrink-0 ${isElite
                            ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-b border-[#c0672a]/20'
                            : 'bg-gradient-to-br from-gray-50 to-white border-b border-gray-100'
                            }`}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${isElite
                                    ? 'bg-gradient-to-br from-[#c0672a] to-orange-500 text-white'
                                    : 'bg-gradient-to-br from-[#1a2b4b] to-blue-800 text-white'
                                    }`}>
                                    {isElite ? <Icons.Crown className="w-6 h-6 text-white" /> : stats.level}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 truncate text-sm">
                                        {profile?.display_name || user?.email?.split('@')[0]}
                                    </h3>
                                    <p className={`text-xs font-semibold truncate ${isElite
                                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#c0672a] to-orange-500'
                                        : 'text-[#1a2b4b]'
                                        }`}>
                                        {stats.roleLevel}
                                    </p>
                                </div>
                            </div>

                            {/* Compact Stats */}
                            <div className="grid grid-cols-3 gap-1">
                                <div className="bg-white rounded px-2 py-1 text-center border border-gray-100 shadow-sm">
                                    <div className="text-[10px] text-gray-500 font-medium">Lv</div>
                                    <div className="text-sm font-bold text-gray-900">{stats.level}</div>
                                </div>
                                <div className="bg-white rounded px-2 py-1 text-center border border-gray-100 shadow-sm">
                                    <div className="text-[10px] text-gray-500 font-medium">IP</div>
                                    <div className="text-sm font-bold text-[#c0672a]">{stats.impactPoints}</div>
                                </div>
                                <div className="bg-white rounded px-2 py-1 text-center border border-gray-100 shadow-sm">
                                    <div className="text-[10px] text-gray-500 font-medium">XP</div>
                                    <div className="text-sm font-bold text-[#1a2b4b]">{stats.xp}</div>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items - Scrollable if needed */}
                        <div className="py-2 overflow-y-auto flex-1">
                            <Link
                                to="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all border-l-2 border-transparent hover:border-[#1a2b4b]"
                            >
                                <Icons.User className="w-5 h-5 text-gray-400 group-hover:text-[#1a2b4b]" />
                                Profile
                            </Link>
                            <Link
                                to="/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all border-l-2 border-transparent hover:border-[#1a2b4b]"
                            >
                                <Icons.Settings className="w-5 h-5 text-gray-400 group-hover:text-[#1a2b4b]" />
                                Settings
                            </Link>
                            <Link
                                to="/home"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all border-l-2 border-transparent hover:border-[#1a2b4b]"
                            >
                                <Icons.Home className="w-5 h-5 text-gray-400 group-hover:text-[#1a2b4b]" />
                                Guide
                            </Link>
                            <Link
                                to="/career"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all border-l-2 border-transparent hover:border-[#1a2b4b]"
                            >
                                <Icons.Briefcase className="w-5 h-5 text-gray-400 group-hover:text-[#1a2b4b]" />
                                Career
                            </Link>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onSignOut();
                                }}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left border-t border-gray-100 mt-1"
                            >
                                <Icons.LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
