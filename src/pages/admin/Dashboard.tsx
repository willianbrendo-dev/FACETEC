import { useAcademicStore } from '../../store/academicStore';

export const AdminDashboard = () => {
    const { courses, users, classes } = useAcademicStore();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Total de Cursos</p>
                    <p className="text-3xl font-bold text-primary-600 mt-2">{courses.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Turmas Ativas</p>
                    <p className="text-3xl font-bold text-primary-600 mt-2">{classes.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Total de Usuários</p>
                    <p className="text-3xl font-bold text-primary-600 mt-2">{users.length}</p>
                </div>
            </div>
        </div>
    );
};
