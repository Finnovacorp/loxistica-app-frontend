import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const FIELD_LINKS = [
    { path: '/tasks',  label: 'MY TASKS', icon: '▦' },
];

const OPS_LINKS = [
    { path: '/operations/dashboard',      label: 'DASHBOARD', icon: '◈' },
    { path: '/operations/order-tasks',    label: 'ORDERS',    icon: '≡' },
    { path: '/operations/generate-tasks', label: 'GENERATE',  icon: '⊕' },
    { path: '/operations/assign-task',    label: 'ASSIGN',    icon: '→' },
];

export default function AppLayout({ children }) {
    const { user, logout, isOpsManager } = useAuth();
    const navigate  = useNavigate();
    const location  = useLocation();
    const links     = isOpsManager ? OPS_LINKS : FIELD_LINKS;

    async function handleLogout() {
        await logout();
        navigate('/', { replace: true });
    }

    return (
        <div style={S.shell}>
            {/* ── Nav ── */}
            <nav style={S.nav}>
                <div style={S.logo}>
                    LOX<span style={{ opacity: 0.65 }}>ISTICA</span>
                </div>
                <div style={S.navRight}>
                    <div style={S.userBlock}>
                        <span style={S.userName}>{user?.name || user?.email}</span>
                        {user?.name && (
                            <span style={S.userEmail}>{user?.email}</span>
                        )}
                    </div>
                    <span style={{ ...S.badge, ...(isOpsManager ? S.badgeOps : {}) }}>
                        {isOpsManager ? 'OPS MGR' : 'FIELD'}
                    </span>
                    <button style={S.logoutBtn} onClick={handleLogout}>Sign out</button>
                </div>
            </nav>

            {/* ── Tabs ── */}
            <div style={S.tabBar}>
                {links.map(link => {
                    const active = location.pathname.startsWith(link.path);
                    return (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            style={{ ...S.tab, ...(active ? S.tabActive : {}) }}>
                            <span style={S.tabIcon}>{link.icon}</span>
                            {link.label}
                        </button>
                    );
                })}
            </div>

            {/* ── Content ── */}
            <main style={S.content}>{children}</main>
        </div>
    );
}

const S = {
    shell: {
        maxWidth: 480, margin: '0 auto', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', background: 'var(--bg)',
    },
    nav: {
        background: 'var(--primary)', borderBottom: '1px solid var(--green-800)',
        padding: '0 16px', height: 58, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,88,53,0.18)',
    },
    logo: {
        fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 16,
        letterSpacing: '0.1em', color: '#ffffff', flexShrink: 0,
    },
    navRight: { display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 },
    userBlock: {
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
        gap: 1, minWidth: 0, maxWidth: 160,
    },
    userName: {
        fontSize: 12, fontFamily: 'var(--sans)', fontWeight: 600, color: '#ffffff',
        maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    },
    userEmail: {
        fontSize: 10, fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.6)',
        maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    },
    badge: {
        fontSize: 9, fontFamily: 'var(--mono)', padding: '2px 7px', borderRadius: 2,
        background: 'rgba(255,255,255,0.15)', color: '#ffffff',
        border: '1px solid rgba(255,255,255,0.3)', letterSpacing: '0.06em',
        whiteSpace: 'nowrap', flexShrink: 0,
    },
    badgeOps: {
        background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.45)',
    },
    logoutBtn: {
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 3, color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--mono)',
        fontSize: 10, padding: '5px 10px', cursor: 'pointer',
        letterSpacing: '0.04em', whiteSpace: 'nowrap', flexShrink: 0,
    },
    tabBar: {
        display: 'flex', background: 'var(--bg2)',
        borderBottom: '2px solid var(--border)', flexShrink: 0, overflowX: 'auto',
    },
    tab: {
        flex: 1, minWidth: 70, padding: '10px 6px 9px',
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em',
        color: 'var(--text3)', cursor: 'pointer',
        borderBottom: '2px solid transparent', marginBottom: -2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        whiteSpace: 'nowrap', background: 'none', border: 'none',
        transition: 'color .2s',
    },
    tabActive: { color: 'var(--primary)', borderBottomColor: 'var(--primary)' },
    tabIcon: { fontSize: 14 },
    content: { flex: 1, overflowY: 'auto', padding: 16 },
};
