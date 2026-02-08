import React, { useState } from 'react';
import { useAcademicStore } from '../../store/academicStore';
import { Card, Button, Table, Badge, Modal } from '../../components/ui';
import { Plus, BookOpen, Layers } from 'lucide-react';
import type { Course, Subject } from '../../types';

export const AdminCourses = () => {
    const { courses, subjects, addCourse, addSubject } = useAcademicStore();
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

    // Form State
    const [newCourse, setNewCourse] = useState<Partial<Course>>({ name: '', code: '', credits: 0 });
    const [newSubject, setNewSubject] = useState<Partial<Subject>>({ name: '', code: '', courseId: '' });

    const handleCreateCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCourse.name || !newCourse.code) return;
        addCourse({
            id: crypto.randomUUID(),
            name: newCourse.name,
            code: newCourse.code,
            credits: Number(newCourse.credits) || 0
        } as Course);
        setIsCourseModalOpen(false);
        setNewCourse({ name: '', code: '', credits: 0 });
    };

    const handleCreateSubject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubject.name || !newSubject.code || !newSubject.courseId) return;
        addSubject({
            id: crypto.randomUUID(),
            name: newSubject.name,
            code: newSubject.code,
            courseId: newSubject.courseId
        } as Subject);
        setIsSubjectModalOpen(false);
        setNewSubject({ name: '', code: '', courseId: '' });
    };

    // Helper to count subjects in a course
    const countSubjects = (courseId: string) => subjects.filter(s => s.courseId === courseId).length;

    return (
        <div className="space-y-8">
            {/* COURSES SECTION */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Cursos & Disciplinas</h1>
                    <p className="text-gray-500">Gerencie programas acadêmicos e seus currículos.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsCourseModalOpen(true)}>
                        <Plus className="w-4 h-4" /> Novo Curso
                    </Button>
                    <Button variant="secondary" onClick={() => setIsSubjectModalOpen(true)}>
                        <Plus className="w-4 h-4" /> Nova Disciplina
                    </Button>
                </div>
            </div>

            <Card>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    <h2 className="font-semibold text-gray-900">Cursos Definidos</h2>
                </div>
                <Table headers={['Código', 'Nome do Curso', 'Créditos', 'Disciplinas', 'Status']}>
                    {courses.map(course => (
                        <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{course.code}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{course.name}</td>
                            <td className="px-6 py-4 text-gray-600">{course.credits}h</td>
                            <td className="px-6 py-4">
                                <Badge variant="blue">{countSubjects(course.id)} Disciplinas</Badge>
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant="green">Ativo</Badge>
                            </td>
                        </tr>
                    ))}
                    {courses.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-8 text-gray-500">Nenhum curso definido ainda.</td>
                        </tr>
                    )}
                </Table>
            </Card>

            <Card>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary-600" />
                    <h2 className="font-semibold text-gray-900">Todas as Disciplinas</h2>
                </div>
                <Table headers={['Código', 'Nome da Disciplina', 'Curso Pai', 'Ações']}>
                    {subjects.map(subject => {
                        const course = courses.find(c => c.id === subject.courseId);
                        return (
                            <tr key={subject.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{subject.code}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{subject.name}</td>
                                <td className="px-6 py-4 text-gray-600">{course?.name || 'Desconhecido'}</td>
                                <td className="px-6 py-4">
                                    <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">Editar</button>
                                </td>
                            </tr>
                        );
                    })}
                </Table>
            </Card>

            {/* CREATE COURSE MODAL */}
            <Modal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} title="Criar Novo Curso">
                <form onSubmit={handleCreateCourse} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Curso</label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="ex: Ciência da Computação"
                            value={newCourse.name}
                            onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="CC101"
                                value={newCourse.code}
                                onChange={e => setNewCourse({ ...newCourse, code: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Créditos (h)</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="3600"
                                value={newCourse.credits}
                                onChange={e => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                                required
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsCourseModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Criar Curso</Button>
                    </div>
                </form>
            </Modal>

            {/* CREATE SUBJECT MODAL */}
            <Modal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} title="Criar Nova Disciplina">
                <form onSubmit={handleCreateSubject} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Disciplina</label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="ex: Estrutura de Dados"
                            value={newSubject.name}
                            onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Curso Pai</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            value={newSubject.courseId}
                            onChange={e => setNewSubject({ ...newSubject, courseId: e.target.value })}
                            required
                        >
                            <option value="">Selecione um Curso...</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="ED-02"
                            value={newSubject.code}
                            onChange={e => setNewSubject({ ...newSubject, code: e.target.value })}
                            required
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsSubjectModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Criar Disciplina</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
