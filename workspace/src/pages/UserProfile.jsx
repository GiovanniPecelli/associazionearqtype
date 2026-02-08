import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCompetencies } from '../hooks/useCompetencies';
import { CompetencyGrid } from '../components/competencies/CompetencyGrid';
import PageTransition from '../components/common/PageTransition';

function UserProfile() {
  const { userId } = useParams();
  const { allCompetencies, fetchUserCompetencies } = useCompetencies();
  const [profile, setProfile] = useState(null);
  const [userCompetencies, setUserCompetencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error(`Profile not found. ${error.message}`);
      }
      setProfile(data);

      // Load user competencies
      try {
        const comps = await fetchUserCompetencies(userId);
        setUserCompetencies(comps);
      } catch (err) {
        console.error('Error loading competencies:', err);
        setUserCompetencies([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, fetchUserCompetencies]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Caricamento profilo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">Errore: {error}</p>
          <Link to="/team" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            ← Torna al Team
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500">Profilo utente non trovato.</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profilo Utente</h1>
        <Link
          to="/team"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Torna al Team
        </Link>
      </div>

      {/* Profile Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg flex-shrink-0">
            {profile.display_name ? profile.display_name[0].toUpperCase() : profile.email[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.display_name || 'Utente'}
            </h2>
            <p className="text-gray-600 mt-1 text-sm md:text-base break-all">{profile.email}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 capitalize">
                {profile.role}
              </span>
              {profile.current_role_level && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {profile.current_role_level}
                </span>
              )}
              {profile.level && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Livello {profile.level}
                </span>
              )}
            </div>
          </div>
        </div>

        {profile.bio && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{profile.bio}</p>
          </div>
        )}

        {profile.skills && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
            <p className="text-gray-600">{profile.skills}</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Membro dal {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Gamification Stats */}
      {(profile.vibe_points !== undefined || profile.xp !== undefined) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Impact Points</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{profile.vibe_points || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Experience</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{profile.xp || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Task Completate</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {(profile.tasks_completed_simple || 0) + (profile.tasks_completed_medium || 0) + (profile.tasks_completed_hard || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Competencies Section */}
      {allCompetencies.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <CompetencyGrid
            userCompetencies={userCompetencies}
            allCompetencies={allCompetencies}
            showLocked={false}
          />
        </div>
      )}
    </PageTransition>
  );
}

export default UserProfile;
