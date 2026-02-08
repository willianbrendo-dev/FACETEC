import { useNavigate } from 'react-router-dom';
import { useAcademicStore } from '../../store/academicStore';
import { useAuthStore } from '../../store/authStore';
import { Card, Badge, Button } from '../../components/ui';
import { Calendar, Users, ArrowRight, BookOpen } from 'lucide-react';

export const ProfessorDashboard = () => {
    const user = useAuthStore(state => state.user);
    const { getProfessorClasses, subjects } = useAcademicStore();
    const navigate = useNavigate();

    const myClasses = user ? getProfessorClasses(user.id) : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Minhas Turmas</h1>
                <p className="text-gray-500">Gerencie suas disciplinas e alunos atribuídos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myClasses.map(cls => {
                    const subject = subjects.find(s => s.id === cls.subjectId);
                    return (
                        <Card key={cls.id} className="hover:shadow-md transition-shadow">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-primary-100 rounded-lg text-primary-700">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <Badge variant={cls.status === 'active' ? 'green' : 'gray'}>{cls.status === 'active' ? 'Ativo' : 'Inativo'}</Badge>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{subject?.name}</h3>
                                    <p className="text-sm text-gray-500 font-mono">{subject?.code}</p>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>{cls.schedule}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Users className="w-4 h-4" />
                                        <span>{cls.room}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full mt-4"
                                    onClick={() => navigate(`/professor/class/${cls.id}`)}
                                >
                                    Gerenciar Turma <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    );
                })}
                {myClasses.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">Você ainda não tem turmas atribuídas.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
