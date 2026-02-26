import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Save } from 'lucide-react';

import { api } from '@/utils/api';
import { Toast } from '@/components/Toast';

type ProjectsPageContent = {
  id?: number | null;
  pageTitle: string;
  pageTitleEn: string;
  pageDescription: string;
  heroImageUrl: string;
  pageDescriptionEn: string;
  heroImageUrlEn: string;
  seoTitle: string;
  seoTitleEn: string;
  seoKeywords: string;
  seoKeywordsEn: string;
  seoDescription: string;
  seoDescriptionEn: string;
};

const emptyContent: ProjectsPageContent = {
  pageTitle: '',
  pageTitleEn: '',
  pageDescription: '',
  heroImageUrl: '',
  pageDescriptionEn: '',
  heroImageUrlEn: '',
  seoTitle: '',
  seoTitleEn: '',
  seoKeywords: '',
  seoKeywordsEn: '',
  seoDescription: '',
  seoDescriptionEn: '',
};

const ProjectsPageContentForm: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi');
  const [formData, setFormData] = useState<ProjectsPageContent>(emptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await api.get<any>('/api/pages/projects');
      setFormData(data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      setMessage({ type: 'error', text: 'Không thể tải dữ liệu.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const data = await api.post<any>('/api/pages/projects', formData);
      setFormData(data);
      setMessage({ type: 'success', text: 'Đã lưu nội dung thành công!' });
    } catch (error) {
      console.error('Failed to save content:', error);
      setMessage({ type: 'error', text: 'Lỗi kết nối server.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quản lý nội dung trang dự án</h3>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveLang('vi')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeLang === 'vi'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Tiếng Việt
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeLang === 'en'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            English
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tiêu đề trang</label>
            <input
              type="text"
              name={activeLang === 'vi' ? 'pageTitle' : 'pageTitleEn'}
              value={activeLang === 'vi' ? formData.pageTitle : formData.pageTitleEn}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder={activeLang === 'vi' ? 'Ví dụ: Dự án tiêu biểu' : 'Example: Featured Projects'}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mô tả trang</label>
            <textarea
              name={activeLang === 'vi' ? 'pageDescription' : 'pageDescriptionEn'}
              value={activeLang === 'vi' ? formData.pageDescription : formData.pageDescriptionEn}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder={activeLang === 'vi' ? 'Mô tả ngắn về danh sách dự án...' : 'Short description about projects...'}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Cấu hình SEO</h4>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SEO Title</label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'seoTitle' : 'seoTitleEn'}
                value={activeLang === 'vi' ? (formData.seoTitle || '') : (formData.seoTitleEn || '')}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SEO Keywords</label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'seoKeywords' : 'seoKeywordsEn'}
                value={activeLang === 'vi' ? (formData.seoKeywords || '') : (formData.seoKeywordsEn || '')}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="keyword1, keyword2, ..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SEO Description</label>
            <textarea
              name={activeLang === 'vi' ? 'seoDescription' : 'seoDescriptionEn'}
              value={activeLang === 'vi' ? (formData.seoDescription || '') : (formData.seoDescriptionEn || '')}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Lưu nội dung
              </>
            )}
          </button>
        </div>
      </form>
      <Toast message={message} onClose={() => setMessage(null)} />
    </div>
  );
};

export default ProjectsPageContentForm;
