import React, { useState, useEffect } from 'react';
import { Save, Globe, Loader2 } from 'lucide-react';
import { getAuthHeader } from '../utils/auth';

const SeoSettingsForm: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    seoTitleVi: '',
    seoTitleEn: '',
    seoKeywordsVi: '',
    seoKeywordsEn: '',
    seoDescriptionVi: '',
    seoDescriptionEn: '',
    mainKeywordVi: '',
    mainKeywordEn: ''
  });

  const seoTitle = (activeLang === 'vi' ? formData.seoTitleVi : formData.seoTitleEn).trim();
  const seoDescription = (activeLang === 'vi' ? formData.seoDescriptionVi : formData.seoDescriptionEn).trim();

  const previewTitle =
    seoTitle || (activeLang === 'vi' ? 'Tiêu đề SEO sẽ hiển thị ở đây' : 'SEO title will appear here');
  const previewDescription =
    seoDescription ||
    (activeLang === 'vi'
      ? 'Mô tả SEO sẽ hiển thị ở đây. Hãy viết ngắn gọn, rõ ràng và có từ khóa chính.'
      : 'SEO description will appear here. Keep it concise and include your main keyword.');
  const previewUrl = window.location.origin;

  useEffect(() => {
    fetchSeoSettings();
  }, []);

  const fetchSeoSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/seo', {
        headers: getAuthHeader()
      });
      if (response.ok) {
        const data = await response.json();
        // Merge with default empty strings to avoid uncontrolled input warnings
        setFormData({
            seoTitleVi: data.seoTitleVi || '',
            seoTitleEn: data.seoTitleEn || '',
            seoKeywordsVi: data.seoKeywordsVi || '',
            seoKeywordsEn: data.seoKeywordsEn || '',
            seoDescriptionVi: data.seoDescriptionVi || '',
            seoDescriptionEn: data.seoDescriptionEn || '',
            mainKeywordVi: data.mainKeywordVi || '',
            mainKeywordEn: data.mainKeywordEn || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Đã lưu cài đặt SEO thành công!' });
      } else {
        setMessage({ type: 'error', text: 'Lưu thất bại. Vui lòng thử lại.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi kết nối server.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Cấu hình SEO Website
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Quản lý thẻ tiêu đề, mô tả và từ khóa cho công cụ tìm kiếm
          </p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          <button
            onClick={() => setActiveLang('vi')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeLang === 'vi' 
                ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Tiếng Việt 🇻🇳
          </button>
          <button
            onClick={() => setActiveLang('en')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeLang === 'en' 
                ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            English 🇺🇸
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-5">
        <div className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400">
          Preview
        </div>
        <div className="mt-3 space-y-1">
          <div className="text-[18px] leading-snug font-medium text-blue-700 dark:text-blue-400 break-words">
            {previewTitle}
          </div>
          <div className="text-sm text-green-700 dark:text-green-500 break-words">
            {previewUrl}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 break-words">
            {previewDescription}
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
            : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={activeLang === 'vi' ? 'block' : 'hidden'}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tiêu đề SEO (SEO Title)
              </label>
              <input
                type="text"
                name="seoTitleVi"
                value={formData.seoTitleVi}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ví dụ: Thiết kế Website Chuyên Nghiệp | Victor Softwave"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Từ khóa chính (Main Keyword)
              </label>
              <input
                type="text"
                name="mainKeywordVi"
                value={formData.mainKeywordVi}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ví dụ: thiết kế website"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Danh sách từ khóa (SEO Keywords)
              </label>
              <textarea
                name="seoKeywordsVi"
                value={formData.seoKeywordsVi}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ví dụ: thiết kế web, làm web giá rẻ, seo website..."
              />
              <p className="text-xs text-slate-500 mt-1">Ngăn cách các từ khóa bằng dấu phẩy</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mô tả SEO (SEO Description)
              </label>
              <textarea
                name="seoDescriptionVi"
                value={formData.seoDescriptionVi}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Mô tả ngắn gọn về website hiển thị trên kết quả tìm kiếm..."
              />
            </div>
          </div>
        </div>

        <div className={activeLang === 'en' ? 'block' : 'hidden'}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                SEO Title (English)
              </label>
              <input
                type="text"
                name="seoTitleEn"
                value={formData.seoTitleEn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g. Professional Web Design | Victor Softwave"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Main Keyword (English)
              </label>
              <input
                type="text"
                name="mainKeywordEn"
                value={formData.mainKeywordEn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g. web design"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                SEO Keywords (English)
              </label>
              <textarea
                name="seoKeywordsEn"
                value={formData.seoKeywordsEn}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g. web design, seo services, digital marketing..."
              />
              <p className="text-xs text-slate-500 mt-1">Separate keywords with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                SEO Description (English)
              </label>
              <textarea
                name="seoDescriptionEn"
                value={formData.seoDescriptionEn}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Brief description appearing in search results..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
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
                Lưu cài đặt
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeoSettingsForm;
