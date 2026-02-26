import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
<<<<<<< HEAD
import { api } from '@/utils/api';
=======
import { getAuthHeader } from '../utils/auth';
>>>>>>> b2df92e (first commit)

interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProjects: any[];
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, selectedProjects }) => {
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [note, setNote] = useState('');
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
<<<<<<< HEAD
        const data = await api.get('/api/pages/web-design?lang=vi');
        if (data && data.pricingJsonVi) {
          try {
            const parsed = JSON.parse(data.pricingJsonVi);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setPackages(parsed);
              return;
            }
          } catch (e) {
            console.error('Failed to parse pricingJsonVi', e);
=======
        const res = await fetch('/api/pages/web-design?lang=vi');
        if (res.ok) {
          const data = await res.json();
          if (data.pricingJsonVi) {
            try {
              const parsed = JSON.parse(data.pricingJsonVi);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setPackages(parsed);
                return;
              }
            } catch (e) {
              console.error('Failed to parse pricingJsonVi', e);
            }
>>>>>>> b2df92e (first commit)
          }
        }
      } catch (error) {
        console.error('Failed to fetch web design content', error);
      }
      // If fetch fails or no data, packages remains empty or whatever previous state
    };

    if (isOpen) {
      fetchPackages();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (selectedProjects && selectedProjects.length > 0) {
      const mapped = selectedProjects.map((p) => ({
        description: `${p.title || 'Dự án'}${p.client ? ' - ' + p.client : ''}`,
        quantity: 1,
        unitPrice: 0,
      }));
      setItems(mapped);
    } else {
      setItems([{ description: '', quantity: 1, unitPrice: 0 }]);
    }
  }, [isOpen, selectedProjects]);

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addPackage = (pkg: any) => {
    const priceNum = parseInt(pkg.price.replace(/\D/g, ''), 10) || 0;
    const featuresStr = Array.isArray(pkg.features) ? pkg.features.join(', ') : pkg.features;
    setItems([
      ...items.filter(i => i.description !== ''), 
      { description: `${pkg.name} - ${featuresStr}`, quantity: 1, unitPrice: priceNum }
    ]);
  };

  const handleExport = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD
      const blob = await api.download('/api/admin/export/quote', {
        method: 'POST',
=======
      const res = await fetch('/api/admin/export/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
>>>>>>> b2df92e (first commit)
        body: JSON.stringify({
          customerName,
          companyName,
          email,
          phone,
          language: 'vi',
          items,
          note
        }),
      });

<<<<<<< HEAD
=======
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
>>>>>>> b2df92e (first commit)
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bao_gia_${customerName || 'Khach_hang'}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Có lỗi khi tạo báo giá');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" style={{marginTop: "0px"}}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-green-600" />
              Tạo Báo Giá Website
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tên Khách Hàng</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Công Ty</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  placeholder="Công ty TNHH..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Số Điện Thoại</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Chi tiết hạng mục</label>
                <div className="flex gap-2">
                  {packages.map((pkg, idx) => (
                    <button
                      key={idx}
                      onClick={() => addPackage(pkg)}
                      className="px-3 py-1 text-xs rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      + {pkg.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border rounded-xl overflow-hidden border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-medium">
                    <tr>
                      <th className="px-4 py-3">Mô tả</th>
                      <th className="px-4 py-3 w-24">SL</th>
                      <th className="px-4 py-3 w-40">Đơn giá (VNĐ)</th>
                      <th className="px-4 py-3 w-40 text-right">Thành tiền</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                            className="w-full px-2 py-1 bg-transparent border-none focus:ring-0"
                            placeholder="Mô tả hạng mục..."
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-transparent border-none focus:ring-0"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleUpdateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-transparent border-none focus:ring-0"
                          />
                        </td>
                        <td className="p-2 text-right font-medium">
                          {(item.quantity * item.unitPrice).toLocaleString('vi-VN')}
                        </td>
                        <td className="p-2 text-center">
                          <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right">Tổng cộng:</td>
                      <td className="px-4 py-3 text-right text-blue-600">{total.toLocaleString('vi-VN')} đ</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" /> Thêm dòng
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ghi chú</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-lg shadow-green-500/30 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              Xuất Excel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
