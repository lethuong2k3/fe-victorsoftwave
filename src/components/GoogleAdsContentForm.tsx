import React, { useEffect, useState, useRef } from 'react';
import { Loader2, Save, Upload, Link as LinkIcon, ImageIcon, Trash2 } from 'lucide-react';
<<<<<<< HEAD

=======
import { getAuthHeader } from '../utils/auth';
>>>>>>> b2df92e (first commit)
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Toast, ToastMessage } from './Toast';
<<<<<<< HEAD
import { getLocalizedSlug } from '@/utils/localization';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
=======
import { getLocalizedSlug } from '../utils/localization';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '../utils/api';
>>>>>>> b2df92e (first commit)

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

type GoogleAdsContent = {
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

const emptyContent: GoogleAdsContent = {
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

export const GoogleAdsContentForm: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<GoogleAdsContent>(emptyContent);
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi');
  const activeLangRef = useRef<'vi' | 'en'>('vi');
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
=======
>>>>>>> b2df92e (first commit)
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    activeLangRef.current = activeLang;
  }, [activeLang]);

  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ['google-ads-content'],
<<<<<<< HEAD
    queryFn: () => api.get<GoogleAdsContent>('/api/pages/google-ads'),
=======
    queryFn: () => fetcher<GoogleAdsContent>('/api/pages/google-ads'),
>>>>>>> b2df92e (first commit)
  });

  useEffect(() => {
    if (fetchedData) {
<<<<<<< HEAD
      setFormData((prev) => ({ ...prev, ...fetchedData }));
=======
      setFormData(fetchedData);
>>>>>>> b2df92e (first commit)
    }
  }, [fetchedData]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData((prev) => ({
        ...prev,
        [activeLangRef.current === 'vi' ? 'serviceDescriptionHtml' : 'serviceDescriptionHtmlEn']: html,
      }));
    },
  });

  useEffect(() => {
    if (editor) {
      const content =
        activeLang === 'vi' ? formData.serviceDescriptionHtml : formData.serviceDescriptionHtmlEn;
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content || '');
      }
    }
  }, [activeLang, editor, formData.serviceDescriptionHtml, formData.serviceDescriptionHtmlEn]);

<<<<<<< HEAD

=======
  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pages/google-ads');
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Failed to fetch Google Ads content:', error);
    } finally {
      setLoading(false);
    }
  };
>>>>>>> b2df92e (first commit)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: async (data: GoogleAdsContent) => {
<<<<<<< HEAD
      return api.post('/api/pages/google-ads', data);
    },
    onSuccess: (savedData) => {
      setFormData((prev) => ({ ...prev, ...savedData }));
=======
      return fetcher<GoogleAdsContent>('/api/pages/google-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: (savedData) => {
      setFormData(savedData);
>>>>>>> b2df92e (first commit)
      setToast({ text: 'Lưu nội dung thành công!', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['google-ads-content'] });
    },
    onError: () => {
      setToast({ text: 'Lỗi khi lưu nội dung', type: 'error' });
    },
  });

  const handleSave = () => {
    mutation.mutate(formData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isEn = activeLang === 'en';

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setToast({
        text: isEn ? 'Missing Cloudinary configuration.' : 'Thiếu cấu hình Cloudinary.',
        type: 'error',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setToast({
        text: isEn ? 'Please select a valid image file.' : 'Vui lòng chọn file ảnh hợp lệ.',
        type: 'error',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast({
        text: isEn ? 'Image size must not exceed 5MB.' : 'Kích thước ảnh không được vượt quá 5MB.',
        type: 'error',
      });
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
        const url = data?.secure_url;

        if (url) {
          const fieldName = activeLang === 'vi' ? 'heroImageUrl' : 'heroImageUrlEn';
          setFormData((prev) => ({ ...prev, [fieldName]: url }));
          setToast({
            text: isEn ? 'Image uploaded successfully!' : 'Upload ảnh thành công!',
            type: 'success',
          });
        } else {
          setToast({
            text: isEn ? 'Invalid upload response.' : 'Phản hồi upload không hợp lệ.',
            type: 'error',
          });
        }
      } else {
        setToast({
          text: isEn ? 'Image upload failed.' : 'Lỗi upload ảnh',
          type: 'error',
        });
      }
    } catch (error) {
      setToast({
        text: isEn ? 'Network error while uploading image.' : 'Lỗi kết nối khi upload',
        type: 'error',
      });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {toast && (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý trang Google Ads</h2>
          <p className="text-slate-500 dark:text-slate-400">Chỉnh sửa nội dung trang Google Ads</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveLang('vi')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeLang === 'vi'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Tiếng Việt
            </button>
            <button
              onClick={() => setActiveLang('en')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeLang === 'en'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              English
            </button>
          </div>

        </div>
      </div>

      <div className="grid gap-8">
        {/* Hero Section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            Hero Section ({activeLang.toUpperCase()})
          </h3>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title Prefix</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'heroTitlePrefix' : 'heroTitlePrefixEn'}
                  value={activeLang === 'vi' ? formData.heroTitlePrefix : formData.heroTitlePrefixEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title Highlight</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'heroTitleHighlight' : 'heroTitleHighlightEn'}
                  value={activeLang === 'vi' ? formData.heroTitleHighlight : formData.heroTitleHighlightEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mô tả Hero</label>
              <textarea
                name={activeLang === 'vi' ? 'heroDescription' : 'heroDescriptionEn'}
                value={activeLang === 'vi' ? formData.heroDescription : formData.heroDescriptionEn}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
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
        </div>

        {/* Content Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            Nội dung chi tiết ({activeLang.toUpperCase()})
          </h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Mô tả dịch vụ (Rich Text)
            </label>
            <div className="rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="flex flex-wrap gap-2 p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                    editor?.isActive('heading', { level: 2 })
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                    editor?.isActive('heading', { level: 3 })
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                    editor?.isActive('bold')
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                    editor?.isActive('underline')
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  U
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                    editor?.isActive('bulletList')
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  List
                </button>
              </div>
              <EditorContent editor={editor} className="prose dark:prose-invert max-w-none p-4 min-h-[200px]" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phù hợp cho (Mỗi dòng 1 ý)
              </label>
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Gợi ý triển khai
              </label>
              <textarea
                name={activeLang === 'vi' ? 'suggestionText' : 'suggestionTextEn'}
                value={activeLang === 'vi' ? formData.suggestionText : formData.suggestionTextEn}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-900/30">
          <div className="text-sm font-bold text-slate-900 dark:text-white">SEO Configuration</div>
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

        {/* SEO Review */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <h4 className="text-md font-semibold mb-4 text-slate-800 dark:text-slate-200">
            SEO Review ({activeLang.toUpperCase()})
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">Preview Google Search</div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/40 space-y-2">
                <div className="text-lg font-semibold text-blue-800 dark:text-blue-400 truncate">
                  {(activeLang === 'vi' ? formData.seoTitle : formData.seoTitleEn) ||
                    (activeLang === 'vi'
                      ? formData.heroTitlePrefix || 'Dịch vụ Quảng cáo Google Ads'
                      : formData.heroTitlePrefixEn || 'Google Ads Service')}
                </div>
                <div className="text-sm text-green-700 dark:text-green-400 truncate">
                  victorsoftwave.com/{activeLang}/{getLocalizedSlug('google-ads', activeLang)}
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                  {(activeLang === 'vi' ? formData.seoDescription : formData.seoDescriptionEn) ||
                    (activeLang === 'vi'
                      ? 'Dịch vụ chạy quảng cáo Google Ads chuyên nghiệp, tối ưu chi phí và hiệu quả chuyển đổi.'
                      : 'Professional Google Ads service, optimizing costs and conversion rates.')}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">Checklist</div>
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <div>
                  URL:{' '}
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    /{activeLang}/{getLocalizedSlug('google-ads', activeLang)}
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
            onClick={handleSave}
            disabled={mutation.isPending}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-1"
          >
            {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>Lưu tất cả thay đổi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
