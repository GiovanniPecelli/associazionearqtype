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
                        ? 'bg-gradient-to-br from-amber-900/50 to-yellow-900/50 border border-yellow-700 hover:border-yellow-500'
                        : 'bg-white/5 border border-white/10 hover:border-primary-500 hover:bg-white/10 hover:shadow-lg hover:shadow-primary-500/20'
                        }`}
                >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${isElite
                        ? 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-white'
                        : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                        }`}>
                        {isElite ? '👑' : stats.level}
                    </div>

                    {/* User Info - Hidden on small screens */}
                    <div className="hidden lg:flex flex-col items-start min-w-[100px]">
                        <span className={`text-xs font-bold leading-tight ${isElite
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400'
                            : 'text-gray-200'
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
                    <div className="absolute right-0 mt-2 w-72 bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden max-h-[85vh] flex flex-col ring-1 ring-black/5">
                        {/* Header with Stats - Scrollable */}
                        <div className={`p-4 flex-shrink-0 ${isElite
                            ? 'bg-gradient-to-br from-amber-900/50 to-yellow-900/50 border-b-2 border-yellow-700/50'
                            : 'bg-gradient-to-br from-primary-900/50 to-primary-800/50 border-b border-white/10'
                            }`}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md ${isElite
                                    ? 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-white'
                                    : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                                    }`}>
                                    {isElite ? <Icons.Crown className="w-6 h-6 text-white" /> : stats.level}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white truncate text-sm">
                                        {profile?.display_name || user?.email?.split('@')[0]}
                                    </h3>
                                    <p className={`text-xs font-semibold truncate ${isElite
                                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400'
                                        : 'text-primary-300'
                                        }`}>
                                        {stats.roleLevel}
                                    </p>
                                </div>
                            </div>

                            {/* Compact Stats */}
                            <div className="grid grid-cols-3 gap-1">
                                <div className="bg-gray-900/50 rounded px-2 py-1 text-center border border-white/5">
                                    <div className="text-[10px] text-gray-400 font-medium">Lv</div>
                                    <div className="text-sm font-bold text-white">{stats.level}</div>
                                </div>
                                <div className="bg-gray-900/50 rounded px-2 py-1 text-center border border-white/5">
                                    <div className="text-[10px] text-gray-400 font-medium">IP</div>
                                    <div className="text-sm font-bold text-purple-400">{stats.impactPoints}</div>
                                </div>
                                <div className="bg-gray-900/50 rounded px-2 py-1 text-center border border-white/5">
                                    <div className="text-[10px] text-gray-400 font-medium">XP</div>
                                    <div className="text-sm font-bold text-blue-400">{stats.xp}</div>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items - Scrollable if needed */}
                        <div className="py-2 overflow-y-auto flex-1">
                            <Link
                                to="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-all border-l-2 border-transparent hover:border-primary-500"
                            >
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Profile
                            </Link>
                            <Link
                                to="/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-all border-l-2 border-transparent hover:border-primary-500"
                            >
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </Link>
                            <Link
                                to="/home"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-all border-l-2 border-transparent hover:border-primary-500"
                            >
                                <Icons.Home className="w-5 h-5 text-gray-400 group-hover:text-primary-400" />
                                Guide
                            </Link>
                            <Link
                                to="/career"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-all border-l-2 border-transparent hover:border-primary-500"
                            >
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Career
                            </Link>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onSignOut();
                                }}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left border-t border-white/5 mt-1"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
