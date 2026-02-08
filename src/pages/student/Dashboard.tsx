import { useAcademicStore } from '../../store/academicStore';
import { useAuthStore } from '../../store/authStore';
import { Card, Table, Badge } from '../../components/ui';
import { Calendar, GraduationCap } from 'lucide-react';

export const StudentDashboard = () => {
    const user = useAuthStore(state => state.user);
    const { getStudentClasses, subjects, grades, sessions, attendance } = useAcademicStore();

    const myClasses = user ? getStudentClasses(user.id) : [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Meu Painel</h1>
                <p className="text-gray-500">Bem-vindo(a), {user?.name}. Aqui está sua situação acadêmica.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary-600" />
                        <h2 className="font-semibold text-gray-900">Boletim Escolar</h2>
                    </div>
                    <Table headers={['Disciplina', 'Turma', 'Frequência', 'N1', 'N2', 'Média', 'Status']}>
                        {myClasses.map(cls => {
                            const subject = subjects.find(s => s.id === cls.subjectId);

                            // Logic for Grades
                            const n1Key = `${cls.id}_N1`;
                            const n2Key = `${cls.id}_N2`;
                            const n1 = grades.find(g => g.studentId === user?.id && g.assessmentId === n1Key)?.value;
                            const n2 = grades.find(g => g.studentId === user?.id && g.assessmentId === n2Key)?.value;
                            const avg = ((n1 || 0) * 0.5) + ((n2 || 0) * 0.5);
                            const hasGrade = n1 !== undefined || n2 !== undefined;
                            const passed = avg >= 6.0;

                            // Logic for Attendance
                            const classSessions = sessions.filter(s => s.classId === cls.id);
                            const totalSessions = classSessions.length;
                            const presentCount = attendance.filter(a => a.sessionId && classSessions.some(s => s.id === a.sessionId) && a.studentId === user?.id && a.present).length;
                            const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 100;

                            return (
                                <tr key={cls.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {subject?.name}
                                        <div className="text-xs text-gray-400 font-normal">{subject?.code}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {cls.schedule}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${attendanceRate < 75 ? 'text-red-500' : 'text-green-600'}`}>
                                            {attendanceRate}%
                                        </span>
                                        <span className="text-xs text-gray-400 ml-1">({presentCount}/{totalSessions})</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{n1 ?? '-'}</td>
                                    <td className="px-6 py-4 text-gray-600">{n2 ?? '-'}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {hasGrade ? avg.toFixed(1) : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {hasGrade ? (
                                            <Badge variant={passed ? 'green' : 'red'}>
                                                {passed ? 'Aprovado' : 'Reprovado'}
                                            </Badge>
                                        ) : (
                                            <Badge variant="blue">Em Andamento</Badge>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {myClasses.length === 0 && (
                            <tr><td colSpan={7} className="text-center py-8 text-gray-500">Você não está matriculado em nenhuma turma.</td></tr>
                        )}
                    </Table>
                </Card>
            </div>

            <div>
                <h2 className="font-bold text-lg text-gray-900 mb-4">Horário das Aulas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myClasses.map(cls => {
                        const subject = subjects.find(s => s.id === cls.subjectId);
                        return (
                            <div key={cls.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{subject?.name}</h4>
                                    <p className="text-sm text-gray-600">{cls.schedule}</p>
                                    <p className="text-xs text-gray-400 mt-1">{cls.room}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};
