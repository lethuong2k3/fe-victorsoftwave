import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useQuery } from '@tanstack/react-query';
import { fetcher, api } from '../utils/api';
import { getLang } from '../utils/localization';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toast, ToastMessage } from '../components/Toast';
import { contactSchema, ContactFormData } from '../utils/validation';

const ContactPage: React.FC = () => {
  const lang = getLang();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

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
      setToast({ type: 'error', text: lang === 'en' ? 'Please check your input' : 'Vui lòng kiểm tra lại thông tin' });
      return;
    }
    
    // Clear errors
    setErrors({});

    // Check rate limit
    const lastSubmit = localStorage.getItem('lastContactSubmit');
    if (lastSubmit) {
      const timeSinceLastSubmit = Date.now() - parseInt(lastSubmit);
      if (timeSinceLastSubmit < COOLDOWN_TIME) {
        const remainingMinutes = Math.ceil((COOLDOWN_TIME - timeSinceLastSubmit) / 60000);
        setToast({ 
          type: 'error', 
          text: lang === 'en' 
            ? `You are sending requests too quickly. Please try again in ${remainingMinutes} minutes.` 
            : `Bạn đã gửi yêu cầu quá nhanh. Vui lòng thử lại sau ${remainingMinutes} phút.` 
        });
        return;
      }
    }

    try {
        setLoading(true);
        await api.post('/api/contacts', formData);
        
        // Save submission time
        localStorage.setItem('lastContactSubmit', Date.now().toString());

        setToast({ type: 'success', text: lang === 'en' ? 'Request sent successfully! We will contact you soon.' : 'Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.' });
        if (lang === 'vi') window.alert("Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.");
        else window.alert("Request sent successfully! We will contact you soon.");
        setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
        setToast({ type: 'error', text: lang === 'en' ? 'An error occurred, please try again later.' : 'Có lỗi xảy ra, vui lòng thử lại sau.' });
        if (lang === 'vi') window.alert("Có lỗi xảy ra, vui lòng thử lại sau.");
        else window.alert("An error occurred, please try again later.");
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

  // Reuse home data fetching to get contact info
  const { data: rawHomeData } = useQuery({
    queryKey: ['home-data', lang],
    queryFn: () => fetcher<any>('/api/pages/home'),
  });

  // Process data
  const contactData = React.useMemo(() => {
    if (!rawHomeData) return undefined;
    const data = rawHomeData;
    return {
      contactTitle: lang === 'en' ? data.contactTitleEn : data.contactTitle,
      contactDescription: lang === 'en' ? data.contactDescriptionEn : data.contactDescription,
      contactHotlineLabel: lang === 'en' ? data.contactHotlineLabelEn : data.contactHotlineLabel,
      contactEmailLabel: lang === 'en' ? data.contactEmailLabelEn : data.contactEmailLabel,
      contactAddressLabel: lang === 'en' ? data.contactAddressLabelEn : data.contactAddressLabel,
      contactAddressValue: lang === 'en' ? data.contactAddressValueEn : data.contactAddressValue,
      contactHotline: data.contactHotline,
      contactEmail: data.contactEmail,
      contactMapUrl: data.contactMapUrl,
    };
  }, [rawHomeData, lang]);

  const seoTitle = lang === 'en' ? 'Contact Us - Victor Softwave' : 'Liên Hệ - Victor Softwave';
  const seoDesc = lang === 'en' 
    ? 'Get in touch with Victor Softwave for professional web design and marketing solutions.' 
    : 'Liên hệ với Victor Softwave để được tư vấn giải pháp thiết kế web và marketing chuyên nghiệp.';

  const defaults = {
    title: lang === 'en' ? "Get in Touch" : "Liên hệ với chúng tôi",
    desc: lang === 'en' ? "Have a project in mind? Let's talk about it." : "Bạn có ý tưởng cho dự án? Hãy để chúng tôi giúp bạn hiện thực hóa nó.",
    address: "Tầng 12, Tòa nhà Bitexco, Q1, TP.HCM",
    hotline: "0912 345 678",
    email: "contact@victorsoftware.com",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5132741062075!2d106.7017555152602!3d10.771915392324629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a602db!2sBitexco%20Financial%20Tower!5e0!3m2!1sen!2s!4v1645431652882!5m2!1sen!2s"
  };

  const labels = {
    name: lang === 'en' ? 'Full Name' : 'Họ và tên',
    phone: lang === 'en' ? 'Phone Number' : 'Số điện thoại',
    email: lang === 'en' ? 'Email Address' : 'Địa chỉ Email',
    message: lang === 'en' ? 'Message' : 'Nội dung cần tư vấn',
    send: lang === 'en' ? 'Send Message' : 'Gửi tin nhắn',
    workingHours: lang === 'en' ? 'Working Hours' : 'Giờ làm việc',
    workingTime: lang === 'en' ? 'Mon - Fri: 8:00 AM - 5:30 PM' : 'Thứ 2 - Thứ 6: 8:00 - 17:30',
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
      </Helmet>
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-20">
            {/* Hero Section */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
                        {lang === 'en' ? 'Contact Us' : 'Liên Hệ'}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        {contactData?.contactTitle || defaults.title}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {contactData?.contactDescription || defaults.desc}
                    </p>
                </motion.div>
            </section>

            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    
                    {/* Left Column: Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        {/* Info Cards */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <Phone size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                {contactData?.contactHotlineLabel || "Hotline"}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">
                                {contactData?.contactHotline || defaults.hotline}
                            </p>
                            <a href={`tel:${(contactData?.contactHotline || defaults.hotline).replace(/\s/g, '')}`} className="text-sm text-blue-600 hover:underline mt-2 inline-flex items-center gap-1">
                                {lang === 'en' ? 'Call now' : 'Gọi ngay'} <ArrowRight size={14} />
                            </a>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 mb-4">
                                <Mail size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                {contactData?.contactEmailLabel || "Email"}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 break-all">
                                {contactData?.contactEmail || defaults.email}
                            </p>
                            <a href={`mailto:${contactData?.contactEmail || defaults.email}`} className="text-sm text-green-600 hover:underline mt-2 inline-flex items-center gap-1">
                                {lang === 'en' ? 'Send email' : 'Gửi email'} <ArrowRight size={14} />
                            </a>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                {contactData?.contactAddressLabel || "Địa chỉ"}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                {contactData?.contactAddressValue || defaults.address}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="text-blue-200" />
                                <h3 className="text-lg font-bold">{labels.workingHours}</h3>
                            </div>
                            <p className="text-blue-100 mb-4">
                                {labels.workingTime}
                            </p>
                            <div className="text-sm text-blue-200 bg-white/10 p-3 rounded-lg">
                                {lang === 'en' ? 'Support available 24/7 for urgent issues.' : 'Hỗ trợ kỹ thuật 24/7 cho các vấn đề khẩn cấp.'}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                                    <MessageSquare size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {lang === 'en' ? 'Send us a message' : 'Gửi tin nhắn cho chúng tôi'}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {labels.name} <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                            placeholder={lang === 'en' ? "Your name" : "Nhập họ tên của bạn"}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {labels.phone} <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                            placeholder={lang === 'en' ? "Your phone number" : "Nhập số điện thoại"}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        {labels.email} <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder="email@example.com" 
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        {labels.message} <span className="text-red-500">*</span>
                                    </label>
                                    <textarea 
                                        rows={4} 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        placeholder={lang === 'en' ? "How can we help you?" : "Nội dung cần tư vấn..."}
                                    ></textarea>
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                </div>

                                <button 
                                    disabled={loading}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <>{labels.send} <Send size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                                </button>
                            </form>
                        </div>

                        {/* Map Section */}
                        <div className="mt-8 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden h-64 md:h-80 shadow-inner">
                             <iframe 
                                title="map"
                                src={contactData?.contactMapUrl || defaults.mapUrl} 
                                width="100%" 
                                height="100%" 
                                style={{border:0}} 
                                allowFullScreen 
                                loading="lazy"
                            ></iframe>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>

        <Footer />
        <Toast message={toast} onClose={() => setToast(null)} />
      </div>
    </>
  );
};

export default ContactPage;
