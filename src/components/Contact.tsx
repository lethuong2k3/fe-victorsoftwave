import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
<<<<<<< HEAD
import { api } from '@/utils/api';
import { Toast, ToastMessage } from '@/components/Toast';
import { contactSchema, ContactFormData } from '@/utils/validation';
=======
import { api } from '../utils/api';
import { Toast, ToastMessage } from './Toast';
import { contactSchema, ContactFormData } from '../utils/validation';
>>>>>>> b2df92e (first commit)

interface ContactProps {
  data?: {
    contactTitle?: string;
    contactDescription?: string;
    contactHotlineLabel?: string;
    contactEmailLabel?: string;
    contactAddressLabel?: string;
    contactAddressValue?: string;
<<<<<<< HEAD
    contactHotline?: string;
    contactEmail?: string;
=======
>>>>>>> b2df92e (first commit)
  };
}

const Contact: React.FC<ContactProps> = ({ data }) => {
  const title = data?.contactTitle || "Liên hệ với chúng tôi";
  const description = data?.contactDescription || "Đừng ngần ngại chia sẻ ý tưởng của bạn. Chúng tôi ở đây để biến nó thành hiện thực.";
  const hotlineLabel = data?.contactHotlineLabel || "Hotline";
  const emailLabel = data?.contactEmailLabel || "Email";
  const addressLabel = data?.contactAddressLabel || "Địa chỉ";
  const addressValue = data?.contactAddressValue || "Tầng 12, Tòa nhà Bitexco, Q1, TP.HCM";
<<<<<<< HEAD
  const hotline = data?.contactHotline || "0912 345 678";
  const email = data?.contactEmail || "contact@victorsoftware.com";
=======
>>>>>>> b2df92e (first commit)

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Rate limiting constant (5 minutes)
  const COOLDOWN_TIME = 5 * 60 * 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate with Zod
    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) {
          newErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(newErrors);
      setToast({ type: 'error', text: 'Vui lòng kiểm tra lại thông tin' });
      return;
    }
    
    // Clear errors if valid
    setErrors({});

    // Check rate limit
    const lastSubmit = localStorage.getItem('lastContactSubmit');
    if (lastSubmit) {
      const timeSinceLastSubmit = Date.now() - parseInt(lastSubmit);
      if (timeSinceLastSubmit < COOLDOWN_TIME) {
        const remainingMinutes = Math.ceil((COOLDOWN_TIME - timeSinceLastSubmit) / 60000);
        setToast({ 
          type: 'error', 
          text: `Bạn đã gửi yêu cầu quá nhanh. Vui lòng thử lại sau ${remainingMinutes} phút.` 
        });
        return;
      }
    }

    try {
      setLoading(true);
      await api.post('/api/contacts', formData);
      
      // Save submission time
      localStorage.setItem('lastContactSubmit', Date.now().toString());
      
      setToast({ type: 'success', text: 'Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.' });
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
      setToast({ type: 'error', text: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 transform origin-top-right"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4">{title}</h2>
              <p className="text-slate-300 text-lg">
                {description}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Phone className="text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{hotlineLabel}</h4>
<<<<<<< HEAD
                  <p className="text-slate-300">{hotline}</p>
=======
                  <p className="text-slate-300">0912 345 678</p>
>>>>>>> b2df92e (first commit)
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <Mail className="text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{emailLabel}</h4>
<<<<<<< HEAD
                  <p className="text-slate-300">{email}</p>
=======
                  <p className="text-slate-300">contact@victorsoftware.com</p>
>>>>>>> b2df92e (first commit)
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <MapPin className="text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{addressLabel}</h4>
                  <p className="text-slate-300">{addressValue}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Họ và tên *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-400`}
                  placeholder="Nhập họ tên của bạn"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-400`}
                    placeholder="example@email.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.phone ? 'border-red-500' : 'border-white/20'} rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-400`}
                    placeholder="0912..."
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nội dung *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 bg-white/10 border ${errors.message ? 'border-red-500' : 'border-white/20'} rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-400 resize-none`}
                  placeholder="Bạn cần tư vấn về dịch vụ nào?"
                ></textarea>
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
<<<<<<< HEAD
                className="cursor-pointer w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
=======
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
>>>>>>> b2df92e (first commit)
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    Gửi yêu cầu
                    <Send className="group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
