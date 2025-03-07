// src/pages/admin/users/index.tsx
import { useState, useEffect } from 'react';
import { NextPageWithLayout } from '@/pages/_app';
import { ReactElement } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  User, 
  Shield, 
  ShieldAlert, 
  UserX, 
  Search, 
  Filter,
  Trash,
  Loader
} from 'lucide-react';

// Kullanıcı tipi
interface UserData {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'admin' | 'editor' | 'author' | 'user';
  createdAt: string;
  lastLogin?: string;
  disabled: boolean;
}

const AdminUsers: NextPageWithLayout = () => {
  // State tanımlamaları
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isChangingRole, setIsChangingRole] = useState<string | null>(null);
  const [isDisabling, setIsDisabling] = useState<string | null>(null);
  
  // API'den kullanıcıları getir
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        
        if (data.success) {
          setUsers(data.data);
        }
      } catch (error) {
        console.error('Kullanıcılar getirilirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Kullanıcı rolünü değiştir
  const handleChangeRole = async (userId: string, newRole: 'admin' | 'editor' | 'author' | 'user') => {
    if (!confirm(`Bu kullanıcının rolünü "${newRole}" olarak değiştirmek istediğinizden emin misiniz?`)) {
      return;
    }
    
    setIsChangingRole(userId);
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      }
    } catch (error) {
      console.error('Kullanıcı rolü değiştirilirken hata oluştu:', error);
    } finally {
      setIsChangingRole(null);
    }
  };
  
  // Kullanıcıyı devre dışı bırak/etkinleştir
  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'devre dışı bırakmak' : 'etkinleştirmek';
    
    if (!confirm(`Bu kullanıcıyı ${action} istediğinizden emin misiniz?`)) {
      return;
    }
    
    setIsDisabling(userId);
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disabled: newStatus }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, disabled: newStatus } : user
          )
        );
      }
    } catch (error) {
      console.error('Kullanıcı durumu değiştirilirken hata oluştu:', error);
    } finally {
      setIsDisabling(null);
    }
  };
  
  // Filtrelenmiş kullanıcılar
  const filteredUsers = users.filter((user) => {
    // Arama filtresi
    const matchesSearch =
      searchTerm === '' ||
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Rol filtresi
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  // Tarih formatla
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <>
      <Head>
        <title>Kullanıcı Yönetimi - Tech Rehberi Admin</title>
      </Head>
      
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Kullanıcı Yönetimi</h2>
        </div>
        
        {/* Filtreler ve Arama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          </div>
          
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tüm Roller</option>
              <option value="admin">Admin</option>
              <option value="editor">Editör</option>
              <option value="author">Yazar</option>
              <option value="user">Kullanıcı</option>
            </select>
          </div>
        </div>
        
        {/* Kullanıcı Tablosu */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-card border rounded-lg p-6 text-center">
            <p className="text-muted-foreground mb-4">Kullanıcı bulunamadı.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-3 text-left">Kullanıcı</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Rol</th>
                  <th className="px-4 py-3 text-left">Kayıt Tarihi</th>
                  <th className="px-4 py-3 text-left">Son Giriş</th>
                  <th className="px-4 py-3 text-center">Durum</th>
                  <th className="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                          {user.photoURL ? (
                            <Image
                              src={user.photoURL}
                              alt={user.displayName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.displayName || 'İsimsiz Kullanıcı'}</p>
                          <p className="text-xs text-muted-foreground">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {user.role === 'admin' && <Shield className="w-4 h-4 text-primary" />}
                        {user.role === 'editor' && <ShieldAlert className="w-4 h-4 text-blue-500" />}
                        {user.role === 'author' && <User className="w-4 h-4 text-green-500" />}
                        <span className={`text-sm capitalize ${
                          user.role === 'admin' ? 'text-primary' : 
                          user.role === 'editor' ? 'text-blue-500' : 
                          user.role === 'author' ? 'text-green-500' : ''
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-muted-foreground">{formatDate(user.lastLogin)}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.disabled
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}
                      >
                        {user.disabled ? 'Devre Dışı' : 'Aktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* Rol Değiştirme Dropdown */}
                        <div className="relative group">
                          <button
                            disabled={isChangingRole === user.id}
                            className="p-2 text-blue-700 hover:bg-blue-100 rounded-md dark:text-blue-400 dark:hover:bg-blue-900/20"
                            title="Rol Değiştir"
                          >
                            {isChangingRole === user.id ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <Shield className="w-5 h-5" />
                            )}
                          </button>
                          
                          <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-md shadow-lg z-10">
                            <div className="p-1">
                              <button
                                onClick={() => handleChangeRole(user.id, 'admin')}
                                disabled={user.role === 'admin'}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                                  user.role === 'admin' ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
                                }`}
                              >
                                Admin
                              </button>
                              <button
                                onClick={() => handleChangeRole(user.id, 'editor')}
                                disabled={user.role === 'editor'}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                                  user.role === 'editor' ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
                                }`}
                              >
                                Editör
                              </button>
                              <button
                                onClick={() => handleChangeRole(user.id, 'author')}
                                disabled={user.role === 'author'}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                                  user.role === 'author' ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
                                }`}
                              >
                                Yazar
                              </button>
                              <button
                                onClick={() => handleChangeRole(user.id, 'user')}
                                disabled={user.role === 'user'}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                                  user.role === 'user' ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
                                }`}
                              >
                                Kullanıcı
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Kullanıcıyı Devre Dışı Bırak/Etkinleştir */}
                        <button
                          onClick={() => handleToggleUserStatus(user.id, user.disabled)}
                          disabled={isDisabling === user.id}
                          className={`p-2 rounded-md ${
                            user.disabled
                              ? 'text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/20'
                              : 'text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20'
                          }`}
                          title={user.disabled ? 'Kullanıcıyı Etkinleştir' : 'Kullanıcıyı Devre Dışı Bırak'}
                        >
                          {isDisabling === user.id ? (
                            <Loader className="w-5 h-5 animate-spin" />
                          ) : (
                            <UserX className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

// Layout'u uygula
AdminUsers.getLayout = function getLayout(page: ReactElement): ReactElement {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminUsers;