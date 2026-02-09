import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Eye, 
  EyeOff,
  Plus,
  Star,
  RefreshCw,
  XCircle,
  Loader2,
  Edit3
} from 'lucide-react';
import { api } from '@/utils/api';
import { Toast, ToastMessage } from '@/components/Toast';

interface GoogleReview {
  id: number;
  authorName: string;
  authorPhotoUrl?: string;
  rating: number;
  text: string;
  relativeTimeDescription?: string;
  time?: number;
  isVisible: boolean;
  createdAt: string;
}

export const GoogleReviewsManagement: React.FC = () => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<GoogleReview | null>(null);
  const [formData, setFormData] = useState({
    authorName: '',
    authorPhotoUrl: '',
    rating: 5,
    text: '',
    relativeTimeDescription: '',
    isVisible: true
  });
  const [isSaving, setIsSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<GoogleReview | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', size.toString());
      // params.append('sortBy', 'time'); // Default in backend

      const res = await api.get(`/api/admin/google-reviews?${params.toString()}`);
      setReviews(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      setToast({ type: 'error', text: 'Không thể tải danh sách đánh giá' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, size]);

  const handleToggleVisibility = async (id: number) => {
    try {
      await api.put(`/api/admin/google-reviews/${id}/visibility`, {});
      setReviews(prev => prev.map(r => r.id === id ? { ...r, isVisible: !r.isVisible } : r));
      setToast({ type: 'success', text: 'Cập nhật trạng thái hiển thị thành công' });
    } catch (error) {
      setToast({ type: 'error', text: 'Lỗi khi cập nhật trạng thái' });
    }
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await api.delete(`/api/admin/google-reviews/${reviewToDelete.id}`);
      setReviews(prev => prev.filter(r => r.id !== reviewToDelete.id));
      setToast({ type: 'success', text: 'Xóa đánh giá thành công' });
      setShowDeleteConfirm(false);
      setReviewToDelete(null);
    } catch (error) {
      setToast({ type: 'error', text: 'Lỗi khi xóa đánh giá' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        time: editingReview ? editingReview.time : Date.now() // Use current time for new reviews if not specified
      };

      if (editingReview) {
        await api.put(`/api/admin/google-reviews/${editingReview.id}`, payload);
        setToast({ type: 'success', text: 'Cập nhật đánh giá thành công' });
      } else {
        await api.post('/api/admin/google-reviews', payload);
        setToast({ type: 'success', text: 'Thêm đánh giá mới thành công' });
      }
      setShowModal(false);
      fetchReviews();
    } catch (error) {
      setToast({ type: 'error', text: 'Lỗi khi lưu đánh giá' });
    } finally {
      setIsSaving(false);
    }
  };

  const openModal = (review?: GoogleReview) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        authorName: review.authorName,
        authorPhotoUrl: review.authorPhotoUrl || '',
        rating: review.rating,
        text: review.text,
        relativeTimeDescription: review.relativeTimeDescription || '',
        isVisible: review.isVisible
      });
    } else {
      setEditingReview(null);
      setFormData({
        authorName: '',
        authorPhotoUrl: '',
        rating: 5,
        text: '',
        relativeTimeDescription: '',
        isVisible: true
      });
    }
    setShowModal(true);
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    // If timestamp is seconds (Google usually provides seconds), convert to ms. 
    // But our backend stores Long. If manual, it's ms. If Google, it might be seconds.
    // Let's assume ms for now as we set Date.now()
    // If date is too small (e.g. year 1970), it might be seconds.
    const date = new Date(timestamp > 10000000000 ? timestamp : timestamp * 1000);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Quản lý Đánh giá Google</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Thêm đánh giá</span>
          </button>
          <button 
            onClick={fetchReviews} 
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tác giả</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Đánh giá</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nội dung</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading && reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto h-8 w-8 text-blue-500" />
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Chưa có đánh giá nào
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {review.authorPhotoUrl ? (
                          <img src={review.authorPhotoUrl} alt={review.authorName} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                            {review.authorName.charAt(0)}
                          </div>
                        )}
                        <div className="font-medium text-slate-900 dark:text-white">{review.authorName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-300 dark:text-slate-600"} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-500 truncate max-w-xs" title={review.text}>
                        {review.text}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <div>{formatDate(review.time)}</div>
                      <div className="text-xs text-slate-400">{review.relativeTimeDescription}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleVisibility(review.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors
                        ${review.isVisible 
                          ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                          : 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {review.isVisible ? 'Hiển thị' : 'Đã ẩn'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openModal(review)}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setReviewToDelete(review);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
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
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Hiển thị {reviews.length > 0 ? page * size + 1 : 0} - {Math.min((page + 1) * size, totalElements)} trên tổng số {totalElements}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 text-sm rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Trước
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 text-sm rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold">{editingReview ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên tác giả</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.authorName}
                  onChange={e => setFormData({...formData, authorName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ảnh đại diện (URL)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.authorPhotoUrl}
                  onChange={e => setFormData({...formData, authorPhotoUrl: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Đánh giá (Sao)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className="focus:outline-none"
                    >
                      <Star 
                        size={24} 
                        fill={star <= formData.rating ? "gold" : "none"} 
                        className={star <= formData.rating ? "text-yellow-400" : "text-slate-300"} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nội dung</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.text}
                  onChange={e => setFormData({...formData, text: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Thời gian mô tả (VD: 1 tuần trước)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.relativeTimeDescription}
                  onChange={e => setFormData({...formData, relativeTimeDescription: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={formData.isVisible}
                  onChange={e => setFormData({...formData, isVisible: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isVisible" className="text-sm font-medium">Hiển thị công khai</label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="animate-spin" size={18} />}
                  {editingReview ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold mb-2">Xác nhận xóa</h3>
            <p className="text-slate-500 mb-6">Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
