import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Save, FileText } from 'lucide-react';
<<<<<<< HEAD
import { isAuthenticated } from '@/utils/auth';
import { api } from '@/utils/api';
import { getLocalizedSlug } from '@/utils/localization';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toast } from '@/components/Toast';
=======
import { getAuthHeader, isAuthenticated } from '../utils/auth';
import { clearCache } from '../utils/cache';
import { getLocalizedSlug } from '../utils/localization';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toast } from './Toast';
>>>>>>> b2df92e (first commit)

type SeoOverallContent = {
  id?: number | null;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroDescription: string;
  serviceDescriptionHtml: string;
  suitableFor: string;
  suggestionText: string;
  heroTitlePrefixEn: string;
  heroTitleHighlightEn: string;
  heroDescriptionEn: string;
  serviceDescriptionHtmlEn: string;
  suitableForEn: string;
  suggestionTextEn: string;
  seoTitle: string;
  seoKeywords: string;
  seoDescription: string;
  primaryKeyword: string;
  seoTitleEn: string;
  seoKeywordsEn: string;
  seoDescriptionEn: string;
  primaryKeywordEn: string;
};

const emptyContent: SeoOverallContent = {
  heroTitlePrefix: '',
  heroTitleHighlight: '',
  heroDescription: '',
  serviceDescriptionHtml: '',
  suitableFor: '',
  suggestionText: '',
  heroTitlePrefixEn: '',
  heroTitleHighlightEn: '',
  heroDescriptionEn: '',
  serviceDescriptionHtmlEn: '',
  suitableForEn: '',
  suggestionTextEn: '',
  seoTitle: '',
  seoKeywords: '',
  seoDescription: '',
  primaryKeyword: '',
  seoTitleEn: '',
  seoKeywordsEn: '',
  seoDescriptionEn: '',
  primaryKeywordEn: '',
};

const SeoOverallContentForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<SeoOverallContent>(emptyContent);
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi');
  const activeLangRef = useRef<'vi' | 'en'>('vi');

  useEffect(() => {
    activeLangRef.current = activeLang;
  }, [activeLang]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData((prev) =>
        activeLangRef.current === 'vi'
          ? { ...prev, serviceDescriptionHtml: html }
          : { ...prev, serviceDescriptionHtmlEn: html },
      );
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[180px] w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none',
      },
    },
  });

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
<<<<<<< HEAD
        const data = await api.get<any>('/api/pages/seo-overall');
        const serviceHtmlVi =
          data.serviceDescriptionHtml ||
          `<p>${data.serviceIntro || ''}</p><p>${data.serviceSecondary || ''}</p>`;
        const serviceHtmlEn = data.serviceDescriptionHtmlEn || '';
        setFormData({
          heroTitlePrefix: data.heroTitlePrefix || '',
          heroTitleHighlight: data.heroTitleHighlight || '',
          heroDescription: data.heroDescription || '',
          serviceDescriptionHtml: serviceHtmlVi,
          suitableFor: data.suitableFor || '',
          suggestionText: data.suggestionText || '',
          heroTitlePrefixEn: data.heroTitlePrefixEn || '',
          heroTitleHighlightEn: data.heroTitleHighlightEn || '',
          heroDescriptionEn: data.heroDescriptionEn || '',
          serviceDescriptionHtmlEn: serviceHtmlEn,
          suitableForEn: data.suitableForEn || '',
          suggestionTextEn: data.suggestionTextEn || '',
          seoTitle: data.seoTitle || '',
          seoKeywords: data.seoKeywords || '',
          seoDescription: data.seoDescription || '',
          primaryKeyword: data.primaryKeyword || '',
          seoTitleEn: data.seoTitleEn || '',
          seoKeywordsEn: data.seoKeywordsEn || '',
          seoDescriptionEn: data.seoDescriptionEn || '',
          primaryKeywordEn: data.primaryKeywordEn || '',
        });
=======
        const response = await fetch('/api/pages/seo-overall');
        if (response.ok) {
          const data = await response.json();
          const serviceHtmlVi =
            data.serviceDescriptionHtml ||
            `<p>${data.serviceIntro || ''}</p><p>${data.serviceSecondary || ''}</p>`;
          const serviceHtmlEn = data.serviceDescriptionHtmlEn || '';
          setFormData({
            heroTitlePrefix: data.heroTitlePrefix || '',
            heroTitleHighlight: data.heroTitleHighlight || '',
            heroDescription: data.heroDescription || '',
            serviceDescriptionHtml: serviceHtmlVi,
            suitableFor: data.suitableFor || '',
            suggestionText: data.suggestionText || '',
            heroTitlePrefixEn: data.heroTitlePrefixEn || '',
            heroTitleHighlightEn: data.heroTitleHighlightEn || '',
            heroDescriptionEn: data.heroDescriptionEn || '',
            serviceDescriptionHtmlEn: serviceHtmlEn,
            suitableForEn: data.suitableForEn || '',
            suggestionTextEn: data.suggestionTextEn || '',
            seoTitle: data.seoTitle || '',
            seoKeywords: data.seoKeywords || '',
            seoDescription: data.seoDescription || '',
            primaryKeyword: data.primaryKeyword || '',
            seoTitleEn: data.seoTitleEn || '',
            seoKeywordsEn: data.seoKeywordsEn || '',
            seoDescriptionEn: data.seoDescriptionEn || '',
            primaryKeywordEn: data.primaryKeywordEn || '',
          });
        }
>>>>>>> b2df92e (first commit)
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    if (!editor) return;
    const html = activeLang === 'vi' ? formData.serviceDescriptionHtml : formData.serviceDescriptionHtmlEn;
    const current = editor.getHTML();
    if (!html && (current === '<p></p>' || current === '')) return;
    if (html && current === html) return;
    editor.commands.setContent(html || '', { emitUpdate: false });
  }, [editor, activeLang, formData.serviceDescriptionHtml, formData.serviceDescriptionHtmlEn]);

  const previewSuitableFor = useMemo(() => {
    const value = activeLang === 'vi' ? formData.suitableFor : formData.suitableForEn;
    return (value || '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4);
  }, [activeLang, formData.suitableFor, formData.suitableForEn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (!isAuthenticated()) {
      setMessage({ type: 'error', text: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.' });
      setSaving(false);
      return;
    }

    try {
      const payload: SeoOverallContent = { ...formData };
      if (editor) {
        if (activeLangRef.current === 'vi') payload.serviceDescriptionHtml = editor.getHTML();
        else payload.serviceDescriptionHtmlEn = editor.getHTML();
      }
<<<<<<< HEAD
      await api.post('/api/pages/seo-overall', payload);
      setMessage({ type: 'success', text: 'Đã lưu nội dung Dịch vụ SEO Tổng Thể.' });
=======
      const response = await fetch('/api/pages/seo-overall', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Đã lưu nội dung Dịch vụ SEO Tổng Thể.' });
        clearCache();
      } else {
        setMessage({ type: 'error', text: 'Lưu thất bại. Vui lòng thử lại.' });
      }
>>>>>>> b2df92e (first commit)
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: `Lỗi kết nối server: ${error instanceof Error ? error.message : String(error)}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Nội dung Dịch vụ SEO Tổng Thể
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chỉnh sửa phần hero và mô tả dịch vụ SEO Tổng Thể
          </p>
        </div>
        <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button
            type="button"
            onClick={() => setActiveLang('vi')}
            className={[
              'px-4 py-2 text-sm font-semibold transition-all',
              activeLang === 'vi'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800',
            ].join(' ')}
          >
            Tiếng Việt
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={[
              'px-4 py-2 text-sm font-semibold transition-all',
              activeLang === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800',
            ].join(' ')}
          >
            English
          </button>
        </div>
      </div>

      <Toast message={message} onClose={() => setMessage(null)} />

      <div className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
        <h4 className="text-md font-semibold mb-4 text-slate-800 dark:text-slate-200">
          SEO Review ({activeLang.toUpperCase()})
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">Preview</div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/40 space-y-2">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {(activeLang === 'vi' ? formData.seoTitle : formData.seoTitleEn) ||
                  (activeLang === 'vi'
                    ? formData.heroTitlePrefix || 'Dịch vụ SEO Tổng Thể'
                    : formData.heroTitlePrefixEn || 'Full-Service SEO')}
              </div>
              <div className="text-sm text-green-700 dark:text-green-400">
                victorsoftwave.com/{activeLang}/{getLocalizedSlug('seo-tong-the', activeLang)}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300">
                {(activeLang === 'vi' ? formData.seoDescription : formData.seoDescriptionEn) ||
                  (activeLang === 'vi'
                    ? 'SEO tổng thể: audit kỹ thuật, tối ưu onpage, nội dung, backlink an toàn.'
                    : 'Full-service SEO: technical audit, on-page optimization, content, and safe backlinks.')}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">Kiểm tra</div>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <div>
                URL:{' '}
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  /{activeLang}/{getLocalizedSlug('seo-tong-the', activeLang)}
                </span>
              </div>
              <div>
                Keyword chính:{' '}
                <span className="font-medium">
                  {(activeLang === 'vi' ? formData.primaryKeyword : formData.primaryKeywordEn) || '(chưa đặt)'}
                </span>
              </div>
              <div>
                Số lượng Keywords:{' '}
                <span className="font-medium">
                  {((activeLang === 'vi' ? formData.seoKeywords : formData.seoKeywordsEn) || '')
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hero title (phần 1)</label>
            <input
              type="text"
              name={activeLang === 'vi' ? 'heroTitlePrefix' : 'heroTitlePrefixEn'}
              value={activeLang === 'vi' ? formData.heroTitlePrefix : formData.heroTitlePrefixEn}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Dịch vụ SEO Tổng Thể"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hero title (highlight)</label>
            <input
              type="text"
              name={activeLang === 'vi' ? 'heroTitleHighlight' : 'heroTitleHighlightEn'}
              value={activeLang === 'vi' ? formData.heroTitleHighlight : formData.heroTitleHighlightEn}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Tăng trưởng bền vững"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hero description</label>
          <textarea
            name={activeLang === 'vi' ? 'heroDescription' : 'heroDescriptionEn'}
            value={activeLang === 'vi' ? formData.heroDescription : formData.heroDescriptionEn}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mô tả dịch vụ</label>
          <div className="rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="flex flex-wrap gap-2 p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                disabled={!editor}
                className={[
                  'px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all',
                  editor?.isActive('heading', { level: 2 })
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800',
                ].join(' ')}
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                disabled={!editor}
                className={[
                  'px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all',
                  editor?.isActive('heading', { level: 3 })
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800',
                ].join(' ')}
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                disabled={!editor}
                className={[
                  'px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all',
                  editor?.isActive('bold')
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800',
                ].join(' ')}
              >
                B
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                disabled={!editor}
                className={[
                  'px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all',
                  editor?.isActive('italic')
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800',
                ].join(' ')}
              >
                I
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                disabled={!editor}
                className={[
                  'px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all',
                  editor?.isActive('underline')
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800',
                ].join(' ')}
              >
                U
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                disabled={!editor}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Bullet
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                disabled={!editor}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Number
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Undo
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Redo
              </button>
            </div>
            <div className="p-1">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phù hợp cho (mỗi dòng 1 mục)</label>
          <textarea
            name={activeLang === 'vi' ? 'suitableFor' : 'suitableForEn'}
            value={activeLang === 'vi' ? formData.suitableFor : formData.suitableForEn}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Dòng 1...\nDòng 2...\nDòng 3..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gợi ý triển khai</label>
          <textarea
            name={activeLang === 'vi' ? 'suggestionText' : 'suggestionTextEn'}
            value={activeLang === 'vi' ? formData.suggestionText : formData.suggestionTextEn}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/30">
          <div className="text-sm font-bold text-slate-900 dark:text-white">SEO</div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SEO Title</label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'seoTitle' : 'seoTitleEn'}
                value={activeLang === 'vi' ? formData.seoTitle : formData.seoTitleEn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keyword chính</label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'primaryKeyword' : 'primaryKeywordEn'}
                value={activeLang === 'vi' ? formData.primaryKeyword : formData.primaryKeywordEn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SEO Keywords</label>
            <textarea
              name={activeLang === 'vi' ? 'seoKeywords' : 'seoKeywordsEn'}
              value={activeLang === 'vi' ? formData.seoKeywords : formData.seoKeywordsEn}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SEO Description</label>
            <textarea
              name={activeLang === 'vi' ? 'seoDescription' : 'seoDescriptionEn'}
              value={activeLang === 'vi' ? formData.seoDescription : formData.seoDescriptionEn}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
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
                Lưu nội dung
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeoOverallContentForm;
