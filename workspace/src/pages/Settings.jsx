import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useSystemSettings } from '../contexts/SystemSettingsContext';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';

export default function Settings() {
    const { user, profile, isHost } = useAuth();
    const { signupEnabled, toggleSignup, loading: sysLoading } = useSystemSettings();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        display_name: '',
        bio: '',
        skills: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                display_name: profile.display_name || '',
                bio: profile.bio || '',
                skills: profile.skills || ''
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    display_name: formData.display_name,
                    bio: formData.bio,
                    skills: formData.skills
                })
                .eq('id', user.id);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch (error) {
            console.error('Error updating settings:', error);
            setMessage({ type: 'error', text: 'Error saving settings: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400 mt-1">Manage your profile and preferences</p>
                </div>
                <Link
                    to="/profile"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    ← Back to Profile
                </Link>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/10 p-6">
                <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 border ${message.type === 'success' ? 'bg-green-900/30 text-green-300 border-green-500/30' : 'bg-red-900/30 text-red-300 border-red-500/30'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="display_name" className="block text-sm font-medium text-gray-300 mb-1">
                            Display Name
                        </label>
                        <input
                            type="text"
                            id="display_name"
                            name="display_name"
                            value={formData.display_name}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">This name will be visible to the team.</p>
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                            Bio / About Me
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows="3"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us something about yourself..."
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-1">
                            Skills & Expertise
                        </label>
                        <input
                            type="text"
                            id="skills"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="e.g. React, Design, Project Management (comma separated)"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Note: Official competencies are managed separately and visible on your profile.
                        </p>
                    </div>

                    <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                        <h3 className="text-sm font-bold text-gray-300 mb-2 uppercase">Account Information</h3>
                        <div className="space-y-1 text-sm text-gray-400">
                            <p><span className="font-medium text-gray-300">Email:</span> {user?.email}</p>
                            <p><span className="font-medium text-gray-300">Role:</span> <span className="capitalize">{profile?.role}</span></p>
                            <p><span className="font-medium text-gray-300">Level:</span> {profile?.level}</p>
                        </div>
                    </div>

                    {/* System Controls moved to Admin Menu in Navbar */}

                    <div className="flex justify-end pt-4 border-t border-white/10">
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </PageTransition>
    );
}
