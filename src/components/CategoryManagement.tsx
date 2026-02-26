import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { Edit3, Trash2, Plus, X, Loader2 } from 'lucide-react';
import { Toast } from '@/components/Toast';

interface Category {
  id: number;
  name: string;
  nameEn: string;
  slug: string;
}

export const CategoryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'project' | 'client'>('project');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [activeTab]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'project' ? '/api/categories/project' : '/api/categories/client';
      const data = await api.get<Category[]>(endpoint);
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setToast('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const endpoint = activeTab === 'project' ? '/api/categories/project' : '/api/categories/client';
      
      if (!editingCategory.name) {
        setToast('Name is required');
        return;
      }

      // Auto-generate slug if missing
      if (!editingCategory.slug && editingCategory.name) {
        editingCategory.slug = editingCategory.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
      }

      if (editingCategory.id) {
        await api.put(`${endpoint}/${editingCategory.id}`, editingCategory);
        setToast('Category updated successfully');
      } else {
        await api.post(endpoint, editingCategory);
        setToast('Category created successfully');
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      setToast('Failed to save category');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const endpoint = activeTab === 'project' ? '/api/categories/project' : '/api/categories/client';
      await api.delete(`${endpoint}/${id}`);
      setToast('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      setToast('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Quản lý danh mục</h2>
        <button
          onClick={() => {
            setEditingCategory({});
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm mới</span>
        </button>
      </div>

      <div className="flex space-x-4 border-b border-slate-200 dark:border-slate-700">
        <button
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'project'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          onClick={() => setActiveTab('project')}
        >
          Danh mục dự án
        </button>
        <button
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'client'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          onClick={() => setActiveTab('client')}
        >
          Danh mục khách hàng
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400">
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Tên (VI)</th>
                <th className="px-6 py-4 font-semibold">Tên (EN)</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">#{category.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{category.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{category.nameEn || '-'}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500 dark:text-slate-400">{category.slug || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setShowModal(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    Chưa có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md flex flex-col border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingCategory.id ? 'Sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tên danh mục (VI) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ví dụ: Doanh nghiệp"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tên danh mục (EN)</label>
                <input
                  type="text"
                  value={editingCategory.nameEn || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, nameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Example: Corporate"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
                <input
                  type="text"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Leave empty to auto-generate"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
              >
                Lưu danh mục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
