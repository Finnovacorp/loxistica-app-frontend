import { createContext, useContext, useState, useEffect } from 'react';
import { TokenStore, revokeToken, fetchProfile } from '../lib/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]         = useState(null);
    const [checking, setChecking] = useState(true);

    // On mount: restore session from sessionStorage
    useEffect(() => {
        const token = TokenStore.get('access_token');
        const stored = TokenStore.getUser();
        if (token && stored) {
            setUser(stored);
        }
        setChecking(false);
    }, []);

    async function login(accessToken, refreshToken) {
        TokenStore.set('access_token', accessToken);
        TokenStore.set('refresh_token', refreshToken);

        const profile = await fetchProfile(accessToken);
        const u = {
            email: profile.email ?? profile.sub,
            name:  profile.name ?? '',
            roles: profile.roles ?? [],
        };
        TokenStore.setUser(u);
        setUser(u);
        return u;
    }

    async function logout() {
        await revokeToken();
        TokenStore.clear();
        setUser(null);
    }

    const isOpsManager = (user?.roles ?? []).includes('Operations Manager');

    return (
        <AuthContext.Provider value={{ user, checking, login, logout, isOpsManager }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
