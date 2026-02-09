import React, { useState } from 'react';
import { useAcademicStore } from '../../store/academicStore';
import { Card, Button, Table, Badge, Modal } from '../../components/ui';
import { Plus, User as UserIcon } from 'lucide-react';
import type { User, Role } from '../../types';

export const AdminUsers = () => {
    const { users, addUser } = useAcademicStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');

    const [newUser, setNewUser] = useState<Partial<User>>({ name: '', email: '', role: 'student' });

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email) return;

        addUser({
            id: crypto.randomUUID(),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role as Role,
            avatar: `https://ui-avatars.com/api/?name=${newUser.name}&background=random`
        });

        setIsModalOpen(false);
        setNewUser({ name: '', email: '', role: 'student' });
    };

    const filteredUsers = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
                    <p className="text-gray-500">Gerencie alunos, professores e administradores.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4" /> Adicionar Usuário
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                {(['all', 'student', 'professor', 'admin'] as const).map(role => (
                    <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${roleFilter === role
                            ? 'bg-primary-100 text-primary-800'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            } capitalize`}
                    >
                        {role === 'all' ? 'Todos' : role === 'student' ? 'Alunos' : role === 'professor' ? 'Professores' : 'Admins'}
                    </button>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
                <Card>
                    <Table headers={['Nome', 'E-mail', 'Função', 'Status', 'Ações']}>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                            {user.avatar ? <img src={user.avatar} alt="" /> : <UserIcon className="w-4 h-4 text-gray-500" />}
                                        </div>
                                        <span className="font-medium text-gray-900">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={user.role === 'admin' ? 'red' : user.role === 'professor' ? 'blue' : 'green'}>
                                        {user.role}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Ativo
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">Editar</button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                </Card>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {filteredUsers.map(user => (
                    <div key={user.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-gray-500" />}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <Badge variant={user.role === 'admin' ? 'red' : user.role === 'professor' ? 'blue' : 'green'}>
                                {user.role}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Ativo
                            </span>
                            <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">Editar</button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Novo Usuário">
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            value={newUser.name}
                            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de E-mail</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            value={newUser.email}
                            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none capitalize"
                            value={newUser.role}
                            onChange={e => setNewUser({ ...newUser, role: e.target.value as Role })}
                        >
                            <option value="student">Aluno</option>
                            <option value="professor">Professor</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Criar Usuário</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
