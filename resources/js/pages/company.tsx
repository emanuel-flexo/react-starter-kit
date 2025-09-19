import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Building2, Plus, Search, Calendar, Users, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { company as companyRoute } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';

interface Company {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    machines_count?: number;
}

interface Props {
    companies: Company[];
    errors?: {
        name?: string;
        description?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Empresas',
        href: companyRoute().url,
    },
];

export default function CompanyPage({ companies, errors = {} }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [isShowingDetail, setIsShowingDetail] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const resetForm = () => {
        setFormData({ name: '', description: '' });
    };

    const handleCreate = () => {
        resetForm();
        setIsCreateModalOpen(true);
    };

    const handleEdit = (company: Company) => {
        setSelectedCompany(company);
        setFormData({
            name: company.name,
            description: company.description || ''
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (company: Company) => {
        setSelectedCompany(company);
        setIsDeleteModalOpen(true);
    };

    // const handleView = (company: Company) => {
    //     setSelectedCompany(company);
    //     setIsShowingDetail(true);

    //     router.get(`/company/${company.id}`, {}, {
    //         onSuccess: () => {
    //             setIsShowingDetail(false);
    //         },
    //         onError: () => {
    //             setIsShowingDetail(false);
    //         }
    //     });
    // };

    const handleSubmitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/company', formData, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                resetForm();
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompany) return;
        setIsSubmitting(true);
        router.put(`/company/${selectedCompany.id}`, formData, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setSelectedCompany(null);
                resetForm();
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    const handleSubmitDelete = () => {
        if (!selectedCompany) return;
        setIsSubmitting(true);
        router.delete(`/company/${selectedCompany.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedCompany(null);
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Empresas" />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
                        <p className="text-muted-foreground">
                            Gerencie as empresas cadastradas no sistema
                        </p>
                    </div>
                    <Button onClick={handleCreate} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nova Empresa
                    </Button>
                </div>

                {/* Search and Stats */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar empresas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="gap-1">
                            <Building2 className="h-3 w-3" />
                            {companies.length} empresas
                        </Badge>
                    </div>
                </div>

                {/* Companies Grid */}
                {filteredCompanies.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCompanies.map((company) => (
                            <Card key={company.id} className="group hover:shadow-lg transition-all duration-200 hover:border-primary/20">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <Building2 className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                                                    {company.name}
                                                </CardTitle>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    Criada em {formatDate(company.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {/* <DropdownMenuItem onClick={() => handleView(company)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Ver Detalhes
                                                </DropdownMenuItem> */}
                                                <DropdownMenuItem onClick={() => handleEdit(company)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => handleDelete(company)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                    {company.description ? (
                                        <CardDescription className="text-sm leading-relaxed">
                                            {company.description}
                                        </CardDescription>
                                    ) : (
                                        <CardDescription className="text-sm text-muted-foreground italic">
                                            Sem descrição
                                        </CardDescription>
                                    )}
                                    
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Users className="h-3 w-3" />
                                            <span>{company.machines_count || 0} máquinas</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                            {searchTerm ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa cadastrada'}
                        </h3>
                        <p className="text-muted-foreground mb-4 max-w-sm">
                            {searchTerm 
                                ? 'Tente ajustar sua busca ou verificar a ortografia.'
                                : 'Comece cadastrando sua primeira empresa no sistema.'
                            }
                        </p>
                        {!searchTerm && (
                            <Button onClick={handleCreate} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Cadastrar Primeira Empresa
                            </Button>
                        )}
                    </div>
                )}
            </div>
            {/* Create Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Criar Nova Empresa</DialogTitle>
                        <DialogDescription>
                            Preencha os dados para criar uma nova empresa.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Nome da Empresa</Label>
                            <Input
                                id="create-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Digite o nome da empresa"
                                required
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-description">Descrição</Label>
                            <Textarea
                                id="create-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Descrição da empresa (opcional)"
                                rows={3}
                            />
                            <InputError message={errors.description} />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={isSubmitting}>
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Criando...' : 'Criar Empresa'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Empresa</DialogTitle>
                        <DialogDescription>
                            Altere os dados da empresa.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nome da Empresa</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Digite o nome da empresa"
                                required
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Descrição</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Descrição da empresa (opcional)"
                                rows={3}
                            />
                            <InputError message={errors.description} />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={isSubmitting}>
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir Empresa</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir a empresa "{selectedCompany?.name}"? 
                            Esta ação não pode ser desfeita e todas as máquinas associadas também serão removidas.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isSubmitting}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={handleSubmitDelete}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Excluindo...' : 'Excluir Empresa'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            { /* View Detail Modal */}
            {/* <Dialog open={isShowingDetail} onOpenChange={setIsShowingDetail}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalhes da Empresa</DialogTitle>
                        <DialogDescription>
                            Aqui estão os detalhes da empresa "{selectedCompany?.name}".
                        </DialogDescription>
                        <DialogDescription>
                            Descrição "{selectedCompany?.description}".
                        </DialogDescription>
                        <DialogDescription>
                            Data de Criação "{selectedCompany?.created_at}".
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isShowingDetail}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}
        </AppLayout>
    );
}