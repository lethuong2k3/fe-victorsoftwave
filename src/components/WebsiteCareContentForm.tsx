import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Save, FileText } from 'lucide-react';
import { getAuthHeader } from '../utils/auth';
import { api } from '../utils/api';
import { getLocalizedSlug } from '../utils/localization';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Toast } from './Toast';

import { clearCache } from '../utils/cache';

type WebsiteCareContent = {
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
};

const emptyContent: WebsiteCareContent = {
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
};

const WebsiteCareContentForm: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi');
  const [formData, setFormData] = useState<WebsiteCareContent>(emptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const activeLangRef = useRef<'vi' | 'en'>('vi');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose max-w-none dark:prose-invert focus:outline-none min-h-[160px] px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData((prev) =>
        activeLangRef.current === 'vi'
          ? { ...prev, serviceDescriptionHtml: html }
          : { ...prev, serviceDescriptionHtmlEn: html },
      );
    },
  });

  useEffect(() => {
    activeLangRef.current = activeLang;
  }, [activeLang]);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await api.get('/api/pages/website-care');
        const serviceHtmlVi =
          data.serviceDescriptionHtml || `<p>${data.serviceIntro || ''}</p><p>${data.serviceSecondary || ''}</p>`;
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
        });
      } catch (error) {
        console.error('Failed to fetch content', error);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isEn = activeLang === 'en';

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setMessage({
        text: isEn ? 'Missing Cloudinary configuration.' : 'Thiếu cấu hình Cloudinary.',
        type: 'error',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setMessage({
        text: isEn ? 'Please select a valid image file.' : 'Vui lòng chọn file ảnh hợp lệ.',
        type: 'error',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        text: isEn ? 'Image size must not exceed 5MB.' : 'Kích thước ảnh không được vượt quá 5MB.',
        type: 'error',
      });
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        const url = data?.secure_url;

        if (url) {
          const fieldName = activeLang === 'vi' ? 'heroImageUrl' : 'heroImageUrlEn';
          setFormData((prev) => ({ ...prev, [fieldName]: url }));
          setMessage({
            text: isEn ? 'Image uploaded successfully!' : 'Upload ảnh thành công!',
            type: 'success',
          });
        } else {
          setMessage({
            text: isEn ? 'Invalid upload response.' : 'Phản hồi upload không hợp lệ.',
            type: 'error',
          });
        }
      } else {
        setMessage({
          text: isEn ? 'Image upload failed.' : 'Lỗi upload ảnh',
          type: 'error',
        });
      }
    } catch (error) {
      setMessage({
        text: isEn ? 'Network error while uploading image.' : 'Lỗi kết nối khi upload',
        type: 'error',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload: WebsiteCareContent = { ...formData };
      if (editor) {
        if (activeLangRef.current === 'vi') payload.serviceDescriptionHtml = editor.getHTML();
        else payload.serviceDescriptionHtmlEn = editor.getHTML();
      }
      await api.post('/api/pages/website-care', payload);
      clearCache();
      setMessage({ type: 'success', text: 'Đã lưu nội dung trang Chăm sóc Website.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi kết nối server.' });
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
            Nội dung Chăm sóc Website
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Chỉnh sửa phần hero và mô tả dịch vụ Chăm sóc Website</p>
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
            VI
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
            EN
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hero title (prefix)</label>
            <input
              type="text"
              name={activeLang === 'vi' ? 'heroTitlePrefix' : 'heroTitlePrefixEn'}
              value={activeLang === 'vi' ? formData.heroTitlePrefix : formData.heroTitlePrefixEn}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Giải Pháp Chăm Sóc Website"
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
              placeholder="Vận hành bền vững"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hero description</label>
          <textarea
            name={activeLang === 'vi' ? 'heroDescription' : 'heroDescriptionEn'}
            value={activeLang === 'vi' ? formData.heroDescription : formData.heroDescriptionEn}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mô tả dịch vụ (rich text)</label>
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

        <div className="grid md:grid-cols-2 gap-4">
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

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
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
                      ? formData.heroTitlePrefix || 'Chăm sóc Website toàn diện'
                      : formData.heroTitlePrefixEn || 'Website Care Services')}
                </div>
                <div className="text-sm text-green-700 dark:text-green-400">
                  victorsoftwave.com/{activeLang}/{getLocalizedSlug('cham-soc-website', activeLang)}
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {(activeLang === 'vi' ? formData.seoDescription : formData.seoDescriptionEn) ||
                    (activeLang === 'vi'
                      ? 'Giám sát uptime, bảo mật, sao lưu, tối ưu tốc độ và hỗ trợ kỹ thuật theo SLA.'
                      : 'Uptime monitoring, security, backups, performance optimization, and SLA-based support.')}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">Kiểm tra</div>
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <div>
                  URL:{' '}
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    /{activeLang}/{getLocalizedSlug('cham-soc-website', activeLang)}
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

      <Toast message={message} onClose={() => setMessage(null)} />
    </div>
  );
};

export default WebsiteCareContentForm;
