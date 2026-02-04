import React, { useEffect, useMemo, useRef, useState } from 'react';
import { clearCache } from '../utils/cache';
import { Loader2, Save, FileText } from 'lucide-react';
import { getAuthHeader, isAuthenticated } from '../utils/auth';
import { getLocalizedSlug } from '../utils/localization';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { z } from 'zod';
import { Toast } from './Toast';



type WebDesignContent = {
  id?: number | null;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroDescription: string;
  heroImageUrl: string;
  serviceDescriptionHtml: string;
  suitableFor: string;
  suggestionText: string;
  heroTitlePrefixEn: string;
  heroTitleHighlightEn: string;
  heroDescriptionEn: string;
  heroImageUrlEn: string;
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
  pricingJsonVi?: string;
  pricingJsonEn?: string;
};

const emptyContent: WebDesignContent = {
  heroTitlePrefix: '',
  heroTitleHighlight: '',
  heroDescription: '',
  heroImageUrl: '',
  serviceDescriptionHtml: '',
  suitableFor: '',
  suggestionText: '',
  heroTitlePrefixEn: '',
  heroTitleHighlightEn: '',
  heroDescriptionEn: '',
  heroImageUrlEn: '',
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
  pricingJsonVi: '[]',
  pricingJsonEn: '[]',
};

const WebDesignContentForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<WebDesignContent>(emptyContent);
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi');
  const activeLangRef = useRef<'vi' | 'en'>('vi');
  const [pricingErrors, setPricingErrors] = useState<Record<string, string>>({});
  const [featuresDraft, setFeaturesDraft] = useState<{ vi: Record<number, string>; en: Record<number, string> }>({
    vi: {},
    en: {},
  });

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
        const response = await fetch('/api/pages/web-design');
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
            heroImageUrl: data.heroImageUrl || '',
            serviceDescriptionHtml: serviceHtmlVi,
            suitableFor: data.suitableFor || '',
            suggestionText: data.suggestionText || '',
            heroTitlePrefixEn: data.heroTitlePrefixEn || '',
            heroTitleHighlightEn: data.heroTitleHighlightEn || '',
            heroDescriptionEn: data.heroDescriptionEn || '',
            heroImageUrlEn: data.heroImageUrlEn || '',
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
            pricingJsonVi: data.pricingJsonVi || '[]',
            pricingJsonEn: data.pricingJsonEn || '[]',
          });
        }
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
      if (activeLangRef.current === 'vi') {
        const featureSchema = z
          .string()
          .trim()
          .min(1, 'Mỗi tính năng không được trống')
          .max(255, 'Tối đa 255 ký tự');
        const pricingItemSchema = z.object({
          name: z.string().trim().min(1, 'Bắt buộc').max(255, 'Tối đa 255 ký tự'),
          price: z.string().trim().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
          desc: z.string().trim().max(255, 'Tối đa 255 ký tự').optional().or(z.literal('')),
          link: z.string().trim().max(255, 'Tối đa 255 ký tự').optional().or(z.literal('')),
          features: z.array(featureSchema).min(1, 'Tối thiểu 1 tính năng'),
          popular: z.boolean().optional(),
        });
        const pricingSchemaVi = z.array(pricingItemSchema).min(1, 'Tối thiểu 1 gói');
        const parsed = getPackages('vi');
        const result = pricingSchemaVi.safeParse(parsed);
        if (!result.success) {
          const errs: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            const p = issue.path as (string | number)[];
            if (p.length === 0) {
              errs['vi._root'] = issue.message;
              return;
            }
            const idx = typeof p[0] === 'number' ? (p[0] as number) : 0;
            const field = typeof p[1] === 'string' ? (p[1] as string) : 'name';
            const key = `vi.${idx}.${field}`;
            if (!errs[key]) {
              errs[key] = issue.message;
            }
          });
          setPricingErrors(errs);
          setMessage({ type: 'error', text: 'Dữ liệu bảng giá (vi) không hợp lệ. Vui lòng kiểm tra.' });
          setSaving(false);
          return;
        } else {
          setPricingErrors({});
        }
      }
      const payload: WebDesignContent = { ...formData };
      if (editor) {
        if (activeLangRef.current === 'vi') payload.serviceDescriptionHtml = editor.getHTML();
        else payload.serviceDescriptionHtmlEn = editor.getHTML();
      }
      const response = await fetch('/api/pages/web-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Đã lưu nội dung trang Thiết kế Website.' });
        clearCache();
      } else {
        setMessage({ type: 'error', text: 'Lưu thất bại. Vui lòng thử lại.' });
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: `Lỗi kết nối server: ${error instanceof Error ? error.message : String(error)}` });
    } finally {
      setSaving(false);
    }
  };

  const safeParse = (s?: string) => {
    try {
      const v = JSON.parse(s || '[]');
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  };

  type PricingItem = {
    name: string;
    price: string;
    desc: string;
    link?: string;
    features: string[];
    popular?: boolean;
  };

  const getPackages = (lang: 'vi' | 'en'): PricingItem[] =>
    safeParse(lang === 'vi' ? formData.pricingJsonVi : formData.pricingJsonEn);

  const setPackages = (lang: 'vi' | 'en', pkgs: PricingItem[]) => {
    setFormData((prev) =>
      lang === 'vi' ? { ...prev, pricingJsonVi: JSON.stringify(pkgs) } : { ...prev, pricingJsonEn: JSON.stringify(pkgs) },
    );
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
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Nội dung trang Thiết kế Website
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chỉnh sửa phần hero và mô tả dịch vụ của trang thiet-ke-website
          </p>
        </div>
        <div className="inline-flex self-start rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button
            type="button"
            onClick={() => setActiveLang('vi')}
            className={[
              'px-3 sm:px-4 py-2 text-sm font-semibold transition-all',
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
              'px-3 sm:px-4 py-2 text-sm font-semibold transition-all',
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

      <div className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
        <h4 className="text-sm sm:text-md font-semibold mb-4 text-slate-800 dark:text-slate-200">
          SEO Review ({activeLang.toUpperCase()})
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">Preview</div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/40 space-y-2">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {(activeLang === 'vi' ? formData.seoTitle : formData.seoTitleEn) ||
                  (activeLang === 'vi'
                    ? formData.heroTitlePrefix || 'Thiết kế Website chuyên nghiệp'
                    : formData.heroTitlePrefixEn || 'Website Design Solutions')}
              </div>
              <div className="text-sm text-green-700 dark:text-green-400">
                victorsoftwave.com/{activeLang}/{getLocalizedSlug('thiet-ke-website', activeLang)}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300">
                {(activeLang === 'vi' ? formData.seoDescription : formData.seoDescriptionEn) ||
                  (activeLang === 'vi'
                    ? 'Dịch vụ thiết kế website chuẩn SEO, tốc độ nhanh, tối ưu chuyển đổi cho doanh nghiệp.'
                    : 'Professional SEO-friendly website design with fast performance and conversion-focused UX.')}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">Kiểm tra</div>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <div>
                URL:{' '}
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  /{activeLang}/{getLocalizedSlug('thiet-ke-website', activeLang)}
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

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hero title (phần 1)</label>
            <input
              type="text"
              name={activeLang === 'vi' ? 'heroTitlePrefix' : 'heroTitlePrefixEn'}
              value={activeLang === 'vi' ? formData.heroTitlePrefix : formData.heroTitlePrefixEn}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Giải Pháp Thiết Kế Website"
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
              placeholder="Chuyên Nghiệp"
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



        <div className="min-w-0">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mô tả dịch vụ</label>
          <div className="rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="flex flex-wrap gap-2 p-2 sm:p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                disabled={!editor}
                className={[
                  'px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all',
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
                  'px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all',
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
                  'px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all',
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
                  'px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all',
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
                  'px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all',
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
                className={[
                  'px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all',
                  editor?.isActive('bulletList')
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800',
                ].join(' ')}
              >
                • List
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                disabled={!editor}
                className={[
                  'px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all',
                  editor?.isActive('orderedList')
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800',
                ].join(' ')}
              >
                1. List
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor || !editor.can().undo()}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Undo
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor || !editor.can().redo()}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
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

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 bg-white dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Bảng giá dịch vụ ({activeLang === 'vi' ? 'vi' : 'en'})
            </div>
            <button
              type="button"
              onClick={() => {
                const current = getPackages(activeLang);
                const next: PricingItem = {
                  name: activeLang === 'vi' ? 'Gói mới' : 'New package',
                  price: '',
                  desc: '',
                  features: [],
                };
                setPackages(activeLang, [...current, next]);
              }}
              className="w-full sm:w-auto px-3 py-1.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500"
            >
              Thêm gói
            </button>
          </div>
          <div className="space-y-4">
            {getPackages(activeLang).map((pkg, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên gói</label>
                    <input
                      type="text"
                      value={pkg.name}
                      onChange={(e) => {
                        const arr = getPackages(activeLang).slice();
                        arr[idx] = { ...arr[idx], name: e.target.value };
                        setPackages(activeLang, arr);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {activeLang === 'vi' && pricingErrors[`vi.${idx}.name`] && (
                      <p className="text-xs text-red-500 mt-1">{pricingErrors[`vi.${idx}.name`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Giá</label>
                    <input
                      type="text"
                      value={pkg.price}
                      onChange={(e) => {
                        const arr = getPackages(activeLang).slice();
                        arr[idx] = { ...arr[idx], price: e.target.value };
                        setPackages(activeLang, arr);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {activeLang === 'vi' && pricingErrors[`vi.${idx}.price`] && (
                      <p className="text-xs text-red-500 mt-1">{pricingErrors[`vi.${idx}.price`]}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mô tả</label>
                  <input
                    type="text"
                    value={pkg.desc}
                    onChange={(e) => {
                      const arr = getPackages(activeLang).slice();
                      arr[idx] = { ...arr[idx], desc: e.target.value };
                      setPackages(activeLang, arr);
                    }}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link nút chọn</label>
                  <input
                    type="text"
                    value={pkg.link || ''}
                    onChange={(e) => {
                      const arr = getPackages(activeLang).slice();
                      arr[idx] = { ...arr[idx], link: e.target.value };
                      setPackages(activeLang, arr);
                    }}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://..."
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tính năng (mỗi dòng 1 mục)
                  </label>
                  <textarea
                    rows={3}
                    value={
                      (activeLang === 'vi' ? featuresDraft.vi[idx] : featuresDraft.en[idx]) ??
                      (pkg.features || []).join('\n')
                    }
                    onChange={(e) => {
                      setFeaturesDraft((prev) => {
                        const next = { ...prev };
                        const map = activeLang === 'vi' ? { ...next.vi } : { ...next.en };
                        map[idx] = e.target.value;
                        if (activeLang === 'vi') next.vi = map;
                        else next.en = map;
                        return next;
                      });
                      const arr = getPackages(activeLang).slice();
                      arr[idx] = {
                        ...arr[idx],
                        features: e.target.value
                          .split('\n')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      };
                      setPackages(activeLang, arr);
                    }}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {activeLang === 'vi' && pricingErrors[`vi.${idx}.features`] && (
                    <p className="text-xs text-red-500 mt-1">{pricingErrors[`vi.${idx}.features`]}</p>
                  )}
                </div>
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <label className="inline-flex items-center gap-2 order-2 sm:order-1">
                    <input
                      type="checkbox"
                      checked={!!pkg.popular}
                      onChange={(e) => {
                        const arr = getPackages(activeLang).slice();
                        arr[idx] = { ...arr[idx], popular: e.target.checked };
                        setPackages(activeLang, arr);
                      }}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Đánh dấu nổi bật</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const arr = getPackages(activeLang).slice();
                      arr.splice(idx, 1);
                      setPackages(activeLang, arr);
                      setFeaturesDraft((prev) => {
                        const next = { ...prev };
                        const map = activeLang === 'vi' ? { ...next.vi } : { ...next.en };
                        // rebuild map indices after removal
                        const rebuilt: Record<number, string> = {};
                        const updatedPkgs = arr;
                        updatedPkgs.forEach((p, newIdx) => {
                          // try to preserve old draft by shifting indices if possible
                          rebuilt[newIdx] = map[newIdx] ?? (p.features || []).join('\n');
                        });
                        if (activeLang === 'vi') next.vi = rebuilt;
                        else next.en = rebuilt;
                        return next;
                      });
                    }}
                    className="order-1 sm:order-2 px-3 py-1.5 text-sm font-semibold rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    Xóa gói
                  </button>
                </div>
              </div>
            ))}
            {getPackages(activeLang).length === 0 && (
              <div className="text-sm text-slate-500 dark:text-slate-400">Chưa có gói nào. Nhấn “Thêm gói”.</div>
            )}
          </div>
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
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default WebDesignContentForm;
