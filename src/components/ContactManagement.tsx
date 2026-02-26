import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  Loader2,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { api } from '@/utils/api';
import { Toast, ToastMessage } from '@/components/Toast';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'PROCESSED';
  createdAt: string;
}

interface ContactManagementProps {
  onUnreadCountChange?: () => void;
}

export const ContactManagement: React.FC<ContactManagementProps> = ({ onUnreadCountChange }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', size.toString());
      if (statusFilter) params.append('status', statusFilter);
      if (debouncedSearch) params.append('search', debouncedSearch);

      const res = await api.get(`/api/admin/contacts?${params.toString()}`);
      setContacts(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      setToast({ type: 'error', text: 'Không thể tải danh sách liên hệ' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, size, statusFilter, debouncedSearch]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.put(`/api/admin/contacts/${id}/status`, { status: newStatus });
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus as any } : c));
      if (onUnreadCountChange) onUnreadCountChange();
      setToast({ type: 'success', text: 'Cập nhật trạng thái thành công' });
      
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact({ ...selectedContact, status: newStatus as any });
      }
    } catch (error) {
      setToast({ type: 'error', text: 'Lỗi khi cập nhật trạng thái' });
    }
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;
    try {
      await api.delete(`/api/admin/contacts/${contactToDelete.id}`);
      setContacts(prev => prev.filter(c => c.id !== contactToDelete.id));
      setToast({ type: 'success', text: 'Xóa liên hệ thành công' });
      setShowDeleteConfirm(false);
      setContactToDelete(null);
      if (selectedContact?.id === contactToDelete.id) setSelectedContact(null);
      if (onUnreadCountChange) onUnreadCountChange();
    } catch (error) {
      setToast({ type: 'error', text: 'Lỗi khi xóa liên hệ' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Danh sách liên hệ</h2>
        <div className="flex gap-2">
           <button 
            onClick={fetchContacts} 
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, sđt..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="UNREAD">Chưa đọc</option>
          <option value="READ">Đã đọc</option>
          <option value="PROCESSED">Đã xử lý</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Thông tin</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ngày gửi</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading && contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto h-8 w-8 text-blue-500" />
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Không tìm thấy liên hệ nào
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${contact.status === 'UNREAD' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{contact.name}</div>
                      <div className="text-sm text-slate-500">{contact.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Phone size={14} /> {contact.phone || 'N/A'}
                      </div>
                      <div className="text-sm text-slate-500 truncate max-w-xs mt-1" title={contact.message}>
                        {contact.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${contact.status === 'UNREAD' ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 
                          contact.status === 'PROCESSED' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                          'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                        }`}>
                        {contact.status === 'UNREAD' ? 'Mới' : contact.status === 'PROCESSED' ? 'Đã xử lý' : 'Đã xem'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedContact(contact);
                            if (contact.status === 'UNREAD') {
                              handleStatusChange(contact.id, 'READ');
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setContactToDelete(contact);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Xóa"
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
              Hiển thị {contacts.length > 0 ? page * size + 1 : 0} - {Math.min((page + 1) * size, totalElements)} trên tổng số {totalElements}
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

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold">Chi tiết liên hệ</h3>
              <button 
                onClick={() => setSelectedContact(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Người gửi</label>
                  <div className="mt-1 font-medium text-lg">{selectedContact.name}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Thời gian</label>
                  <div className="mt-1 font-medium">{formatDate(selectedContact.createdAt)}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Mail size={16} className="text-blue-500" />
                    <a href={`mailto:${selectedContact.email}`} className="hover:text-blue-500 hover:underline">
                      {selectedContact.email}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Số điện thoại</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone size={16} className="text-blue-500" />
                    <a href={`tel:${selectedContact.phone}`} className="hover:text-blue-500 hover:underline">
                      {selectedContact.phone || 'N/A'}
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Nội dung tin nhắn</label>
                <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedContact.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Trạng thái:</span>
                  <select 
                    value={selectedContact.status}
                    onChange={(e) => handleStatusChange(selectedContact.id, e.target.value)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UNREAD">Mới</option>
                    <option value="READ">Đã xem</option>
                    <option value="PROCESSED">Đã xử lý</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedContact(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    Đóng
                  </button>
                  <a 
                    href={`mailto:${selectedContact.email}`}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30 font-medium"
                  >
                    Phản hồi qua Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Xác nhận xóa</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Bạn có chắc chắn muốn xóa liên hệ này không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-500/30 font-medium"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
