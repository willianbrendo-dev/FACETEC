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
import logo from '../assets/logo.png';

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

    const NAV_ITEMS = {
        admin: [
            { to: "/admin/dashboard", icon: LayoutDashboard, label: "Painel" },
            { to: "/admin/courses", icon: BookOpen, label: "Cursos" },
            { to: "/admin/classes", icon: Calendar, label: "Turmas" },
            { to: "/admin/users", icon: Users, label: "Usuários" },
        ],
        professor: [
            { to: "/professor/dashboard", icon: LayoutDashboard, label: "Minhas Turmas" },
        ],
        student: [
            { to: "/student/dashboard", icon: LayoutDashboard, label: "Minhas Turmas" },
            { to: "/student/grades", icon: GraduationCap, label: "Boletim" },
        ]
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

    const userRole = user.role as keyof typeof NAV_ITEMS;
    const navLinks = NAV_ITEMS[userRole] || [];

    const SidebarContent = () => (
        <>
            <div className="p-6 flex items-center justify-center border-b border-gray-100">
                <img src={logo} alt="Sistema Acadêmico" className="max-h-12 w-auto object-contain" />
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4">
                    {user.role === 'admin' ? 'Gestão' : user.role === 'professor' ? 'Acadêmico' : 'Aprendizado'}
                </div>
                {navLinks.map((link) => (
                    <NavItem key={link.to} to={link.to} icon={link.icon}>
                        {link.label}
                    </NavItem>
                ))}
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
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-10 transition-all duration-300">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen flex flex-col transition-all duration-300 overflow-x-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Sistema Acadêmico" className="h-10 w-auto object-contain" />
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                <div className={clsx(
                    "fixed inset-0 z-40 md:hidden transition-opacity duration-300",
                    isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}>
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className={clsx(
                        "absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out",
                        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    )}>
                        <div className="relative flex-1 flex flex-col h-full">
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-50"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                            <SidebarContent />
                        </div>
                    </div>
                </div>

                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
