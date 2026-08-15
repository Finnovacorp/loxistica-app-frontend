import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCode } from '../../lib/auth.js';
import { useAuth } from '../../hooks/useAuth.jsx';

export default function Callback() {
    const { login, isOpsManager } = useAuth();
    const navigate = useNavigate();
    const [error, setError]     = useState(null);
    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;

        const params = new URLSearchParams(window.location.search);
        const code   = params.get('code');
        const state  = params.get('state');
        const errParam = params.get('error');

        // Clear the code from the URL immediately
        window.history.replaceState({}, '', window.location.pathname);

        if (errParam) {
            setError(params.get('error_description') ?? 'OAuth error. Please try again.');
            return;
        }

        if (!code) {
            setError('No authorization code received.');
            return;
        }

        const savedState = sessionStorage.getItem('oauth_state');
        if (state !== savedState) {
            setError('Invalid state parameter. Please try again.');
            return;
        }
        sessionStorage.removeItem('oauth_state');

        (async () => {
            try {
                const tokens = await exchangeCode(code);
                const user   = await login(tokens.access_token, tokens.refresh_token);

                const roles   = user.roles ?? [];
                const allowed = roles.includes('Field Staff') || roles.includes('Operations Manager');

                if (!allowed) {
                    setError('Your account has not been set up for access. Please contact your administrator.');
                    return;
                }

                const dest = roles.includes('Operations Manager')
                    ? '/operations/dashboard'
                    : '/tasks';

                navigate(dest, { replace: true });
            } catch (e) {
                setError(e.message ?? 'Authentication failed.');
            }
        })();
    }, []);

    if (error) {
        return (
            <div style={S.wrap}>
                <div style={S.box}>
                    <div style={S.icon}>⚠</div>
                    <div style={S.title}>Sign-in failed</div>
                    <div style={S.msg}>{error}</div>
                    <button style={S.btn} onClick={() => navigate('/', { replace: true })}>
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={S.wrap}>
            <div style={S.box}>
                <div style={{ ...S.icon, color: 'var(--primary)' }}>▦</div>
                <div style={S.title}>Signing in…</div>
                <div style={S.msg}>Please wait while we verify your credentials.</div>
            </div>
        </div>
    );
}

const S = {
    wrap: {
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg)',
    },
    box: {
        textAlign: 'center', padding: '40px 32px',
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderTop: '3px solid var(--primary)', borderRadius: 6,
        boxShadow: 'var(--shadow-lg)', maxWidth: 340, width: '100%',
    },
    icon: { fontSize: 32, marginBottom: 12, color: 'var(--amber)' },
    title: { fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 8 },
    msg: { fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 20 },
    btn: {
        padding: '10px 24px', background: 'var(--primary)', color: '#ffffff',
        border: 'none', borderRadius: 3, fontFamily: 'var(--mono)',
        fontSize: 13, cursor: 'pointer',
    },
};
