import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Login } from './Login';

export function ProtectedRoute({ children }) {
    const { user, loading, isApproved } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    // If no user, show Login screen
    // We render Login directly instead of redirecting to a /login route 
    // to keep the URL structure clean if desired, or we can redirect.
    // Given the existing App structure uses conditional rendering for Login often, 
    // let's stick to rendering Login if not auth.
    if (!user) {
        return <Login />;
    }

    // Optional: Check for approval if your app requires it
    // if (!isApproved) {
    //   return <div>Account pending approval...</div>;
    // }

    return children;
}
