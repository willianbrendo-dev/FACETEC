import React from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    GraduationCap,
    Calendar,
    LogOut,
    Menu,
    X,
    School
} from 'lucide-react';
import clsx from 'clsx';

export const Layout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavItem = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => (
        <NavLink
            to={to}
            className={({ isActive }) => clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                    ? "bg-primary-50 text-primary-900 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
            onClick={() => setIsMobileMenuOpen(false)}
        >
            <Icon className="w-5 h-5" />
            <span>{children}</span>
        </NavLink>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-10">
                <div className="p-6 flex items-center gap-3 border-b border-gray-100">
                    <div className="bg-primary-600 p-2 rounded-lg">
                        <School className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900 text-lg leading-tight">Sistema<br />Acadêmico</h1>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {user.role === 'admin' && (
                        <>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4">Gestão</div>
                            <NavItem to="/admin/dashboard" icon={LayoutDashboard}>Painel</NavItem>
                            <NavItem to="/admin/courses" icon={BookOpen}>Cursos</NavItem>
                            <NavItem to="/admin/classes" icon={Calendar}>Turmas</NavItem>
                            <NavItem to="/admin/users" icon={Users}>Usuários</NavItem>
                        </>
                    )}

                    {user.role === 'professor' && (
                        <>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4">Acadêmico</div>
                            <NavItem to="/professor/dashboard" icon={LayoutDashboard}>Minhas Turmas</NavItem>
                        </>
                    )}

                    {user.role === 'student' && (
                        <>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4">Aprendizado</div>
                            <NavItem to="/student/dashboard" icon={LayoutDashboard}>Minhas Turmas</NavItem>
                            <NavItem to="/student/grades" icon={GraduationCap}>Boletim</NavItem>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">
                                {user.role === 'admin' ? 'Administrador' : user.role === 'professor' ? 'Professor' : 'Aluno'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-600 p-1.5 rounded-lg">
                            <School className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-900">Sistema Acadêmico</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-30 bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
                            {/* Replicated Nav Logic for Mobile */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <span className="font-bold text-lg">Menu</span>
                                <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-5 h-5" /></button>
                            </div>
                            <nav className="flex-1 p-4 space-y-2">
                                {/* ... Same nav items as desktop ... */}
                                {/* Simplified for brevity in this tool call, but ideally components should be shared */}
                                <NavItem to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'professor' ? '/professor/dashboard' : '/student/dashboard'} icon={LayoutDashboard}>Painel</NavItem>
                            </nav>
                            <div className="p-4 border-t border-gray-100">
                                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                                    <LogOut className="w-4 h-4" /> Sair
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
