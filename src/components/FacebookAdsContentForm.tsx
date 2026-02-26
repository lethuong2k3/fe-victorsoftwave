import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Save, ImageIcon, Link as LinkIcon, Upload, Trash2 } from 'lucide-react';
import { api } from '@/utils/api';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toast } from '@/components/Toast';
import { getLocalizedSlug } from '@/utils/localization';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

type FacebookAdsContent = {
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
  consultationLink: string;
  seoTitleEn: string;
  seoKeywordsEn: string;
  seoDescriptionEn: string;
  primaryKeywordEn: string;
  consultationLinkEn: string;
};

const emptyContent: FacebookAdsContent = {
  heroTitlePrefix: '',
  heroTitleHighlight: '',
  heroDescription: '',
  heroImageUrl: '',
  serviceDescriptionHtml: '',
  suitableFor: '',
  suggestionText: '',
  consultationLink: '',
  heroTitlePrefixEn: '',
  heroTitleHighlightEn: '',
  heroDescriptionEn: '',
  heroImageUrlEn: '',
  serviceDescriptionHtmlEn: '',
  suitableForEn: '',
  suggestionTextEn: '',
  consultationLinkEn: '',
  seoTitle: '',
  seoKeywords: '',
  seoDescription: '',
  primaryKeyword: '',
  seoTitleEn: '',
  seoKeywordsEn: '',
  seoDescriptionEn: '',
  primaryKeywordEn: '',
};

const FacebookAdsContentForm: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi');
  const [formData, setFormData] = useState<FacebookAdsContent>(emptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const activeLangRef = useRef<'vi' | 'en'>('vi');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    fetchContent();
  }, []);

  useEffect(() => {
    activeLangRef.current = activeLang;
    if (editor) {
      const content =
        activeLang === 'vi' ? formData.serviceDescriptionHtml : formData.serviceDescriptionHtmlEn;
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content || '');
      }
    }
  }, [activeLang, editor, formData.serviceDescriptionHtml, formData.serviceDescriptionHtmlEn]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await api.get<any>('/api/pages/facebook-ads');
      setFormData(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể tải dữ liệu.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const saved = await api.post<any>('/api/pages/facebook-ads', formData);
      setFormData(saved);
      setMessage({ type: 'success', text: 'Lưu nội dung thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi lưu.' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setMessage({ type: 'error', text: 'Thiếu cấu hình Cloudinary.' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Vui lòng chọn file ảnh hợp lệ.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Kích thước ảnh không được vượt quá 5MB.' });
      return;
    }

    setUploading(true);

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
        const imageUrl = data?.secure_url;

        if (imageUrl) {
          setFormData((prev) => ({
            ...prev,
            [activeLang === 'vi' ? 'heroImageUrl' : 'heroImageUrlEn']: imageUrl,
          }));
          setMessage({ type: 'success', text: 'Tải ảnh lên thành công!' });
        } else {
          setMessage({ type: 'error', text: 'Phản hồi upload không hợp lệ.' });
        }
      } else {
        setMessage({ type: 'error', text: 'Tải ảnh thất bại.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi kết nối khi tải ảnh.' });
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     handleImageUpload(e);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      [activeLang === 'vi' ? 'heroImageUrl' : 'heroImageUrlEn']: '',
    }));
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Quản lý nội dung Facebook Ads
        </h2>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveLang('vi')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeLang === 'vi'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Tiếng Việt
          </button>
          <button
            onClick={() => setActiveLang('en')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeLang === 'en'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            English
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-[1.2fr,1fr] gap-6 items-start">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tiêu đề nhỏ
              </label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'heroTitlePrefix' : 'heroTitlePrefixEn'}
                value={
                  activeLang === 'vi'
                    ? formData.heroTitlePrefix
                    : formData.heroTitlePrefixEn
                }
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tiêu đề chính
              </label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'heroTitleHighlight' : 'heroTitleHighlightEn'}
                value={
                  activeLang === 'vi'
                    ? formData.heroTitleHighlight
                    : formData.heroTitleHighlightEn
                }
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mô tả ngắn
              </label>
              <textarea
                name={activeLang === 'vi' ? 'heroDescription' : 'heroDescriptionEn'}
                value={
                  activeLang === 'vi'
                    ? formData.heroDescription
                    : formData.heroDescriptionEn
                }
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Ảnh hero
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Khuyến nghị 1200x900, dung lượng tối đa 5MB.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Upload size={14} />
                  Tải ảnh lên
                </button>
                {((activeLang === 'vi' && formData.heroImageUrl) ||
                  (activeLang === 'en' && formData.heroImageUrlEn)) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <Trash2 size={14} />
                    Xóa
                  </button>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <div className="relative rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 overflow-hidden">
              {uploading && (
                <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center z-10">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400 mb-2" />
                  <div className="mt-1 text-sm font-medium text-slate-200">
                    Đang tải lên...
                  </div>
                </div>
              )}
              {((activeLang === 'vi' && formData.heroImageUrl) ||
                (activeLang === 'en' && formData.heroImageUrlEn)) ? (
                <div className="relative aspect-[4/3]">
                  <img
                    src={
                      activeLang === 'vi'
                        ? formData.heroImageUrl
                        : formData.heroImageUrlEn || formData.heroImageUrl
                    }
                    alt="Facebook Ads hero"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 text-xs font-medium text-slate-800">
                      <ImageIcon size={14} />
                      <span>Preview hero</span>
                    </div>
                    <button
                      type="button"
                      onClick={openFilePicker}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 text-xs font-medium text-white hover:bg-slate-900"
                    >
                      <Upload size={14} />
                      Đổi ảnh
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="w-full flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="font-medium mb-1">Chọn ảnh hero cho Facebook Ads</div>
                  <div className="text-xs">
                    Nhấn để tải ảnh lên hoặc kéo thả vào đây.
                  </div>
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Hoặc dán URL ảnh
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'heroImageUrl' : 'heroImageUrlEn'}
                  value={
                    activeLang === 'vi'
                      ? formData.heroImageUrl
                      : formData.heroImageUrlEn
                  }
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/facebook-ads-hero.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Mô tả dịch vụ Facebook Ads
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Nội dung hiển thị ở phần Mô tả dịch vụ trên trang Facebook Ads.
              </p>
            </div>
          </div>

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
                Đậm
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                disabled={!editor}
                className={[
                  'px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all',
                  editor?.isActive('bulletList')
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800',
                ].join(' ')}
              >
                Danh sách
              </button>
            </div>
            <div className="max-h-[360px] overflow-y-auto">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Phù hợp cho
            </label>
            <textarea
              name={activeLang === 'vi' ? 'suitableFor' : 'suitableForEn'}
              value={
                activeLang === 'vi'
                  ? formData.suitableFor
                  : formData.suitableForEn
              }
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Dòng 1...\nDòng 2...\nDòng 3..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Gợi ý triển khai
            </label>
            <textarea
              name={activeLang === 'vi' ? 'suggestionText' : 'suggestionTextEn'}
              value={
                activeLang === 'vi'
                  ? formData.suggestionText
                  : formData.suggestionTextEn
              }
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Link liên hệ tư vấn
            </label>
            <input
              type="text"
              name={activeLang === 'vi' ? 'consultationLink' : 'consultationLinkEn'}
              value={
                activeLang === 'vi'
                  ? formData.consultationLink
                  : formData.consultationLinkEn
              }
              onChange={handleChange}
              placeholder="https://zalo.me/..."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/30">
          <div className="text-sm font-bold text-slate-900 dark:text-white">SEO</div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                SEO Title
              </label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'seoTitle' : 'seoTitleEn'}
                value={
                  activeLang === 'vi' ? formData.seoTitle : formData.seoTitleEn
                }
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Keyword chính
              </label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'primaryKeyword' : 'primaryKeywordEn'}
                value={
                  activeLang === 'vi'
                    ? formData.primaryKeyword
                    : formData.primaryKeywordEn
                }
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              SEO Keywords
            </label>
            <textarea
              name={activeLang === 'vi' ? 'seoKeywords' : 'seoKeywordsEn'}
              value={
                activeLang === 'vi'
                  ? formData.seoKeywords
                  : formData.seoKeywordsEn
              }
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              SEO Description
            </label>
            <textarea
              name={activeLang === 'vi' ? 'seoDescription' : 'seoDescriptionEn'}
              value={
                activeLang === 'vi'
                  ? formData.seoDescription
                  : formData.seoDescriptionEn
              }
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
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Preview
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/40 space-y-2">
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {(activeLang === 'vi' ? formData.seoTitle : formData.seoTitleEn) ||
                    (activeLang === 'vi'
                      ? formData.heroTitlePrefix || 'Dịch vụ Quảng cáo Facebook'
                      : formData.heroTitlePrefixEn || 'Facebook Advertising Service')}
                </div>
                <div className="text-sm text-green-700 dark:text-green-400">
                  victorsoftwave.com/{activeLang}/
                  {getLocalizedSlug('facebook-ads', activeLang)}
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {(activeLang === 'vi'
                    ? formData.seoDescription
                    : formData.seoDescriptionEn) ||
                    (activeLang === 'vi'
                      ? 'Dịch vụ chạy quảng cáo Facebook chuyên nghiệp, tập trung tối ưu chuyển đổi và chi phí.'
                      : 'Professional Facebook Ads service focused on conversions and cost efficiency.')}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Kiểm tra
              </div>
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <div>
                  URL:{' '}
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    /{activeLang}/{getLocalizedSlug('facebook-ads', activeLang)}
                  </span>
                </div>
                <div>
                  Keyword chính:{' '}
                  <span className="font-medium">
                    {(activeLang === 'vi'
                      ? formData.primaryKeyword
                      : formData.primaryKeywordEn) || '(chưa đặt)'}
                  </span>
                </div>
                <div>
                  Số lượng Keywords:{' '}
                  <span className="font-medium">
                    {((activeLang === 'vi'
                      ? formData.seoKeywords
                      : formData.seoKeywordsEn) || '')
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
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save size={18} />
            <span>Lưu nội dung</span>
          </button>
        </div>
      </form>

      {message && (
        <Toast
          message={message}
          onClose={() => setMessage(null)}
        />
      )}
    </div>
  );
};

export default FacebookAdsContentForm;

