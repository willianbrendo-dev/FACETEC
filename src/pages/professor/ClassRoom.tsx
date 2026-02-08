import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAcademicStore } from '../../store/academicStore';
import { Card, Button, Table, Badge, Modal } from '../../components/ui';
import { ChevronLeft, Plus, CheckCircle, XCircle } from 'lucide-react';
import type { ClassSession } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ProfessorClassRoom = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();
    const {
        classes, sessions, attendance, grades,
        addSession, markAttendance, gradeStudent, getClassDetails
    } = useAcademicStore();

    const [activeTab, setActiveTab] = useState<'lessons' | 'attendance' | 'grades'>('lessons');
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

    // New Session State
    const [newSession, setNewSession] = useState<Partial<ClassSession>>({ date: '', topic: '' });

    // Get Data
    if (!classId) return null;
    const { subject, course, students } = getClassDetails(classId);
    const classSessions = sessions.filter(s => s.classId === classId);

    // --- Handlers ---

    const handleCreateSession = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSession.date || !newSession.topic) return;
        addSession({
            id: crypto.randomUUID(),
            classId,
            date: newSession.date,
            topic: newSession.topic,
            description: newSession.description
        } as ClassSession);
        setIsSessionModalOpen(false);
        setNewSession({ date: '', topic: '' });
    };

    const handleAttendanceChange = (sessionId: string, studentId: string) => {
        const record = attendance.find(a => a.sessionId === sessionId && a.studentId === studentId);
        const wasPresent = record ? record.present : false;

        markAttendance(classId, sessionId, [{ studentId, present: !wasPresent }]);
    };

    const handleGradeChange = (studentId: string, type: 'N1' | 'N2', value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0 || numValue > 10) return;

        // We use a composite key for assessmentId to keep it simple uniqueness per class
        const assessmentKey = `${classId}_${type}`;

        gradeStudent({
            id: crypto.randomUUID(), // This ID strategy is flawed for updates but the store handles finding by student/assessment
            studentId,
            assessmentId: assessmentKey,
            value: numValue
        });
    };

    const currentClass = classes.find(c => c.id === classId);

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/professor/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{subject?.name}</h1>
                    <p className="text-gray-500">{course?.name} • {currentClass?.schedule}</p>
                </div>
            </div>

            {/* TABS */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-4">
                    {(['lessons', 'attendance', 'grades'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab === 'lessons' ? 'Aulas' : tab === 'attendance' ? 'Frequência' : 'Notas'}
                        </button>
                    ))}
                </nav>
            </div>

            {/* CONTENT: LESSONS */}
            {activeTab === 'lessons' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Conteúdo Programático</h3>
                        <Button onClick={() => setIsSessionModalOpen(true)}>
                            <Plus className="w-4 h-4" /> Nova Aula
                        </Button>
                    </div>
                    <Card>
                        <Table headers={['Data', 'Tópico', 'Descrição']}>
                            {classSessions.map(sess => (
                                <tr key={sess.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-sm text-gray-600">{format(new Date(sess.date), "d 'de' MMM", { locale: ptBR })}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{sess.topic}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{sess.description || '-'}</td>
                                </tr>
                            ))}
                            {classSessions.length === 0 && (
                                <tr><td colSpan={3} className="text-center py-8 text-gray-500">Nenhuma aula registrada.</td></tr>
                            )}
                        </Table>
                    </Card>

                    <Modal isOpen={isSessionModalOpen} onClose={() => setIsSessionModalOpen(false)} title="Registrar Nova Aula">
                        <form onSubmit={handleCreateSession} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                                <input type="date" className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                    value={newSession.date} onChange={e => setNewSession({ ...newSession, date: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tópico</label>
                                <input className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Ex: Introdução" value={newSession.topic} onChange={e => setNewSession({ ...newSession, topic: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
                                <textarea className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Detalhes da aula..." value={newSession.description || ''} onChange={e => setNewSession({ ...newSession, description: e.target.value })} />
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                                <Button type="button" variant="secondary" onClick={() => setIsSessionModalOpen(false)}>Cancelar</Button>
                                <Button type="submit">Registrar Aula</Button>
                            </div>
                        </form>
                    </Modal>
                </div>
            )}

            {/* CONTENT: ATTENDANCE */}
            {activeTab === 'attendance' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Registro de Frequência</h3>
                    </div>
                    <Card className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-gray-900 sticky left-0 bg-gray-50">Aluno</th>
                                    {classSessions.map(s => (
                                        <th key={s.id} className="px-4 py-3 font-medium text-gray-600 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs">{format(new Date(s.date), 'dd/MM')}</span>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 font-semibold text-gray-900 text-center">Freq. %</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {students.map(student => {
                                    const presentCount = attendance.filter(a => a.studentId === student.id && a.present && classSessions.some(s => s.id === a.sessionId)).length;
                                    const totalSessions = classSessions.length;
                                    const percentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 100;

                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white hover:bg-gray-50 border-r border-gray-100 shadow-sm">{student.name}</td>
                                            {classSessions.map(session => {
                                                const record = attendance.find(a => a.sessionId === session.id && a.studentId === student.id);
                                                const isPresent = record ? record.present : false;

                                                return (
                                                    <td key={session.id} className="px-4 py-4 text-center">
                                                        <button
                                                            onClick={() => handleAttendanceChange(session.id, student.id)}
                                                            className={`p-1 rounded-full transition-colors ${isPresent ? 'text-green-600 hover:bg-green-50' : 'text-red-300 hover:text-red-500 hover:bg-red-50'}`}
                                                        >
                                                            {isPresent ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                                        </button>
                                                    </td>
                                                );
                                            })}
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant={percentage < 75 ? 'red' : 'green'}>{percentage}%</Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </Card>
                </div>
            )}

            {/* CONTENT: GRADES */}
            {activeTab === 'grades' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Diário de Notas</h3>
                    </div>
                    <Card>
                        <Table headers={['Aluno', 'N1 (50%)', 'N2 (50%)', 'Média Final', 'Status']}>
                            {students.map(student => {
                                const n1Key = `${classId}_N1`;
                                const n2Key = `${classId}_N2`;
                                const n1 = grades.find(g => g.studentId === student.id && g.assessmentId === n1Key)?.value;
                                const n2 = grades.find(g => g.studentId === student.id && g.assessmentId === n2Key)?.value;

                                const avg = ((n1 || 0) * 0.5) + ((n2 || 0) * 0.5);
                                const hasGrade = n1 !== undefined || n2 !== undefined;
                                const passed = avg >= 6.0;

                                return (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                min="0" max="10" step="0.1"
                                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 outline-none text-center"
                                                placeholder="-"
                                                value={n1 ?? ''}
                                                onChange={e => handleGradeChange(student.id, 'N1', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                min="0" max="10" step="0.1"
                                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 outline-none text-center"
                                                placeholder="-"
                                                value={n2 ?? ''}
                                                onChange={e => handleGradeChange(student.id, 'N2', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-gray-800">
                                            {(hasGrade) ? avg.toFixed(1) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {hasGrade && (
                                                <Badge variant={passed ? 'green' : 'red'}>
                                                    {passed ? 'Aprovado' : 'Reprovado'}
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </Table>
                    </Card>
                </div>
            )}
        </div>
    );
};
