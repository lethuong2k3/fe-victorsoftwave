import React, { useEffect, useState } from 'react';
import { clearCache } from '../utils/cache';
import { Loader2, Save, Home, Image as ImageIcon, Upload, Link as LinkIcon, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { getAuthHeader } from '../utils/auth';
import { Toast } from './Toast';

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  link: string;
};

type MarketingPlatformItem = {
  key: 'tiktok' | 'facebook' | 'google';
  title: string;
  description: string;
  imageUrl: string;
};

const getServicesList = (json: string): ServiceItem[] => {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
  } catch {
    return [];
  }
};

const getMarketingPlatformsList = (json: string): MarketingPlatformItem[] => {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
  } catch {
    return [];
  }
};

type HomeContent = {
  id?: number | null;
  badgeText: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  benefit1: string;
  benefit2: string;
  benefit3: string;
  // Services
  servicesTitle: string;
  servicesDescription: string;
  servicesListJsonVi: string;
  // Marketing
  marketingBadge: string;
  marketingTitle: string;
  marketingCtaText: string;
  marketingPlatformsJsonVi: string;
  // Portfolio
  portfolioTitle: string;
  portfolioDescription: string;
  // Blog
  blogTitle: string;
  blogViewAllText: string;
  // Contact
  contactTitle: string;
  contactDescription: string;
  contactHotlineLabel: string;
  contactEmailLabel: string;
  contactAddressLabel: string;
  contactAddressValue: string;
  contactHotline: string;
  contactEmail: string;
  contactMapUrl: string;
  
  badgeTextEn: string;
  titlePrefixEn: string;
  titleHighlightEn: string;
  titleSuffixEn: string;
  descriptionEn: string;
  ctaPrimaryTextEn: string;
  ctaSecondaryTextEn: string;
  benefit1En: string;
  benefit2En: string;
  benefit3En: string;
  // Hero Image
  heroImageUrl: string;
  heroImageUrlEn: string;
  // SEO Vi
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  primaryKeyword: string;
  // SEO En
  seoTitleEn: string;
  seoDescriptionEn: string;
  seoKeywordsEn: string;
  primaryKeywordEn: string;
  // Services En
  servicesTitleEn: string;
  servicesDescriptionEn: string;
  servicesListJsonEn: string;
  // Marketing En
  marketingBadgeEn: string;
  marketingTitleEn: string;
  marketingCtaTextEn: string;
  marketingPlatformsJsonEn: string;
  // Portfolio En
  portfolioTitleEn: string;
  portfolioDescriptionEn: string;
  // Blog En
  blogTitleEn: string;
  blogViewAllTextEn: string;
  // Contact En
  contactTitleEn: string;
  contactDescriptionEn: string;
  contactHotlineLabelEn: string;
  contactEmailLabelEn: string;
  contactAddressLabelEn: string;
  contactAddressValueEn: string;
  zaloUrl: string;
  facebookUrl: string;
  messengerUrl: string;
  adminChatUrl: string;
};

const emptyContent: HomeContent = {
  badgeText: '',
  titlePrefix: '',
  titleHighlight: '',
  titleSuffix: '',
  description: '',
  ctaPrimaryText: '',
  ctaSecondaryText: '',
  benefit1: '',
  benefit2: '',
  benefit3: '',
  heroImageUrl: '',
  servicesTitle: '',
  servicesDescription: '',
  servicesListJsonVi: '',
  marketingBadge: '',
  marketingTitle: '',
  marketingCtaText: '',
  marketingPlatformsJsonVi: '',
  portfolioTitle: '',
  portfolioDescription: '',
  blogTitle: '',
  blogViewAllText: '',
  contactTitle: '',
  contactDescription: '',
  contactHotlineLabel: '',
  contactEmailLabel: '',
  contactAddressLabel: '',
  contactAddressValue: '',
  contactHotline: '',
  contactEmail: '',
  contactMapUrl: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  primaryKeyword: '',
  
  badgeTextEn: '',
  titlePrefixEn: '',
  titleHighlightEn: '',
  titleSuffixEn: '',
  descriptionEn: '',
  heroImageUrlEn: '',
  ctaPrimaryTextEn: '',
  ctaSecondaryTextEn: '',
  benefit1En: '',
  benefit2En: '',
  benefit3En: '',
  servicesTitleEn: '',
  servicesDescriptionEn: '',
  servicesListJsonEn: '',
  marketingBadgeEn: '',
  marketingTitleEn: '',
  marketingCtaTextEn: '',
  marketingPlatformsJsonEn: '',
  portfolioTitleEn: '',
  portfolioDescriptionEn: '',
  blogTitleEn: '',
  blogViewAllTextEn: '',
  contactTitleEn: '',
  contactDescriptionEn: '',
  contactHotlineLabelEn: '',
  contactEmailLabelEn: '',
  contactAddressLabelEn: '',
  contactAddressValueEn: '',
  zaloUrl: '',
  facebookUrl: '',
  messengerUrl: '',
  adminChatUrl: '',
  seoTitleEn: '',
  seoDescriptionEn: '',
  seoKeywordsEn: '',
  primaryKeywordEn: '',
};

const HomeContentForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<HomeContent>(emptyContent);
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi');
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const platformFileInputsRef = React.useRef<Record<number, HTMLInputElement | null>>({});
  const [platformUploading, setPlatformUploading] = useState<Record<number, boolean>>({});
  const [platformUploadProgress, setPlatformUploadProgress] = useState<Record<number, number>>({});

  const currentSeoTitle = activeLang === 'vi' ? formData.seoTitle : formData.seoTitleEn;
  const currentSeoDescription = activeLang === 'vi' ? formData.seoDescription : formData.seoDescriptionEn;
  const currentSeoKeywords = activeLang === 'vi' ? formData.seoKeywords : formData.seoKeywordsEn;
  const currentPrimaryKeyword = activeLang === 'vi' ? formData.primaryKeyword : formData.primaryKeywordEn;
  const keywordList = (currentSeoKeywords || '').split(',').map((s) => s.trim()).filter(Boolean);
  const titleLen = (currentSeoTitle || '').length;
  const descLen = (currentSeoDescription || '').length;
  const primaryInTitle = currentPrimaryKeyword ? (currentSeoTitle || '').toLowerCase().includes(currentPrimaryKeyword.toLowerCase()) : false;
  const primaryInDesc = currentPrimaryKeyword ? (currentSeoDescription || '').toLowerCase().includes(currentPrimaryKeyword.toLowerCase()) : false;

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/pages/home?_t=${Date.now()}`, {
          headers: {
            ...getAuthHeader(),
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            ...emptyContent,
            ...data,
          });
        } else if (response.status === 401) {
          setMessage({ type: 'error', text: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleImageUpload = async (file: File) => {
    if (!file || !CLOUD_NAME || !UPLOAD_PRESET) {
      setMessage({ type: 'error', text: 'Thiếu cấu hình Cloudinary hoặc file không hợp lệ.' });
      return;
    }
    setUploading(true);
    try {
      const data = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
        xhr.onload = () => {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (err) {
            reject(err);
          }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        const form = new FormData();
        form.append('file', file);
        form.append('upload_preset', UPLOAD_PRESET);
        xhr.send(form);
      });
      if (data.secure_url) {
        const fieldName = activeLang === 'vi' ? 'heroImageUrl' : 'heroImageUrlEn';
        setFormData((prev) => ({ ...prev, [fieldName]: data.secure_url }));
        setMessage({ type: 'success', text: 'Tải ảnh lên thành công!' });
      } else {
        setMessage({ type: 'error', text: 'Không thể tải ảnh lên Cloudinary.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Lỗi tải ảnh lên Cloudinary.' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };
  
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  
  const clearHeroImage = () => {
    const fieldName = activeLang === 'vi' ? 'heroImageUrl' : 'heroImageUrlEn';
    setFormData((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const getServicesList = (): ServiceItem[] => {
    const json = activeLang === 'vi' ? formData.servicesListJsonVi : formData.servicesListJsonEn;
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      // ignore
    }
    return [];
  };

  const handleServiceChange = (index: number, field: keyof ServiceItem, value: string) => {
    const currentList = getServicesList();
    const newList = [...currentList];
    newList[index] = { ...newList[index], [field]: value };
    
    const jsonStr = JSON.stringify(newList);
    const fieldName = activeLang === 'vi' ? 'servicesListJsonVi' : 'servicesListJsonEn';
    
    setFormData(prev => ({ ...prev, [fieldName]: jsonStr }));
  };

  const getMarketingPlatformsList = (): MarketingPlatformItem[] => {
    const json = activeLang === 'vi' ? formData.marketingPlatformsJsonVi : formData.marketingPlatformsJsonEn;
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      // ignore
    }
    return [];
  };

  const handleMarketingPlatformChange = (index: number, field: keyof MarketingPlatformItem, value: string) => {
    const currentList = getMarketingPlatformsList();
    const newList = [...currentList];
    newList[index] = { ...newList[index], [field]: value };
    const jsonStr = JSON.stringify(newList);
    const fieldName = activeLang === 'vi' ? 'marketingPlatformsJsonVi' : 'marketingPlatformsJsonEn';
    setFormData(prev => ({ ...prev, [fieldName]: jsonStr }));
  };

  const handleMarketingPlatformImageUpload = async (index: number, file: File) => {
    if (!file || !CLOUD_NAME || !UPLOAD_PRESET) {
      setMessage({ type: 'error', text: 'Thiếu cấu hình Cloudinary hoặc file không hợp lệ.' });
      return;
    }
    setPlatformUploading(prev => ({ ...prev, [index]: true }));
    try {
      const data = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
        xhr.onload = () => {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (err) {
            reject(err);
          }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setPlatformUploadProgress(prev => ({ ...prev, [index]: pct }));
          }
        };
        const form = new FormData();
        form.append('file', file);
        form.append('upload_preset', UPLOAD_PRESET);
        xhr.send(form);
      });
      if (data.secure_url) {
        const list = getMarketingPlatformsList();
        const updated = [...list];
        updated[index] = { ...updated[index], imageUrl: data.secure_url };
        const jsonStr = JSON.stringify(updated);
        const fieldName = activeLang === 'vi' ? 'marketingPlatformsJsonVi' : 'marketingPlatformsJsonEn';
        setFormData(prev => ({ ...prev, [fieldName]: jsonStr }));
        setMessage({ type: 'success', text: 'Tải ảnh nền tảng lên thành công!' });
      } else {
        setMessage({ type: 'error', text: 'Không thể tải ảnh lên Cloudinary.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Lỗi tải ảnh lên Cloudinary.' });
    } finally {
      setPlatformUploading(prev => ({ ...prev, [index]: false }));
      setPlatformUploadProgress(prev => ({ ...prev, [index]: 0 }));
    }
  };

  const viValidationSchema = z
    .object({
      titlePrefix: z
        .string()
        .trim()
        .min(1, 'Bắt buộc')
        .max(255, 'Tối đa 255 ký tự'),
      titleHighlight: z
        .string()
        .trim()
        .min(1, 'Bắt buộc')
        .max(255, 'Tối đa 255 ký tự'),
      description: z
        .string()
        .trim()
        .min(1, 'Bắt buộc')
        .max(1000, 'Tối đa 1000 ký tự'),
      servicesTitle: z
        .string()
        .trim()
        .min(1, 'Bắt buộc')
        .max(255, 'Tối đa 255 ký tự'),
      marketingTitle: z
        .string()
        .trim()
        .min(1, 'Bắt buộc')
        .max(255, 'Tối đa 255 ký tự'),
      portfolioTitle: z
        .string()
        .trim()
        .min(1, 'Bắt buộc')
        .max(255, 'Tối đa 255 ký tự'),
      blogTitle: z
        .string()
        .trim()
        .min(1, 'Bắt buộc')
        .max(255, 'Tối đa 255 ký tự'),
      contactTitle: z
        .string()
        .trim()
        .min(1, 'Bắt buộc')
        .max(255, 'Tối đa 255 ký tự'),
      seoTitle: z
        .string()
        .max(255, 'Tối đa 255 ký tự')
        .optional()
        .or(z.literal('')),
      seoDescription: z
        .string()
        .max(1000, 'Tối đa 1000 ký tự')
        .optional()
        .or(z.literal('')),
      seoKeywords: z
        .string()
        .max(500, 'Tối đa 500 ký tự')
        .optional()
        .or(z.literal('')),
    })
    .passthrough();

  const validateClient = (): boolean => {
    if (activeLang !== 'vi') {
      setErrors({});
      return true;
    }
    const result = viValidationSchema.safeParse(formData);
    if (result.success) {
      setFormData((prev) => ({ ...prev, ...result.data }));
      setErrors({});
      return true;
    }
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as string | undefined;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });
    setErrors(fieldErrors);
    return false;
  };

  const handleSave = async () => {
    if (!validateClient()) {
      setMessage({ type: 'error', text: 'Vui lòng kiểm tra các trường bắt buộc.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch('/api/pages/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Lưu nội dung thành công!' });
        const savedData = await response.json();
        setFormData((prev) => ({ ...prev, ...savedData }));
        setErrors({});
        clearCache();
      } else {
        if (response.headers.get('content-type')?.includes('application/json')) {
          const data = await response.json();
          if (data && typeof data === 'object') {
            setErrors(data as Record<string, string>);
            setMessage({ type: 'error', text: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.' });
          } else {
            setMessage({ type: 'error', text: 'Có lỗi xảy ra khi lưu.' });
          }
        } else {
          setMessage({ type: 'error', text: 'Có lỗi xảy ra khi lưu.' });
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: 'Lỗi kết nối đến server.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Home className="text-blue-600" />
            Quản lý nội dung Trang chủ
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Chỉnh sửa nội dung Hero section và các thông tin chính.</p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveLang('vi')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeLang === 'vi'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Tiếng Việt
          </button>
          <button
            onClick={() => setActiveLang('en')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeLang === 'en'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            English
          </button>
        </div>
      </div>

      <Toast message={message} onClose={() => setMessage(null)} />

      <div className="grid gap-8">
        {/* Hero Section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Hero Section ({activeLang.toUpperCase()})</h3>
          <div className="grid gap-6">
            {/* Hero Image */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Ảnh Hero
              </label>
              <div className="space-y-4">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="relative w-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex flex-col items-center justify-center"
                >
                  {(activeLang === 'vi' ? formData.heroImageUrl : formData.heroImageUrlEn) ? (
                    <div className="w-full">
                      <img
                        src={activeLang === 'vi' ? formData.heroImageUrl : formData.heroImageUrlEn}
                        alt="Hero"
                        className="w-full h-auto max-h-64 object-contain bg-slate-100 dark:bg-slate-800 rounded-lg"
                      />
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-3 gap-3">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-sm text-slate-600 dark:text-slate-400 flex-1">
                          <LinkIcon className="w-4 h-4 hidden sm:block" />
                          <input
                            type="text"
                            name={activeLang === 'vi' ? 'heroImageUrl' : 'heroImageUrlEn'}
                            value={activeLang === 'vi' ? formData.heroImageUrl : formData.heroImageUrlEn}
                            onChange={handleChange}
                            className="flex-1 w-full px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                            placeholder="https://..."
                          />
                        </div>
                        <button
                          type="button"
                          onClick={clearHeroImage}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" /> Xóa ảnh
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center space-y-3 w-full">
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Kéo thả ảnh vào đây, hoặc chọn ảnh để tải lên</p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-lg">
                        <button
                          type="button"
                          onClick={openFileDialog}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 shrink-0"
                        >
                          <Upload className="w-4 h-4" /> Chọn ảnh
                        </button>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-sm text-slate-600 dark:text-slate-400 flex-1">
                          <LinkIcon className="w-4 h-4 hidden sm:block" />
                          <input
                            type="text"
                            name={activeLang === 'vi' ? 'heroImageUrl' : 'heroImageUrlEn'}
                            value={activeLang === 'vi' ? formData.heroImageUrl : formData.heroImageUrlEn}
                            onChange={handleChange}
                            className="flex-1 w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                  />
                  {uploading && (
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded">
                        <div
                          className="h-2 bg-blue-600 rounded transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Badge Text (Nhãn nhỏ trên cùng)</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'badgeText' : 'badgeTextEn'}
                  value={activeLang === 'vi' ? formData.badgeText : formData.badgeTextEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder={activeLang === 'vi' ? "#1 Đơn vị thiết kế..." : "#1 Prestigious Web Design..."}
                />
                {activeLang === 'vi' && errors.badgeText && (
                  <p className="text-xs text-red-500 mt-1">{errors.badgeText}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title Prefix (Dòng 1)</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'titlePrefix' : 'titlePrefixEn'}
                  value={activeLang === 'vi' ? formData.titlePrefix : formData.titlePrefixEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {activeLang === 'vi' && errors.titlePrefix && (
                  <p className="text-xs text-red-500 mt-1">{errors.titlePrefix}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title Highlight (Dòng 2 - Màu gradient)</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'titleHighlight' : 'titleHighlightEn'}
                  value={activeLang === 'vi' ? formData.titleHighlight : formData.titleHighlightEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {activeLang === 'vi' && errors.titleHighlight && (
                  <p className="text-xs text-red-500 mt-1">{errors.titleHighlight}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title Suffix (Dòng 3)</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'titleSuffix' : 'titleSuffixEn'}
                  value={activeLang === 'vi' ? formData.titleSuffix : formData.titleSuffixEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                name={activeLang === 'vi' ? 'description' : 'descriptionEn'}
                value={activeLang === 'vi' ? formData.description : formData.descriptionEn}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
              {activeLang === 'vi' && errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Primary CTA Text</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'ctaPrimaryText' : 'ctaPrimaryTextEn'}
                  value={activeLang === 'vi' ? formData.ctaPrimaryText : formData.ctaPrimaryTextEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Secondary CTA Text</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'ctaSecondaryText' : 'ctaSecondaryTextEn'}
                  value={activeLang === 'vi' ? formData.ctaSecondaryText : formData.ctaSecondaryTextEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Benefit 1</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'benefit1' : 'benefit1En'}
                  value={activeLang === 'vi' ? formData.benefit1 : formData.benefit1En}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Benefit 2</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'benefit2' : 'benefit2En'}
                  value={activeLang === 'vi' ? formData.benefit2 : formData.benefit2En}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Benefit 3</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'benefit3' : 'benefit3En'}
                  value={activeLang === 'vi' ? formData.benefit3 : formData.benefit3En}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">SEO ({activeLang.toUpperCase()})</h3>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SEO Title</label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'seoTitle' : 'seoTitleEn'}
                value={activeLang === 'vi' ? formData.seoTitle : formData.seoTitleEn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {activeLang === 'vi' && errors.seoTitle && (
                <p className="text-xs text-red-500 mt-1">{errors.seoTitle}</p>
              )}
            </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Keyword chính</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'primaryKeyword' : 'primaryKeywordEn'}
                  value={activeLang === 'vi' ? formData.primaryKeyword : formData.primaryKeywordEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SEO Keywords</label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'seoKeywords' : 'seoKeywordsEn'}
                value={activeLang === 'vi' ? formData.seoKeywords : formData.seoKeywordsEn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Ví dụ: thiết kế website, SEO tổng thể, digital marketing"
              />
              {activeLang === 'vi' && errors.seoKeywords && (
                <p className="text-xs text-red-500 mt-1">{errors.seoKeywords}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SEO Description</label>
              <textarea
                name={activeLang === 'vi' ? 'seoDescription' : 'seoDescriptionEn'}
                value={activeLang === 'vi' ? formData.seoDescription : formData.seoDescriptionEn}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
              {activeLang === 'vi' && errors.seoDescription && (
                <p className="text-xs text-red-500 mt-1">{errors.seoDescription}</p>
              )}
            </div>
            <div className="grid gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <h4 className="text-md font-semibold mb-4 text-slate-800 dark:text-slate-200">SEO Review ({activeLang.toUpperCase()})</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Preview</div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/40 space-y-2">
                      <div className={`text-lg font-semibold ${titleLen >= 50 && titleLen <= 60 ? 'text-blue-600' : 'text-slate-800 dark:text-slate-200'}`}>
                        {currentSeoTitle || '(Chưa có tiêu đề)'}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-400">victorsoftwave.com</div>
                      <div className={`text-sm ${descLen >= 150 && descLen <= 160 ? 'text-slate-600 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {currentSeoDescription || '(Chưa có mô tả)'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Kiểm tra</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {titleLen >= 50 && titleLen <= 60 ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm">Độ dài Title: {titleLen} ký tự</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {descLen >= 150 && descLen <= 160 ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm">Độ dài Description: {descLen} ký tự</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {primaryInTitle ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm">Keyword chính trong Title: {currentPrimaryKeyword || '(chưa đặt)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {primaryInDesc ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm">Keyword chính trong Description: {currentPrimaryKeyword || '(chưa đặt)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {keywordList.length >= 3 && keywordList.length <= 10 ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm">Số lượng Keywords: {keywordList.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Services Section ({activeLang.toUpperCase()})</h3>
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Section Title</label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'servicesTitle' : 'servicesTitleEn'}
                value={activeLang === 'vi' ? formData.servicesTitle : formData.servicesTitleEn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Dịch vụ của chúng tôi"
              />
              {activeLang === 'vi' && errors.servicesTitle && (
                <p className="text-xs text-red-500 mt-1">{errors.servicesTitle}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                name={activeLang === 'vi' ? 'servicesDescription' : 'servicesDescriptionEn'}
                value={activeLang === 'vi' ? formData.servicesDescription : formData.servicesDescriptionEn}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Danh sách dịch vụ (3 thẻ)</label>
              <div className="grid gap-4">
                {getServicesList().map((service, index) => (
                  <div key={index} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="font-medium text-sm text-slate-500">Dịch vụ {index + 1} ({service.id})</div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-500">Tên dịch vụ</label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs text-slate-500">Link</label>
                         <input
                           type="text"
                           value={service.link}
                           onChange={(e) => handleServiceChange(index, 'link', e.target.value)}
                           className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                         />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500">Mô tả ngắn</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Marketing Section ({activeLang.toUpperCase()})</h3>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Badge Text</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'marketingBadge' : 'marketingBadgeEn'}
                  value={activeLang === 'vi' ? formData.marketingBadge : formData.marketingBadgeEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Digital Marketing"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">CTA Text</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'marketingCtaText' : 'marketingCtaTextEn'}
                  value={activeLang === 'vi' ? formData.marketingCtaText : formData.marketingCtaTextEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'marketingTitle' : 'marketingTitleEn'}
                value={activeLang === 'vi' ? formData.marketingTitle : formData.marketingTitleEn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {activeLang === 'vi' && errors.marketingTitle && (
                <p className="text-xs text-red-500 mt-1">{errors.marketingTitle}</p>
              )}
            </div>
          </div>
          {/* Marketing Platforms */}
          <div className="mt-8">
            <h4 className="text-md font-semibold mb-4 text-slate-800 dark:text-slate-200">Digital Marketing Platforms ({activeLang.toUpperCase()})</h4>
            <div className="grid md:grid-cols-3 gap-6">
              {getMarketingPlatformsList().map((item, idx) => (
                <div key={item.key} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tiêu đề</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleMarketingPlatformChange(idx, 'title', e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder={item.key === 'tiktok' ? (activeLang === 'vi' ? 'TikTok Ads' : 'TikTok Ads') : item.key === 'facebook' ? (activeLang === 'vi' ? 'Facebook Ads' : 'Facebook Ads') : (activeLang === 'vi' ? 'Google Ads' : 'Google Ads')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mô tả</label>
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) => handleMarketingPlatformChange(idx, 'description', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ảnh nền tảng</label>
                    <div className="space-y-3">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded-lg" />
                      ) : (
                        <div className="w-full h-32 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                          Chưa có ảnh
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={(el) => { platformFileInputsRef.current[idx] = el; }}
                          onChange={(e) => e.target.files && handleMarketingPlatformImageUpload(idx, e.target.files[0])}
                        />
                        <button
                          type="button"
                          onClick={() => platformFileInputsRef.current[idx]?.click()}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 shrink-0"
                        >
                          <Upload className="w-4 h-4" /> Chọn ảnh
                        </button>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {platformUploading[idx] ? `Đang tải ${platformUploadProgress[idx] || 0}%` : (item.imageUrl ? 'Đã chọn' : 'Chưa chọn')}
                        </div>
                      </div>
                      {platformUploading[idx] && (
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded">
                          <div
                            className="h-2 bg-blue-600 rounded transition-all"
                            style={{ width: `${platformUploadProgress[idx] || 0}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Portfolio Section ({activeLang.toUpperCase()})</h3>
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Section Title</label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'portfolioTitle' : 'portfolioTitleEn'}
                value={activeLang === 'vi' ? formData.portfolioTitle : formData.portfolioTitleEn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {activeLang === 'vi' && errors.portfolioTitle && (
                <p className="text-xs text-red-500 mt-1">{errors.portfolioTitle}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                name={activeLang === 'vi' ? 'portfolioDescription' : 'portfolioDescriptionEn'}
                value={activeLang === 'vi' ? formData.portfolioDescription : formData.portfolioDescriptionEn}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Blog Section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Blog Section ({activeLang.toUpperCase()})</h3>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Section Title</label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'blogTitle' : 'blogTitleEn'}
                value={activeLang === 'vi' ? formData.blogTitle : formData.blogTitleEn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {activeLang === 'vi' && errors.blogTitle && (
                <p className="text-xs text-red-500 mt-1">{errors.blogTitle}</p>
              )}
            </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">View All Text</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'blogViewAllText' : 'blogViewAllTextEn'}
                  value={activeLang === 'vi' ? formData.blogViewAllText : formData.blogViewAllTextEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Contact Section ({activeLang.toUpperCase()})</h3>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-6 border border-blue-100 dark:border-blue-800">
            <h4 className="text-sm font-semibold mb-3 text-blue-800 dark:text-blue-300">Shared Contact Info (All Languages)</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hotline Number</label>
                <input
                  type="text"
                  name="contactHotline"
                  value={formData.contactHotline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0912 345 678"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="text"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="contact@example.com"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Section Title</label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'contactTitle' : 'contactTitleEn'}
                value={activeLang === 'vi' ? formData.contactTitle : formData.contactTitleEn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {activeLang === 'vi' && errors.contactTitle && (
                <p className="text-xs text-red-500 mt-1">{errors.contactTitle}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                name={activeLang === 'vi' ? 'contactDescription' : 'contactDescriptionEn'}
                value={activeLang === 'vi' ? formData.contactDescription : formData.contactDescriptionEn}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
               <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hotline Label</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'contactHotlineLabel' : 'contactHotlineLabelEn'}
                  value={activeLang === 'vi' ? formData.contactHotlineLabel : formData.contactHotlineLabelEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Label</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'contactEmailLabel' : 'contactEmailLabelEn'}
                  value={activeLang === 'vi' ? formData.contactEmailLabel : formData.contactEmailLabelEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address Label</label>
                <input
                  type="text"
                  name={activeLang === 'vi' ? 'contactAddressLabel' : 'contactAddressLabelEn'}
                  value={activeLang === 'vi' ? formData.contactAddressLabel : formData.contactAddressLabelEn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address Value</label>
              <input
                type="text"
                name={activeLang === 'vi' ? 'contactAddressValue' : 'contactAddressValueEn'}
                value={activeLang === 'vi' ? formData.contactAddressValue : formData.contactAddressValueEn}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Google Map Embed URL (Iframe Src)</label>
              <input
                type="text"
                name="contactMapUrl"
                value={formData.contactMapUrl || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="https://www.google.com/maps/embed?..."
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lấy từ Google Maps -&gt; Chia sẻ -&gt; Nhúng bản đồ -&gt; Copy nội dung trong src="..."
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Zalo URL</label>
                <input
                  type="text"
                  name="zaloUrl"
                  value={formData.zaloUrl || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://zalo.me/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Facebook Page URL</label>
                <input
                  type="text"
                  name="facebookUrl"
                  value={formData.facebookUrl || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Messenger URL</label>
                <input
                  type="text"
                  name="messengerUrl"
                  value={formData.messengerUrl || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://m.me/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Admin Chat URL</label>
                <input
                  type="text"
                  name="adminChatUrl"
                  value={formData.adminChatUrl || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Link..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end pt-6 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

// Simple icon components to avoid import errors if not available in lucide-react (though they likely are)
const CheckCircle2 = ({ size, className }: { size: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const AlertCircle = ({ size, className }: { size: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

export default HomeContentForm;
