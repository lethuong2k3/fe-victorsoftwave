import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Upload,
  Eye,
  FileText,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Quote,
  Code,
  Undo,
  Redo,
  Link as LinkIcon
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/utils/api';
import { Toast, ToastMessage } from '@/components/Toast';

// Helper for slugs
const toSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

interface Article {
  id: number;
  title: string;
  titleEn: string;
  slug: string;
  slugEn: string;
  image: string;
  description: string;
  descriptionEn: string;
  content: string;
  contentEn: string;
  author: string;
  category: string;
  status: 'DRAFT' | 'PUBLISHED';
  featured: boolean;
  seoTitle: string;
  seoTitleEn: string;
  seoDescription: string;
  seoDescriptionEn: string;
  seoKeywords: string;
  seoKeywordsEn: string;
  createdAt: string;
}

const MenuBar = ({ editor, onImageUpload }: { editor: any, onImageUpload: (file: File) => Promise<void> }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await onImageUpload(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/30 rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-slate-200 dark:bg-slate-800 text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-slate-200 dark:bg-slate-800 text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 dark:bg-slate-800 text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 dark:bg-slate-800 text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-slate-800 text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-slate-200 dark:bg-slate-800 text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-slate-200 dark:bg-slate-800 text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('codeBlock') ? 'bg-slate-200 dark:bg-slate-800 text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
        title="Code Block"
      >
        <Code className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 self-center" />
      <button
        type="button"
        onClick={addImage}
        className="p-2 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
        title="Add Image"
      >
        <ImageIcon className="w-4 h-4" />
      </button>
      <div className="flex-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

const TiptapEditor = ({ content, onChange, onImageUpload }: { content: string, onChange: (html: string) => void, onImageUpload: (file: File) => Promise<string> }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none p-4 min-h-[300px] outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
       editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleEditorImageUpload = async (file: File) => {
    try {
      const url = await onImageUpload(file);
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } catch (error) {
      console.error("Failed to upload image inside editor", error);
    }
  };

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      <MenuBar editor={editor} onImageUpload={handleEditorImageUpload} />
      <EditorContent editor={editor} className="flex-1" />
    </div>
  );
};

interface ArticlesManagementProps {
  onToast: (msg: ToastMessage) => void;
}

export const ArticlesManagement: React.FC<ArticlesManagementProps> = ({ onToast }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Edit/Add State
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [editorLang, setEditorLang] = useState<'vi' | 'en'>('vi');
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cloudinary
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
  const [isUploading, setIsUploading] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('size', String(size));
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (filterStatus) params.set('status', filterStatus);
      if (filterCategory) params.set('category', filterCategory);

      const data = await api.get(`/api/admin/articles?${params.toString()}`);
      
      setArticles(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, size, debouncedSearch, filterStatus, filterCategory]);

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.secure_url;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    try {
      setIsSaving(true);
      
      // Auto-generate slug if empty
      const articleToSave = { ...editingArticle };
      if (!articleToSave.slug && articleToSave.title) {
        articleToSave.slug = toSlug(articleToSave.title);
      }
      if (!articleToSave.slugEn && articleToSave.titleEn) {
        articleToSave.slugEn = toSlug(articleToSave.titleEn);
      }

      // Validate featured count
      if (articleToSave.featured) {
        // Fetch all featured articles
        try {
          const featuredData = await api.get('/api/admin/articles?featured=true&size=100');
          const featuredArticles = featuredData.content || [];
          
          // Check if we are exceeding the limit (3)
          // If editing existing article and it was already featured, don't count it against the limit
          const isCurrentlyFeatured = articles.find(a => a.id === articleToSave.id)?.featured;
          const otherFeaturedCount = featuredArticles.filter((a: any) => a.id !== articleToSave.id).length;
          
          if (otherFeaturedCount >= 3) {
            onToast({ type: 'error', text: 'Chỉ được phép có tối đa 3 bài viết nổi bật!' });
            setIsSaving(false);
            return;
          }
        } catch (e) {
          console.error("Failed to validate featured articles", e);
        }
      }

      const url = articleToSave.id 
        ? `/api/admin/articles/${articleToSave.id}`
        : '/api/admin/articles';

      if (articleToSave.id) {
         await api.put(url, articleToSave);
      } else {
         await api.post(url, articleToSave);
      }

      onToast({ type: 'success', text: articleToSave.id ? 'Cập nhật bài viết thành công' : 'Thêm bài viết mới thành công' });
      setShowModal(false);
      setEditingArticle(null);
      fetchArticles();
    } catch (err) {
      console.error(err);
      onToast({ type: 'error', text: 'Lỗi khi lưu bài viết' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!articleToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/api/admin/articles/${articleToDelete.id}`);

      onToast({ type: 'success', text: 'Xóa bài viết thành công' });
      setShowDeleteConfirm(false);
      setArticleToDelete(null);
      fetchArticles();
    } catch (err) {
      onToast({ type: 'error', text: 'Lỗi khi xóa bài viết' });
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (article?: Article) => {
    if (article) {
      setEditingArticle({ ...article });
    } else {
      setEditingArticle({
        title: '',
        titleEn: '',
        status: 'DRAFT',
        featured: false,
        category: 'Tin tức',
        author: 'Admin'
      });
    }
    setEditorLang('vi');
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quản lý bài viết</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Danh sách bài viết tin tức, blog và hoạt động
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500"
                />
             </div>
             <select
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
             >
               <option value="">Tất cả trạng thái</option>
               <option value="PUBLISHED">Đã xuất bản</option>
               <option value="DRAFT">Bản nháp</option>
             </select>
             <button
               onClick={() => openEditModal()}
               className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium"
             >
               <Plus className="w-4 h-4" /> Viết bài mới
             </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 rounded-xl">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950/40 text-xs uppercase font-medium text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 w-16">ID</th>
                <th className="px-4 py-3 min-w-[300px]">Tiêu đề</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Chưa có bài viết nào
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500">#{article.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {article.image ? (
                           <img src={article.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                        ) : (
                           <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                             <FileText className="w-5 h-5" />
                           </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white line-clamp-1">{article.title}</div>
                          <div className="text-xs text-slate-500 line-clamp-1">{article.titleEn || 'No English Title'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs">
                        {article.category || 'Tin tức'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        article.status === 'PUBLISHED' 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {article.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(article)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-blue-600 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setArticleToDelete(article as Article);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-red-600 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
             <button
               disabled={page === 0}
               onClick={() => setPage(p => Math.max(0, p - 1))}
               className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50"
             >
               <ChevronLeft className="w-5 h-5" />
             </button>
             <span className="text-sm text-slate-600">
               Trang {page + 1} / {totalPages}
             </span>
             <button
               disabled={page >= totalPages - 1}
               onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
               className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50"
             >
               <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {showModal && editingArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" style={{marginTop: '0px'}}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleSave}>
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingArticle.id ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <button
                      type="button"
                      onClick={() => setEditorLang('vi')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        editorLang === 'vi' 
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Tiếng Việt
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorLang('en')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        editorLang === 'en' 
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      English
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Common Fields */}
                    <div className="col-span-full md:col-span-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Hình ảnh đại diện
                        </label>
                        <div className="flex items-center gap-4">
                           {editingArticle.image && (
                             <img src={editingArticle.image} alt="Preview" className="w-20 h-20 rounded-lg object-cover border border-slate-200" />
                           )}
                           <label className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                             <Upload className="w-4 h-4" />
                             <span className="text-sm">Tải ảnh lên</span>
                             <input 
                               type="file" 
                               hidden 
                               accept="image/*"
                               onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                   try {
                                     setIsUploading(true);
                                     const url = await handleImageUpload(file);
                                     setEditingArticle(prev => ({ ...prev, image: url }));
                                   } catch (err) {
                                     onToast({ type: 'error', text: 'Upload ảnh thất bại' });
                                   } finally {
                                     setIsUploading(false);
                                   }
                                 }
                               }}
                             />
                           </label>
                           {isUploading && <span className="text-xs text-blue-500">Đang tải...</span>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Danh mục
                        </label>
                        <input
                          type="text"
                          value={editingArticle.category || ''}
                          onChange={(e) => setEditingArticle(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                          placeholder="VD: Tin tức, Hoạt động..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Trạng thái
                        </label>
                        <select
                          value={editingArticle.status || 'DRAFT'}
                          onChange={(e) => setEditingArticle(prev => ({ ...prev, status: e.target.value as any }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                        >
                          <option value="DRAFT">Bản nháp</option>
                          <option value="PUBLISHED">Xuất bản</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={editingArticle.featured || false}
                          onChange={(e) => setEditingArticle(prev => ({ ...prev, featured: e.target.checked }))}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="featured" className="text-sm text-slate-700 dark:text-slate-300">
                          Nổi bật (Hiển thị trang chủ)
                        </label>
                      </div>
                    </div>

                    {/* Content Fields */}
                    <div className="col-span-full md:col-span-1 space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                           Tiêu đề ({editorLang === 'vi' ? 'Tiếng Việt' : 'English'})
                         </label>
                         <input
                           type="text"
                           value={editorLang === 'vi' ? editingArticle.title : editingArticle.titleEn}
                           onChange={(e) => setEditingArticle(prev => ({
                             ...prev,
                             [editorLang === 'vi' ? 'title' : 'titleEn']: e.target.value
                           }))}
                           className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                           required
                         />
                       </div>

                       <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                           Mô tả ngắn ({editorLang === 'vi' ? 'Tiếng Việt' : 'English'})
                         </label>
                         <textarea
                           rows={3}
                           value={editorLang === 'vi' ? editingArticle.description : editingArticle.descriptionEn}
                           onChange={(e) => setEditingArticle(prev => ({
                             ...prev,
                             [editorLang === 'vi' ? 'description' : 'descriptionEn']: e.target.value
                           }))}
                           className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                         />
                       </div>
                    </div>
                    
                    {/* Rich Text Editor */}
                    <div className="col-span-full space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Nội dung chi tiết ({editorLang === 'vi' ? 'Tiếng Việt' : 'English'})
                      </label>
                      <TiptapEditor
                        content={editorLang === 'vi' ? (editingArticle.content || '') : (editingArticle.contentEn || '')}
                        onChange={(html) => setEditingArticle(prev => ({
                          ...prev,
                          [editorLang === 'vi' ? 'content' : 'contentEn']: html
                        }))}
                        onImageUpload={handleImageUpload}
                      />
                    </div>

                    {/* SEO Fields */}
                    <div className="col-span-full border-t border-slate-200 dark:border-slate-800 pt-4 mt-4">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Cấu hình SEO</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">SEO Title</label>
                          <input
                            type="text"
                            value={editorLang === 'vi' ? editingArticle.seoTitle : editingArticle.seoTitleEn}
                            onChange={(e) => setEditingArticle(prev => ({
                              ...prev,
                              [editorLang === 'vi' ? 'seoTitle' : 'seoTitleEn']: e.target.value
                            }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                          />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-slate-500 mb-1">SEO Keywords</label>
                           <input
                             type="text"
                             value={editorLang === 'vi' ? editingArticle.seoKeywords : editingArticle.seoKeywordsEn}
                             onChange={(e) => setEditingArticle(prev => ({
                               ...prev,
                               [editorLang === 'vi' ? 'seoKeywords' : 'seoKeywordsEn']: e.target.value
                             }))}
                             className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                           />
                        </div>
                        <div className="col-span-full">
                           <label className="block text-xs font-medium text-slate-500 mb-1">SEO Description</label>
                           <textarea
                             rows={2}
                             value={editorLang === 'vi' ? editingArticle.seoDescription : editingArticle.seoDescriptionEn}
                             onChange={(e) => setEditingArticle(prev => ({
                               ...prev,
                               [editorLang === 'vi' ? 'seoDescription' : 'seoDescriptionEn']: e.target.value
                             }))}
                             className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                           />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2"
                  >
                    {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {editingArticle.id ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && articleToDelete && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6"
             >
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                   <AlertCircle className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white">Xác nhận xóa</h3>
                   <p className="text-sm text-slate-500">Hành động này không thể hoàn tác.</p>
                 </div>
               </div>
               
               <p className="text-slate-600 dark:text-slate-300 mb-6">
                 Bạn có chắc chắn muốn xóa bài viết <span className="font-bold text-slate-900 dark:text-white">"{articleToDelete.title}"</span> không?
               </p>

               <div className="flex items-center justify-end gap-3">
                 <button
                   onClick={() => setShowDeleteConfirm(false)}
                   className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                 >
                   Hủy
                 </button>
                 <button
                   onClick={handleDelete}
                   disabled={isDeleting}
                   className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center gap-2"
                 >
                   {isDeleting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                   Xóa bài viết
                 </button>
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};
