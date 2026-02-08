import React, { useState } from 'react';
import { useAcademicStore } from '../../store/academicStore';
import { Card, Button, Table, Badge, Modal } from '../../components/ui';
import { Plus, Users } from 'lucide-react';
import type { Class } from '../../types';

export const AdminClasses = () => {
    // Removing unused imports (courses is used? no, allSubjects is alias for subjects)
    const { classes, subjects: allSubjects, users, addClass, enrollStudent, enrollments } = useAcademicStore();
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

    // Create Class State
    const [newClass, setNewClass] = useState<Partial<Class>>({ subjectId: '', professorId: '', room: '', schedule: '', term: '', status: 'active' });

    // Enrollment State
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');

    const professors = users.filter(u => u.role === 'professor');
    const students = users.filter(u => u.role === 'student');

    const handleCreateClass = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClass.subjectId) return;

        addClass({
            id: crypto.randomUUID(),
            subjectId: newClass.subjectId,
            professorId: newClass.professorId || 'unassigned',
            room: newClass.room || 'TBD',
            schedule: newClass.schedule || 'TBD',
            term: newClass.term || '2024-1',
            status: 'active'
        } as Class);

        setIsClassModalOpen(false);
        setNewClass({ subjectId: '', professorId: '', room: '', schedule: '', term: '', status: 'active' });
    };

    const handleEnrollStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClassId || !selectedStudentId) return;

        // Check if already enrolled
        const exists = enrollments.some(e => e.classId === selectedClassId && e.studentId === selectedStudentId);
        if (!exists) {
            enrollStudent(selectedStudentId, selectedClassId);
        } else {
            alert('Aluno já matriculado!');
        }
        setIsEnrollModalOpen(false);
        setSelectedStudentId('');
    };

    const activeClasses = classes;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestão de Turmas</h1>
                    <p className="text-gray-500">Agende aulas e gerencie matrículas.</p>
                </div>
                <Button onClick={() => setIsClassModalOpen(true)}>
                    <Plus className="w-4 h-4" /> Abrir Nova Turma
                </Button>
            </div>

            <Card>
                <Table headers={['Disciplina', 'Professor', 'Horário', 'Sala', 'Matrículas', 'Status', 'Ações']}>
                    {activeClasses.map(cls => {
                        const subject = allSubjects.find(s => s.id === cls.subjectId);
                        const professor = users.find(u => u.id === cls.professorId);
                        const classEnrollments = enrollments.filter(e => e.classId === cls.id).length;

                        return (
                            <tr key={cls.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {subject?.name} <span className="text-gray-400 font-normal">({subject?.code})</span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{professor?.name || 'Não Atribuído'}</td>
                                <td className="px-6 py-4 text-gray-600 text-sm">{cls.schedule}</td>
                                <td className="px-6 py-4 text-gray-600">{cls.room}</td>
                                <td className="px-6 py-4 font-mono text-center">{classEnrollments}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={cls.status === 'active' ? 'green' : 'gray'}>{cls.status === 'active' ? 'Ativo' : 'Inativo'}</Badge>
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <Button size="sm" variant="secondary" onClick={() => {
                                        setSelectedClassId(cls.id);
                                        setIsEnrollModalOpen(true);
                                    }}>
                                        <Users className="w-3 h-3" /> Matricular
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </Table>
            </Card>

            {/* CREATE CLASS MODAL */}
            <Modal isOpen={isClassModalOpen} onClose={() => setIsClassModalOpen(false)} title="Abrir Nova Turma">
                <form onSubmit={handleCreateClass} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            value={newClass.subjectId}
                            onChange={e => setNewClass({ ...newClass, subjectId: e.target.value })}
                            required
                        >
                            <option value="">Selecione a Disciplina...</option>
                            {allSubjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Professor</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            value={newClass.professorId}
                            onChange={e => setNewClass({ ...newClass, professorId: e.target.value })}
                        >
                            <option value="">Selecione o Professor...</option>
                            {professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="ex: Seg 10:00"
                                value={newClass.schedule}
                                onChange={e => setNewClass({ ...newClass, schedule: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sala</label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Lab 1"
                                value={newClass.room}
                                onChange={e => setNewClass({ ...newClass, room: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsClassModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Abrir Turma</Button>
                    </div>
                </form>
            </Modal>

            {/* ENROLL STUDENT MODAL */}
            <Modal isOpen={isEnrollModalOpen} onClose={() => setIsEnrollModalOpen(false)} title="Matricular Aluno">
                <form onSubmit={handleEnrollStudent} className="space-y-4">
                    <p className="text-sm text-gray-500">Selecione um aluno para matricular na turma selecionada.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Aluno</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            value={selectedStudentId}
                            onChange={e => setSelectedStudentId(e.target.value)}
                            required
                        >
                            <option value="">Selecione o Aluno...</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsEnrollModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Matricular</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
