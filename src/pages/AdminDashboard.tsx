import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Users,
  Eye,
  Activity,
  Plus,
  ArrowUp,
  Moon,
  Sun,
  FileText,
  ChevronDown,
  ChevronRight,
  Monitor,
  Home,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Loader2,
  Upload,
  FileSpreadsheet,
  Download,
  Calendar,
  CalendarRange,
  Layers,
  Filter
} from 'lucide-react';
import { clearTokens, getRefreshToken } from '@/utils/auth';
import { api } from '@/utils/api';
import { SLUG_MAPPING } from '@/utils/localization';
import { Toast, ToastMessage } from '@/components/Toast';

import WebDesignContentForm from '@/components/WebDesignContentForm';
import SeoOverallContentForm from '@/components/SeoOverallContentForm';
import HomeContentForm from '@/components/HomeContentForm';
import WebsiteCareContentForm from '@/components/WebsiteCareContentForm';
import TiktokAdsContentForm from '@/components/TiktokAdsContentForm';
import FacebookAdsContentForm from '@/components/FacebookAdsContentForm';
import { GoogleAdsContentForm } from '@/components/GoogleAdsContentForm';
import ProjectsPageContentForm from '@/components/ProjectsPageContentForm';
import ClientsPageContentForm from '@/components/ClientsPageContentForm';
import { QuoteModal } from '@/components/QuoteModal';
import { CategoryManagement } from '@/components/CategoryManagement';
import { ArticlesManagement } from '@/components/ArticlesManagement';
import { ContactManagement } from '@/components/ContactManagement';
import { GoogleReviewsManagement } from '@/components/GoogleReviewsManagement';
import { Mail, Star } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Render Toast
  const renderToast = () => (
    toast && <Toast message={toast} onClose={() => setToast(null)} />
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const v = localStorage.getItem('adminDarkMode');
    return v ? v === 'true' : true;
  });
  const [user, setUser] = useState<any>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isStaticPagesOpen, setIsStaticPagesOpen] = useState(false);
  const [settingsLang, setSettingsLang] = useState<'vi' | 'en'>(() => {
    const v = localStorage.getItem('lang');
    return v === 'en' ? 'en' : 'vi';
  });
  const [uiDensity, setUiDensity] = useState<'comfortable' | 'compact'>(() => {
    const v = localStorage.getItem('uiDensity');
    return v === 'compact' ? 'compact' : 'comfortable';
  });
  const [primaryTheme, setPrimaryTheme] = useState<string>(() => {
    return localStorage.getItem('primaryTheme') || 'blue';
  });
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [projects, setProjects] = useState<any[]>([]);
  const [projectPage, setProjectPage] = useState(0);
  const [projectSize, setProjectSize] = useState(10);
  const [projectTotalElements, setProjectTotalElements] = useState(0);
  const [projectTotalPages, setProjectTotalPages] = useState(0);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [projectCategories, setProjectCategories] = useState<string[]>([]);
  const [projectFilterCat, setProjectFilterCat] = useState<string>('');
  const [projectFilterStatus, setProjectFilterStatus] = useState<string>('');
  const [projectFilterPriority, setProjectFilterPriority] = useState<string>('');
  const [projectSearch, setProjectSearch] = useState('');
  const [projectSearchDebounced, setProjectSearchDebounced] = useState('');
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [projectEditorLang, setProjectEditorLang] = useState<'vi' | 'en'>('vi');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Notification State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [latestUnreadContacts, setLatestUnreadContacts] = useState<any[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchLatestUnreadContacts = async () => {
    try {
      const data = await api.get('/api/admin/contacts?status=UNREAD&size=5');
      setLatestUnreadContacts(data.content || []);
    } catch (error) {
      console.error('Failed to fetch unread contacts', error);
    }
  };

  const handleBellClick = () => {
    if (!isNotificationsOpen) {
      fetchLatestUnreadContacts();
    }
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isExportingProjects, setIsExportingProjects] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);

  // Clients State
  const [clients, setClients] = useState<any[]>([]);
  const [clientPage, setClientPage] = useState(0);
  const [clientSize, setClientSize] = useState(10);
  const [clientTotalElements, setClientTotalElements] = useState(0);
  const [clientTotalPages, setClientTotalPages] = useState(0);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [clientCategories, setClientCategories] = useState<string[]>([]);
  const [managedProjectCategories, setManagedProjectCategories] = useState<any[]>([]);
  const [managedClientCategories, setManagedClientCategories] = useState<any[]>([]);
  const [clientFilterCat, setClientFilterCat] = useState<string>('');
  const [clientSearch, setClientSearch] = useState('');
  const [clientSearchDebounced, setClientSearchDebounced] = useState('');
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [clientEditorLang, setClientEditorLang] = useState<'vi' | 'en'>('vi');
  const [showClientModal, setShowClientModal] = useState(false);
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [selectedClientIds, setSelectedClientIds] = useState<number[]>([]);
  const [isExportingClients, setIsExportingClients] = useState(false);
  const [showDeleteClientConfirm, setShowDeleteClientConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<any | null>(null);
  const [isDeletingClient, setIsDeletingClient] = useState(false);
  
  // Contacts State
  const [unreadContactCount, setUnreadContactCount] = useState(0);

  // Visit Filters
  const [visitFilterType, setVisitFilterType] = useState<'all' | 'month' | 'custom'>('all');
  const [visitStartDate, setVisitStartDate] = useState('');
  const [visitEndDate, setVisitEndDate] = useState('');
  const [visitMonth, setVisitMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  // Dashboard State
  const [dashboardStats, setDashboardStats] = useState({
    totalProjects: 0,
    totalArticles: 0,
    totalContacts: 0,
    unreadContacts: 0,
    totalClients: 0,
    totalVisits: 0
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [visitSeries, setVisitSeries] = useState<{ date: string; count: number }[]>([]);

  const fetchDashboardStats = async () => {
    try {
      let url = '/api/admin/dashboard/stats';
      const params = new URLSearchParams();

      if (visitFilterType === 'month' && visitMonth) {
        const [y, m] = visitMonth.split('-');
        const year = parseInt(y);
        const month = parseInt(m);
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0); // Last day of month
        
        // Helper to format YYYY-MM-DD
        const formatDate = (date: Date) => {
             const yyyy = date.getFullYear();
             const mm = String(date.getMonth() + 1).padStart(2, '0');
             const dd = String(date.getDate()).padStart(2, '0');
             return `${yyyy}-${mm}-${dd}`;
        };
        params.append('startDate', formatDate(start));
        params.append('endDate', formatDate(end));
      } else if (visitFilterType === 'custom' && visitStartDate && visitEndDate) {
        params.append('startDate', visitStartDate);
        params.append('endDate', visitEndDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const data = await api.get(url);
      setDashboardStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    }
  };

  const fetchVisitSeries = async () => {
    try {
      let url = '/api/admin/dashboard/visits-series';
      const params = new URLSearchParams();
      if (visitFilterType === 'month' && visitMonth) {
        const [y, m] = visitMonth.split('-');
        const year = parseInt(y);
        const month = parseInt(m);
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);
        const formatDate = (date: Date) => {
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        };
        params.append('startDate', formatDate(start));
        params.append('endDate', formatDate(end));
      } else if (visitFilterType === 'custom' && visitStartDate && visitEndDate) {
        params.append('startDate', visitStartDate);
        params.append('endDate', visitEndDate);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const data = await api.get(url);
      setVisitSeries(
          (Array.isArray(data) ? data : []).map((d: any) => ({
            date: d.date,
            count: d.count || 0
          }))
        );
    } catch (e) {
      console.error('Failed to fetch visit series', e);
    }
  };

  // Re-fetch when filters change
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
      fetchVisitSeries();
    }
  }, [visitFilterType, visitMonth, visitStartDate, visitEndDate]);

  const fetchRecentProjects = async () => {
    try {
      // Assuming the backend supports sort, otherwise defaults to ID desc usually
      const data = await api.get('/api/admin/projects?page=0&size=5');
      setRecentProjects(data.content || []);
    } catch (error) {
      console.error('Failed to fetch recent projects', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
      fetchRecentProjects();
    }
  }, [activeTab]);

  const fetchUnreadContactCount = async () => {
    try {
      const data = await api.get('/api/admin/contacts/unread-count');
      setUnreadContactCount(data.count || 0);
    } catch (e) {
      console.error('Failed to fetch unread contact count', e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadContactCount();
      // Poll every minute
      const interval = setInterval(fetchUnreadContactCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleExportProjects = async () => {
    if (selectedProjectIds.length === 0) {
      setToast({ text: 'Vui lòng chọn ít nhất một dự án để xuất Excel', type: 'error' });
      return;
    }
    try {
      setIsExportingProjects(true);
      const blob = await api.download('/api/admin/export/projects', {
        method: 'POST',
        body: JSON.stringify(selectedProjectIds),
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Danh_sach_du_an.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setToast({ text: 'Lỗi khi xuất danh sách dự án', type: 'error' });
    } finally {
      setIsExportingProjects(false);
    }
  };

  const handleExportClients = async () => {
    try {
      setIsExportingClients(true);
      const blob = await api.download('/api/admin/export/clients', {
        method: 'POST',
        body: JSON.stringify(selectedClientIds),
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Danh_sach_khach_hang.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setToast({ text: 'Lỗi khi xuất danh sách khách hàng', type: 'error' });
    } finally {
      setIsExportingClients(false);
    }
  };

  // Cloudinary
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
  const [isUploading, setIsUploading] = useState(false);

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

  const pageNumbers = Array.from({ length: projectTotalPages }, (_, index) => index);

  const handleToggleFeatured = async (project: any, featured: boolean) => {
    try {
      const saved = await api.put(`/api/admin/projects/${project.id}`, { ...project, featured });
      setProjects((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      setToast({ type: 'success', text: 'Cập nhật trạng thái nổi bật thành công' });
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Lỗi kết nối' });
    }
  };

  const handleToggleClientFeatured = async (client: any, featured: boolean) => {
    try {
      const saved = await api.put(`/api/admin/clients/${client.id}`, { ...client, featured });
      setClients((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
      setToast({ type: 'success', text: 'Cập nhật trạng thái nổi bật thành công' });
    } catch (err: any) {
      setToast({ type: 'error', text: err.message || 'Lỗi kết nối' });
    }
  };

  const visiblePageNumbers = pageNumbers.slice(
    Math.max(0, projectPage - 2),
    Math.max(0, projectPage - 2) + 5,
  );
  const projectStartIndex = projectTotalElements === 0 ? 0 : projectPage * projectSize + 1;
  const projectEndIndex = Math.min(projectTotalElements, (projectPage + 1) * projectSize);

  const clientPageNumbers = Array.from({ length: clientTotalPages }, (_, index) => index);
  const visibleClientPageNumbers = clientPageNumbers.slice(
    Math.max(0, clientPage - 2),
    Math.max(0, clientPage - 2) + 5,
  );
  const clientStartIndex = clientTotalElements === 0 ? 0 : clientPage * clientSize + 1;
  const clientEndIndex = Math.min(clientTotalElements, (clientPage + 1) * clientSize);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('adminDarkMode', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/admin/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setProjectSearchDebounced(projectSearch);
    }, 400);
    return () => clearTimeout(handle);
  }, [projectSearch]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setClientSearchDebounced(clientSearch);
    }, 400);
    return () => clearTimeout(handle);
  }, [clientSearch]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setShowBackToTop(false);
    if (activeTab.startsWith('static-')) {
      setIsStaticPagesOpen(true);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'projects') return;
    const fetchProjects = async () => {
      try {
        setProjectLoading(true);
        setProjectError(null);
        const params = new URLSearchParams();
        params.set('page', String(projectPage));
        params.set('size', String(projectSize));
        if (projectFilterCat) params.set('cat', projectFilterCat);
        if (projectFilterStatus) params.set('status', projectFilterStatus);
        if (projectFilterPriority) params.set('priority', projectFilterPriority);
        if (projectSearchDebounced) params.set('q', projectSearchDebounced);
        const data = await api.get(`/api/admin/projects?${params.toString()}`);
        setProjects(Array.isArray(data.content) ? data.content : []);
        setSelectedProjectIds([]);
        setProjectTotalElements(typeof data.totalElements === 'number' ? data.totalElements : 0);
        setProjectTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 0);
      } catch (e: any) {
        setProjectError(e?.message || 'Có lỗi xảy ra');
      } finally {
        setProjectLoading(false);
      }
    };
    fetchProjects();
  }, [activeTab, projectPage, projectSize, projectFilterCat, projectFilterStatus, projectFilterPriority, projectSearchDebounced]);

  useEffect(() => {
    if (activeTab !== 'projects') return;
    const fetchCategories = async () => {
      try {
        const data = await api.get('/api/admin/projects/categories');
        if (Array.isArray(data)) {
          setProjectCategories(data);
        }
        // Fetch managed categories for modal
        const managedData = await api.get('/api/categories/project');
        if (Array.isArray(managedData)) {
          setManagedProjectCategories(managedData);
        }
      } catch {
      }
    };
    fetchCategories();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'customers') return;
    const fetchClients = async () => {
      try {
        setClientLoading(true);
        setClientError(null);
        const params = new URLSearchParams();
        params.set('page', String(clientPage));
        params.set('size', String(clientSize));
        if (clientFilterCat) params.set('cat', clientFilterCat);
        if (clientSearchDebounced) params.set('q', clientSearchDebounced);
        const data = await api.get(`/api/admin/clients?${params.toString()}`);
        setClients(Array.isArray(data.content) ? data.content : []);
        setSelectedClientIds([]);
        setClientTotalElements(typeof data.totalElements === 'number' ? data.totalElements : 0);
        setClientTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 0);
      } catch (e: any) {
        setClientError(e?.message || 'Có lỗi xảy ra');
      } finally {
        setClientLoading(false);
      }
    };
    fetchClients();
  }, [activeTab, clientPage, clientSize, clientFilterCat, clientSearchDebounced]);

  useEffect(() => {
    if (activeTab !== 'customers') return;
    const fetchCategories = async () => {
      try {
        const data = await api.get('/api/admin/clients/categories');
        if (Array.isArray(data)) {
          setClientCategories(data);
        }
        // Fetch managed categories for modal
        const managedData = await api.get('/api/categories/client');
        if (Array.isArray(managedData)) {
          setManagedClientCategories(managedData);
        }
      } catch {
      }
    };
    fetchCategories();
  }, [activeTab]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await api.post('/api/auth/logout', { refreshToken });
      }
    } catch {
    } finally {
      clearTokens();
      localStorage.removeItem('user');
      navigate('/admin/login');
    }
  };

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const saveSettings = () => {
    localStorage.setItem('lang', settingsLang);
    localStorage.setItem('uiDensity', uiDensity);
    localStorage.setItem('primaryTheme', primaryTheme);
    window.dispatchEvent(new Event('langchange'));
    setSettingsMessage({ type: 'success', text: 'Đã lưu cài đặt' });
    setTimeout(() => setSettingsMessage(null), 3000);
  };

  const SidebarItem = ({ icon: Icon, label, active = false, onClick, badge }: any) => (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`} />
        <span className="font-medium">{label}</span>
      </div>
      {badge > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          active 
            ? 'bg-white text-blue-600' 
            : 'bg-red-500 text-white'
        }`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-6 rounded-2xl relative overflow-hidden group shadow-sm dark:shadow-none"
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        </div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h2>
      </div>
    </motion.div>
  );

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const top = e.currentTarget.scrollTop;
    setShowBackToTop(
      (activeTab === 'settings' ||
        activeTab === 'static-webdesign' ||
        activeTab === 'static-seo-overall' ||
        activeTab === 'static-website-care' ||
        activeTab === 'static-tiktok-ads' ||
        activeTab === 'static-facebook-ads' ||
        activeTab === 'static-google-ads') &&
        top > 300,
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans flex overflow-hidden">
      {renderToast()}
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col shadow-xl dark:shadow-none"
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-bold text-xl text-white">V</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              Victor Admin
            </span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Tổng quan" 
            active={activeTab === 'dashboard'} 
            onClick={() => changeTab('dashboard')}
          />
          <SidebarItem 
            icon={FolderKanban} 
            label="Quản lý dự án" 
            active={activeTab === 'projects'}
            onClick={() => changeTab('projects')}
          />
          <SidebarItem 
            icon={Users} 
            label="Khách hàng" 
            active={activeTab === 'customers'}
            onClick={() => changeTab('customers')}
          />
          <SidebarItem 
            icon={Mail} 
            label="Liên hệ" 
            active={activeTab === 'contacts'}
            onClick={() => changeTab('contacts')}
            badge={unreadContactCount}
          />
          <SidebarItem 
            icon={FileText}  
            label="Bài viết" 
            active={activeTab === 'articles'}
            onClick={() => changeTab('articles')}
          />
          <SidebarItem 
            icon={Star} 
            label="Đánh giá Google" 
            active={activeTab === 'google-reviews'}
            onClick={() => changeTab('google-reviews')}
          />
          <div className="pt-6 pb-2 px-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nội dung</p>
          </div>
          <div
            onClick={() => setIsStaticPagesOpen((v) => !v)}
            className="cursor-pointer flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
              <span className="font-medium">Quản lý trang tĩnh</span>
            </div>
            {isStaticPagesOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
          {isStaticPagesOpen && (
            <div className="pl-4 space-y-1">
              <div
                onClick={() => changeTab('static-home')}
                className={`flex items-center space-x-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                  activeTab === 'static-home'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Home
                  className={`w-5 h-5 ${
                    activeTab === 'static-home'
                      ? 'text-white'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                />
                <span className="font-medium">Trang chủ</span>
              </div>
              <div
                onClick={() => changeTab('static-webdesign')}
                className={`flex items-center space-x-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                  activeTab === 'static-webdesign'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor
                  className={`w-5 h-5 ${
                    activeTab === 'static-webdesign'
                      ? 'text-white'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                />
                <span className="font-medium">Thiết kế website</span>
              </div>
              <div
                onClick={() => changeTab('static-seo-overall')}
                className={`flex items-center space-x-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                  activeTab === 'static-seo-overall'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor
                  className={`w-5 h-5 ${
                    activeTab === 'static-seo-overall'
                      ? 'text-white'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                />
                <span className="font-medium">Dịch vụ SEO Tổng Thể</span>
              </div>
              <div
                onClick={() => changeTab('static-website-care')}
                className={`flex items-center space-x-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                  activeTab === 'static-website-care'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor
                  className={`w-5 h-5 ${
                    activeTab === 'static-website-care'
                      ? 'text-white'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                />
                <span className="font-medium">Chăm sóc Website</span>
              </div>
              <div
                onClick={() => changeTab('static-tiktok-ads')}
                className={`flex items-center space-x-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                  activeTab === 'static-tiktok-ads'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor
                  className={`w-5 h-5 ${
                    activeTab === 'static-tiktok-ads'
                      ? 'text-white'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                />
                <span className="font-medium">Quảng cáo TikTok</span>
              </div>
              <div
                onClick={() => changeTab('static-facebook-ads')}
                className={`flex items-center space-x-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                  activeTab === 'static-facebook-ads'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor
                  className={`w-5 h-5 ${
                    activeTab === 'static-facebook-ads'
                      ? 'text-white'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                />
                <span className="font-medium">Quảng cáo Facebook</span>
              </div>
              <div
                onClick={() => changeTab('static-google-ads')}
                className={`flex items-center space-x-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                  activeTab === 'static-google-ads'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor
                  className={`w-5 h-5 ${
                    activeTab === 'static-google-ads'
                      ? 'text-white'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                />
                <span className="font-medium">Quảng cáo Google</span>
              </div>
            </div>
          )}
          <div className="pt-6 pb-2 px-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hệ thống</p>
          </div>
          <SidebarItem 
            icon={Settings} 
            label="Cài đặt" 
            active={activeTab === 'settings'}
            onClick={() => changeTab('settings')}
          />
          <SidebarItem 
            icon={Layers} 
            label="Quản lý danh mục" 
            active={activeTab === 'categories'}
            onClick={() => changeTab('categories')}
          />
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-medium truncate text-slate-900 dark:text-white">{user?.username || 'Admin'}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'admin@victor.com'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center justify-center space-x-2 p-3 rounded-xl font-medium transition-colors ${
              isLoggingOut
                ? 'bg-red-500 text-white cursor-wait opacity-90'
                : 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10'
            }`}
          >
            {isLoggingOut ? (
              <>
                <span className="inline-flex h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                <span>Đang đăng xuất...</span>
              </>
            ) : (
              <>
                <LogOut className="w-5 h-5" />
                <span>Đăng xuất</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        layout
        animate={{ marginLeft: isSidebarOpen && isDesktop ? 280 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 flex flex-col h-screen overflow-hidden relative w-full"
      >
        {/* Header */}
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-8 z-40 sticky top-0">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-xl px-4 py-2 border border-transparent dark:border-slate-700 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-800 transition-colors w-64">
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 w-full"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={handleBellClick}
                className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Bell className="w-6 h-6" />
                {unreadContactCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white animate-pulse">
                    {unreadContactCount > 9 ? '9+' : unreadContactCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Thông báo mới</h3>
                    <button 
                      onClick={() => {
                        changeTab('contacts');
                        setIsNotificationsOpen(false);
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Xem tất cả
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {latestUnreadContacts.length > 0 ? (
                      latestUnreadContacts.map((contact) => (
                        <div 
                          key={contact.id}
                          onClick={() => {
                              changeTab('contacts');
                              setIsNotificationsOpen(false);
                          }}
                          className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-100 dark:border-slate-700/50 last:border-0 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-sm text-slate-900 dark:text-white truncate max-w-[150px]">{contact.name}</span>
                              <span className="text-[10px] text-slate-400">{new Date(contact.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{contact.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                        Không có thông báo mới
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main
          ref={scrollRef}
          onScroll={handleScroll}
          className={`flex-1 overflow-y-auto ${uiDensity === 'compact' ? 'p-4 lg:p-6' : 'p-6 lg:p-8'}`}
        >
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {activeTab === 'dashboard'
                    ? 'Tổng quan'
                    : activeTab === 'settings'
                    ? 'Cài đặt hệ thống'
                    : activeTab === 'projects'
                    ? 'Quản lý dự án'
                    : activeTab === 'customers'
                    ? 'Khách hàng'
                    : activeTab === 'contacts'
                    ? 'Danh sách liên hệ'
                    : activeTab === 'static-home'
                    ? 'Trang chủ'
                    : activeTab === 'static-webdesign'
                    ? 'Thiết kế website'
                    : activeTab === 'static-seo-overall'
                    ? 'Dịch vụ SEO Tổng Thể'
                    : activeTab === 'static-website-care'
                    ? 'Chăm sóc Website'
                    : activeTab === 'static-tiktok-ads'
                    ? 'Quảng cáo TikTok'
                    : activeTab === 'static-facebook-ads'
                    ? 'Quảng cáo Facebook'
                    : activeTab === 'static-google-ads'
                    ? 'Quảng cáo Google'
                    : activeTab === 'google-reviews'
                    ? 'Quản lý đánh giá Google'
                    : 'Quản lý bài viết'}
                </h1>
                {activeTab === 'static-webdesign' ||
                activeTab === 'static-seo-overall' ||
                activeTab === 'static-home' ||
                activeTab === 'static-website-care' ||
                activeTab === 'static-tiktok-ads' ||
                activeTab === 'static-facebook-ads' ||
                activeTab === 'static-google-ads' ? (
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <button
                      onClick={() => changeTab('dashboard')}
                      className="px-2 py-1 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Tổng quan
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                      Quản lý trang tĩnh
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    {activeTab === 'static-webdesign' ? (
                      <span className="px-2 py-1 rounded-lg bg-blue-600 text-white">Thiết kế website</span>
                    ) : activeTab === 'static-seo-overall' ? (
                      <span className="px-2 py-1 rounded-lg bg-blue-600 text-white">Dịch vụ SEO Tổng Thể</span>
                    ) : activeTab === 'static-website-care' ? (
                      <span className="px-2 py-1 rounded-lg bg-blue-600 text-white">Chăm sóc Website</span>
                    ) : activeTab === 'static-tiktok-ads' ? (
                      <span className="px-2 py-1 rounded-lg bg-blue-600 text-white">Quảng cáo TikTok</span>
                    ) : activeTab === 'static-facebook-ads' ? (
                      <span className="px-2 py-1 rounded-lg bg-blue-600 text-white">Quảng cáo Facebook</span>
                    ) : activeTab === 'static-google-ads' ? (
                      <span className="px-2 py-1 rounded-lg bg-blue-600 text-white">Quảng cáo Google</span>
                    ) : (
                      <span className="px-2 py-1 rounded-lg bg-blue-600 text-white">Trang chủ</span>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {activeTab === 'dashboard'
                      ? 'Tổng quan về hiệu suất website và dự án của bạn'
                      : activeTab === 'settings'
                      ? 'Quản lý cấu hình website và SEO'
                      : 'Quản lý thông tin chi tiết'}
                  </p>
                )}
              </div>
            </div>

            {activeTab === 'dashboard' && (
              <>
                {/* Visit Statistics Section */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Thống kê truy cập
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Theo dõi lượt truy cập website theo thời gian
                      </p>
                    </div>
                    
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center">
                        <button
                          onClick={() => setVisitFilterType('all')}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            visitFilterType === 'all'
                              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          Tất cả
                        </button>
                        <button
                          onClick={() => setVisitFilterType('month')}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            visitFilterType === 'month'
                              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          Theo tháng
                        </button>
                        <button
                          onClick={() => setVisitFilterType('custom')}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            visitFilterType === 'custom'
                              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          Tùy chỉnh
                        </button>
                      </div>

                      {/* Date Inputs */}
                      {(visitFilterType === 'month' || visitFilterType === 'custom') && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
                          {visitFilterType === 'month' && (
                            <input
                              type="month"
                              value={visitMonth}
                              onChange={(e) => setVisitMonth(e.target.value)}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                          )}
                          {visitFilterType === 'custom' && (
                            <>
                              <input
                                type="date"
                                value={visitStartDate}
                                onChange={(e) => setVisitStartDate(e.target.value)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                              />
                              <span className="text-slate-400">-</span>
                              <input
                                type="date"
                                value={visitEndDate}
                                onChange={(e) => setVisitEndDate(e.target.value)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                              />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={visitSeries}>
                        <defs>
                          <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(d) =>
                            new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
                          }
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value: any) => [value, 'Lượt truy cập']}
                          labelFormatter={(label: any) =>
                            new Date(label).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                          }
                        />
                        <Area type="monotone" dataKey="count" stroke="#06b6d4" fill="url(#colorVisits)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard 
                    title="Tổng Dự Án" 
                    value={(dashboardStats.totalProjects || 0).toString()} 
                    icon={FolderKanban} 
                    color="text-blue-500" 
                    trend={0} 
                  />
                  <StatCard 
                    title="Tổng Bài Viết" 
                    value={(dashboardStats.totalArticles || 0).toString()} 
                    icon={FileText} 
                    color="text-purple-500" 
                    trend={0} 
                  />
                  <StatCard 
                    title="Tổng Khách Hàng" 
                    value={(dashboardStats.totalClients || 0).toString()} 
                    icon={Users} 
                    color="text-pink-500" 
                    trend={0} 
                  />
                  <StatCard 
                    title="Liên Hệ Mới" 
                    value={(dashboardStats.unreadContacts || 0).toString()} 
                    icon={Mail} 
                    color="text-green-500" 
                    trend={0} 
                  />
                </div>

                {/* Recent Projects Section */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Dự án gần đây</h3>
                    <button onClick={() => changeTab('projects')} className="text-blue-500 dark:text-blue-400 text-sm hover:text-blue-600 dark:hover:text-blue-300">Xem tất cả</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                      <thead className="bg-slate-50 dark:bg-slate-950/50 text-xs uppercase font-medium text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="px-6 py-4">Tên Dự Án</th>
                          <th className="px-6 py-4">Khách Hàng</th>
                          <th className="px-6 py-4">Trạng Thái</th>
                          <th className="px-6 py-4">Ngày Tạo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {recentProjects.length > 0 ? (
                          recentProjects.map((project) => (
                            <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden">
                                    {project.img ? (
                                        <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-300 dark:bg-slate-600" />
                                    )}
                                </div>
                                <span className="truncate max-w-[200px]">{project.title}</span>
                              </td>
                              <td className="px-6 py-4">{project.client}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                  project.status === 'Done' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                  project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                  'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                }`}>
                                  {project.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">{project.createdAt ? new Date(project.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                              Chưa có dự án nào
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <ProjectsPageContentForm />
                <QuoteModal
                  isOpen={isQuoteModalOpen}
                  onClose={() => setIsQuoteModalOpen(false)}
                  selectedProjects={projects.filter((p) => selectedProjectIds.includes(Number(p.id)))}
                />
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3 w-full md:max-w-xl">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Danh mục dự án (Website)</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Danh sách dự án với phân trang, lọc theo trạng thái và mức độ ưu tiên.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                        value={projectSearch}
                        onChange={(e) => {
                          setProjectPage(0);
                          setProjectSearch(e.target.value);
                        }}
                          placeholder="Lọc theo tên dự án hoặc ID..."
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                        />
                        <select
                          value={projectFilterStatus}
                          onChange={(e) => {
                            setProjectPage(0);
                            setProjectFilterStatus(e.target.value);
                          }}
                          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm min-w-[140px]"
                        >
                          <option value="">Tất cả trạng thái</option>
                          <option value="Todo">Todo</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                          <option value="Canceled">Canceled</option>
                          <option value="Backlog">Backlog</option>
                        </select>
                        <select
                          value={projectFilterPriority}
                          onChange={(e) => {
                            setProjectPage(0);
                            setProjectFilterPriority(e.target.value);
                          }}
                          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm min-w-[140px]"
                        >
                          <option value="">Tất cả mức độ</option>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <select
                          value={projectFilterCat}
                          onChange={(e) => {
                            setProjectPage(0);
                            setProjectFilterCat(e.target.value);
                          }}
                          className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value="">Tất cả danh mục</option>
                          {projectCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedProjectIds.length === 0) {
                            setToast({ text: 'Vui lòng chọn ít nhất một dự án để báo giá', type: 'error' });
                            return;
                          }
                          setIsQuoteModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Báo giá
                      </button>
                      <button
                        type="button"
                        onClick={handleExportProjects}
                        disabled={isExportingProjects}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors"
                      >
                        {isExportingProjects ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Xuất Excel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject({
                            id: null,
                            title: '',
                            titleEn: '',
                            cat: projectFilterCat || '',
                            img: '',
                            description: '',
                            descriptionEn: '',
                            features: [],
                            technologies: [],
                            gallery: [],
                            demoLink: '',
                            client: '',
                            completionDate: '',
                            status: 'Todo',
                            priority: 'Medium',
                            featured: false,
                          });
                          setProjectEditorLang('vi');
                          setShowProjectModal(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                      >
                        <Plus className="w-4 h-4" /> Thêm dự án
                      </button>
                    </div>
                  </div>

                  {projectError && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 rounded-xl">
                      <AlertCircle className="w-4 h-4" />
                      <span>{projectError}</span>
                    </div>
                  )}

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                      <thead className="bg-slate-50 dark:bg-slate-950/40 text-xs uppercase font-medium text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="px-4 py-3 w-10">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 dark:border-slate-700"
                              checked={projects.length > 0 && selectedProjectIds.length === projects.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProjectIds(projects.map((p) => Number(p.id)));
                                } else {
                                  setSelectedProjectIds([]);
                                }
                              }}
                            />
                          </th>
                          <th className="px-4 py-3 w-20">ID</th>
                          <th className="px-4 py-3 min-w-[220px]">Tên dự án</th>
                          <th className="px-4 py-3 min-w-[140px]">Danh mục</th>
                          <th className="px-4 py-3 w-20 text-center">Nổi bật</th>
                          <th className="px-4 py-3 min-w-[140px]">Trạng thái</th>
                          <th className="px-4 py-3 min-w-[120px]">Mức độ ưu tiên</th>
                          <th className="px-4 py-3 text-right w-32">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {projectLoading ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                              Đang tải dữ liệu...
                            </td>
                          </tr>
                        ) : projects
                            .map((p) => (
                              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                                <td className="px-4 py-3">
                                  <input
                                    type="checkbox"
                                    className="rounded border-slate-300 dark:border-slate-700"
                                    checked={selectedProjectIds.includes(Number(p.id))}
                                    onChange={(e) => {
                                      const id = Number(p.id);
                                      if (e.target.checked) {
                                        setSelectedProjectIds((prev) =>
                                          prev.includes(id) ? prev : [...prev, id],
                                        );
                                      } else {
                                        setSelectedProjectIds((prev) => prev.filter((x) => x !== id));
                                      }
                                    }}
                                  />
                                </td>
                                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                  TASK-{p.id}
                                </td>
                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                                      {p.cat || 'Website'}
                                    </span>
                                    <span className="truncate">
                                      {settingsLang === 'en' && p.titleEn ? p.titleEn : p.title || 'Chưa đặt tên'}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs">
                                    {p.client || 'Khách hàng ẩn danh'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={p.featured || false}
                                    onChange={(e) => handleToggleFeatured(p, e.target.checked)}
                                    className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                  />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                      p.status === 'Done'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        : p.status === 'In Progress'
                                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                                        : p.status === 'Canceled'
                                        ? 'bg-rose-50 text-rose-700 border-rose-100'
                                        : p.status === 'Backlog'
                                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                                        : 'bg-slate-50 text-slate-600 border-slate-200'
                                    }`}
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    <span>{p.status || 'Todo'}</span>
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                      p.priority === 'High'
                                        ? 'bg-red-50 text-red-700 border-red-100'
                                        : p.priority === 'Medium'
                                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                                        : 'bg-slate-50 text-slate-600 border-slate-200'
                                    }`}
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    <span>{p.priority || 'Low'}</span>
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                  <div className="inline-flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingProject({
                                          ...p,
                                        });
                                        setShowProjectModal(true);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span>Sửa</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setProjectToDelete(p);
                                        setShowDeleteConfirm(true);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Xóa</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        {!projectLoading && projects.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                              Chưa có dự án nào.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <span>Rows per page</span>
                        <select
                          value={projectSize}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setProjectPage(0);
                            setProjectSize(value);
                          }}
                          className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                      <span className="hidden sm:inline">
                        {projectStartIndex}-{projectEndIndex} of {projectTotalElements}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <button
                        type="button"
                        disabled={projectPage === 0}
                        onClick={() => setProjectPage((p) => Math.max(0, p - 1))}
                        className={`h-8 w-8 inline-flex items-center justify-center rounded-lg border ${
                          projectPage === 0
                            ? 'border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                            : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        ‹
                      </button>
                      {visiblePageNumbers.map((pageIndex) => (
                        <button
                          key={pageIndex}
                          type="button"
                          onClick={() => setProjectPage(pageIndex)}
                          className={`h-8 min-w-[32px] px-2 inline-flex items-center justify-center rounded-lg border ${
                            pageIndex === projectPage
                              ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {pageIndex + 1}
                        </button>
                      ))}
                      {projectTotalPages > 0 && visiblePageNumbers[visiblePageNumbers.length - 1] < projectTotalPages - 1 && (
                        <>
                          <span className="px-1 text-slate-400">…</span>
                          <button
                            type="button"
                            onClick={() => setProjectPage(projectTotalPages - 1)}
                            className={`h-8 min-w-[32px] px-2 inline-flex items-center justify-center rounded-lg border ${
                              projectPage === projectTotalPages - 1
                                ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {projectTotalPages}
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        disabled={projectPage + 1 >= projectTotalPages}
                        onClick={() =>
                          setProjectPage((p) => (projectTotalPages > 0 ? Math.min(projectTotalPages - 1, p + 1) : p))
                        }
                        className={`h-8 w-8 inline-flex items-center justify-center rounded-lg border ${
                          projectPage + 1 >= projectTotalPages
                            ? 'border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                            : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </div>

                {showProjectModal && editingProject && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" style={{marginTop: "0px"}}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-[80%] max-w-none max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {editingProject.id ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
                          </h3>
                          <div className="mt-2 inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 p-1">
                            <button
                              type="button"
                              onClick={() => setProjectEditorLang('vi')}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                projectEditorLang === 'vi'
                                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              Tiếng Việt
                            </button>
                            <button
                              type="button"
                              onClick={() => setProjectEditorLang('en')}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                projectEditorLang === 'en'
                                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              English
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowProjectModal(false)}
                          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-6 overflow-y-auto">
                        <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {projectEditorLang === 'vi' ? 'Tên dự án (Tiếng Việt)' : 'Tên dự án (English)'}
                          </label>
                          <input
                            type="text"
                            value={
                              projectEditorLang === 'vi'
                                ? editingProject.title || ''
                                : editingProject.titleEn || ''
                            }
                            onChange={(e) =>
                              setEditingProject((prev: any) =>
                                projectEditorLang === 'vi'
                                  ? { ...prev, title: e.target.value }
                                  : { ...prev, titleEn: e.target.value },
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Danh mục</label>
                          <select
                            value={editingProject.cat || ''}
                            onChange={(e) =>
                              setEditingProject((prev: any) => ({ ...prev, cat: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                          >
                            <option value="">-- Chọn danh mục --</option>
                            {managedProjectCategories.map((cat: any) => (
                              <option key={cat.id} value={cat.name}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2 flex items-center gap-2 pt-6">
                          <input
                            type="checkbox"
                            checked={editingProject.featured || false}
                            onChange={(e) =>
                              setEditingProject((prev: any) => ({ ...prev, featured: e.target.checked }))
                            }
                            id="featured-checkbox"
                            className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-5 h-5 cursor-pointer"
                          />
                          <label
                            htmlFor="featured-checkbox"
                            className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                          >
                            Dự án nổi bật (Tối đa 6/danh mục)
                          </label>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ảnh đại diện</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editingProject.img || ''}
                              onChange={(e) =>
                                setEditingProject((prev: any) => ({ ...prev, img: e.target.value }))
                              }
                              placeholder="https://..."
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                            />
                            <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    setIsUploading(true);
                                    const url = await handleImageUpload(file);
                                    setEditingProject((prev: any) => ({ ...prev, img: url }));
                                    setToast({ type: 'success', text: 'Upload thành công!' });
                                  } catch (error) {
                                    setToast({ type: 'error', text: 'Upload thất bại!' });
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }}
                              />
                              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            </label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Khách hàng</label>
                          <input
                            type="text"
                            value={editingProject.client || ''}
                            onChange={(e) =>
                              setEditingProject((prev: any) => ({ ...prev, client: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {projectEditorLang === 'vi' ? 'Mô tả (Tiếng Việt)' : 'Mô tả (English)'}
                          </label>
                          <textarea
                            rows={3}
                            value={
                              projectEditorLang === 'vi'
                                ? editingProject.description || ''
                                : editingProject.descriptionEn || ''
                            }
                            onChange={(e) =>
                              setEditingProject((prev: any) =>
                                projectEditorLang === 'vi'
                                  ? { ...prev, description: e.target.value }
                                  : { ...prev, descriptionEn: e.target.value },
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Tính năng (mỗi dòng một mục)
                          </label>
                          <textarea
                            rows={3}
                            value={(editingProject.features || []).join('\n')}
                            onChange={(e) =>
                              setEditingProject((prev: any) => ({
                                ...prev,
                                features: e.target.value
                                  .split('\n')
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              }))
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Công nghệ (phân cách bằng dấu phẩy)
                          </label>
                          <input
                            type="text"
                            value={(editingProject.technologies || []).join(', ')}
                            onChange={(e) =>
                              setEditingProject((prev: any) => ({
                                ...prev,
                                technologies: e.target.value
                                  .split(',')
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              }))
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Gallery (mỗi dòng một URL)
                            </label>
                            <label className="cursor-pointer flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={async (e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length === 0) return;
                                  try {
                                    setIsUploading(true);
                                    const urls = await Promise.all(files.map(handleImageUpload));
                                    setEditingProject((prev: any) => {
                                      const currentGallery = prev.gallery || [];
                                      return { ...prev, gallery: [...currentGallery, ...urls] };
                                    });
                                    setToast({ type: 'success', text: `Đã upload ${urls.length} ảnh!` });
                                  } catch (error) {
                                    setToast({ type: 'error', text: 'Upload thất bại!' });
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }}
                              />
                              {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                              <span>Upload ảnh</span>
                            </label>
                          </div>
                          <textarea
                            rows={5}
                            value={(editingProject.gallery || []).join('\n')}
                            onChange={(e) =>
                              setEditingProject((prev: any) => ({
                                ...prev,
                                gallery: e.target.value
                                  .split('\n')
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              }))
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Link demo</label>
                          <input
                            type="text"
                            value={editingProject.demoLink || ''}
                            onChange={(e) =>
                              setEditingProject((prev: any) => ({ ...prev, demoLink: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Ngày hoàn thành
                          </label>
                          <input
                            type="text"
                            value={editingProject.completionDate || ''}
                            onChange={(e) =>
                              setEditingProject((prev: any) => ({
                                ...prev,
                                completionDate: e.target.value,
                              }))
                            }
                            placeholder="dd/MM/yyyy hoặc định dạng tùy chọn"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                          />
                        </div>
                      </div>

                      <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                          <Search className="w-4 h-4" />
                          Cấu hình SEO
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              SEO Title ({projectEditorLang === 'vi' ? 'Tiếng Việt' : 'English'})
                            </label>
                            <input
                              type="text"
                              value={
                                projectEditorLang === 'vi'
                                  ? editingProject.seoTitle || ''
                                  : editingProject.seoTitleEn || ''
                              }
                              onChange={(e) =>
                                setEditingProject((prev: any) =>
                                  projectEditorLang === 'vi'
                                    ? { ...prev, seoTitle: e.target.value }
                                    : { ...prev, seoTitleEn: e.target.value }
                                )
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Slug / URL ({projectEditorLang === 'vi' ? 'Tiếng Việt' : 'English'})
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={
                                  projectEditorLang === 'vi'
                                    ? editingProject.slug || ''
                                    : editingProject.slugEn || ''
                                }
                                onChange={(e) =>
                                  setEditingProject((prev: any) =>
                                    projectEditorLang === 'vi'
                                      ? { ...prev, slug: e.target.value }
                                      : { ...prev, slugEn: e.target.value }
                                  )
                                }
                                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const title =
                                    projectEditorLang === 'vi'
                                      ? editingProject.title
                                      : editingProject.titleEn;
                                  if (title) {
                                    const slug = toSlug(title);
                                    setEditingProject((prev: any) =>
                                      projectEditorLang === 'vi'
                                        ? { ...prev, slug }
                                        : { ...prev, slugEn: slug }
                                    );
                                  }
                                }}
                                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
                              >
                                Auto
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              SEO Description ({projectEditorLang === 'vi' ? 'Tiếng Việt' : 'English'})
                            </label>
                            <textarea
                              rows={2}
                              value={
                                projectEditorLang === 'vi'
                                  ? editingProject.seoDescription || ''
                                  : editingProject.seoDescriptionEn || ''
                              }
                              onChange={(e) =>
                                setEditingProject((prev: any) =>
                                  projectEditorLang === 'vi'
                                    ? { ...prev, seoDescription: e.target.value }
                                    : { ...prev, seoDescriptionEn: e.target.value }
                                )
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              SEO Keywords ({projectEditorLang === 'vi' ? 'Tiếng Việt' : 'English'})
                            </label>
                            <input
                              type="text"
                              value={
                                projectEditorLang === 'vi'
                                  ? editingProject.seoKeywords || ''
                                  : editingProject.seoKeywordsEn || ''
                              }
                              onChange={(e) =>
                                setEditingProject((prev: any) =>
                                  projectEditorLang === 'vi'
                                    ? { ...prev, seoKeywords: e.target.value }
                                    : { ...prev, seoKeywordsEn: e.target.value }
                                )
                              }
                              placeholder="keyword1, keyword2, ..."
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      </div>
                      <div className="flex justify-end gap-3 p-6 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl">
                        <button
                          type="button"
                          disabled={isSavingProject}
                          onClick={() => setShowProjectModal(false)}
                          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          disabled={isSavingProject}
                          onClick={async () => {
                            const payload = { ...editingProject };
                            try {
                              setIsSavingProject(true);
                              let saved;
                              if (payload.id) {
                                saved = await api.put(`/api/admin/projects/${payload.id}`, payload);
                              } else {
                                saved = await api.post('/api/admin/projects', payload);
                              }
                              
                              setShowProjectModal(false);
                              setEditingProject(null);
                              setProjects((prev) => {
                                const exists = prev.find((p) => p.id === saved.id);
                                if (exists) {
                                  return prev.map((p) => (p.id === saved.id ? saved : p));
                                }
                                return [saved, ...prev];
                              });
                              setToast({ type: 'success', text: 'Lưu dự án thành công!' });
                            } catch (error: any) {
                              setToast({ type: 'error', text: error.message || 'Lỗi kết nối server' });
                            } finally {
                              setIsSavingProject(false);
                            }
                          }}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSavingProject ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Đang lưu...</span>
                            </>
                          ) : (
                            <span>Lưu dự án</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && projectToDelete && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" style={{marginTop: "0px"}}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              Xóa dự án?
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                              Hành động này không thể hoàn tác.
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                          Bạn có chắc chắn muốn xóa dự án <span className="font-semibold text-slate-900 dark:text-white">"{projectToDelete.title}"</span> không?
                        </p>

                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                          >
                            Hủy bỏ
                          </button>
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={async () => {
                              try {
                                setIsDeleting(true);
                                await api.delete(`/api/admin/projects/${projectToDelete.id}`);
                                setProjects((prev) => prev.filter((item) => item.id !== projectToDelete.id));
                                setProjectTotalElements((prev) => (prev > 0 ? prev - 1 : 0));
                                setShowDeleteConfirm(false);
                                setProjectToDelete(null);
                              } catch (err) {
                                setProjectError('Có lỗi kết nối khi xóa dự án');
                                setShowDeleteConfirm(false);
                              } finally {
                                setIsDeleting(false);
                              }
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Đang xóa...</span>
                              </>
                            ) : (
                              <span>Xóa dự án</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="space-y-6">
                <ClientsPageContentForm />
                
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3 w-full md:max-w-xl">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Danh sách khách hàng</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Quản lý đối tác và khách hàng của bạn.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={clientSearch}
                          onChange={(e) => {
                            setClientPage(0);
                            setClientSearch(e.target.value);
                          }}
                          placeholder="Tìm kiếm khách hàng..."
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                        />
                        <div className="flex flex-wrap gap-2">
                        <select
                          value={clientFilterCat}
                          onChange={(e) => {
                            setClientPage(0);
                            setClientFilterCat(e.target.value);
                          }}
                          className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value="">Tất cả danh mục</option>
                          {clientCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 justify-end">
                      <button
                        type="button"
                        onClick={handleExportClients}
                        disabled={isExportingClients}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors"
                      >
                        {isExportingClients ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Xuất Excel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingClient({
                            id: null,
                            name: '',
                            category: '',
                            logo: '',
                            link: '',
                            featured: false,
                            status: 'Active',
                            priority: 'Medium'
                          });
                          setClientEditorLang('vi');
                          setShowClientModal(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                      >
                        <Plus className="w-4 h-4" /> Thêm khách hàng
                      </button>
                    </div>
                  </div>

                  {clientError && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 rounded-xl">
                      <AlertCircle className="w-4 h-4" />
                      <span>{clientError}</span>
                    </div>
                  )}

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                      <thead className="bg-slate-50 dark:bg-slate-950/40 text-xs uppercase font-medium text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="px-4 py-3 w-10">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 dark:border-slate-700"
                              checked={clients.length > 0 && selectedClientIds.length === clients.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedClientIds(clients.map((c) => Number(c.id)));
                                } else {
                                  setSelectedClientIds([]);
                                }
                              }}
                            />
                          </th>
                          <th className="px-4 py-3 w-20">ID</th>
                          <th className="px-4 py-3 min-w-[220px]">Tên khách hàng</th>
                          <th className="px-4 py-3 min-w-[140px]">Danh mục</th>
                          <th className="px-4 py-3 min-w-[140px]">Slug (URL)</th>
                          <th className="px-4 py-3 w-20 text-center">Nổi bật</th>
                          <th className="px-4 py-3 min-w-[140px]">Trạng thái</th>
                          <th className="px-4 py-3 text-right w-40">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {clientLoading ? (
                          <tr>
                            <td colSpan={8} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                              Đang tải dữ liệu...
                            </td>
                          </tr>
                        ) : clients.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                className="rounded border-slate-300 dark:border-slate-700"
                                checked={selectedClientIds.includes(Number(c.id))}
                                onChange={(e) => {
                                  const id = Number(c.id);
                                  if (e.target.checked) {
                                    setSelectedClientIds((prev) => prev.includes(id) ? prev : [...prev, id]);
                                  } else {
                                    setSelectedClientIds((prev) => prev.filter((x) => x !== id));
                                  }
                                }}
                              />
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                              #{c.id}
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                              <div className="flex items-center gap-3">
                                {c.logo ? (
                                    <img src={c.logo} alt={c.name} className="w-8 h-8 rounded object-cover border border-slate-200 dark:border-slate-700" />
                                ) : (
                                    <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                                        {c.name?.charAt(0)}
                                    </div>
                                )}
                                <span>{c.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs">
                                {c.category || 'Chưa phân loại'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                                {c.slug || '-'}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={c.featured || false}
                                onChange={(e) => handleToggleClientFeatured(c, e.target.checked)}
                                className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                  c.status === 'Active'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : 'bg-slate-50 text-slate-600 border-slate-200'
                                }`}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                <span>{c.status || 'Inactive'}</span>
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                <a
                                  href={`/vi/${SLUG_MAPPING['khach-hang'].vi}/${c.slug || c.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Xem</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingClient({ ...c });
                                    setShowClientModal(true);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Sửa</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setClientToDelete(c);
                                    setShowDeleteClientConfirm(true);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Xóa</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {!clientLoading && clients.length === 0 && (
                          <tr>
                            <td colSpan={8} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                              Chưa có khách hàng nào.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Client Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                       {/* Similar pagination controls as projects */}
                        <div className="flex items-center gap-2">
                        <span>Rows per page</span>
                        <select
                          value={clientSize}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setClientPage(0);
                            setClientSize(value);
                          }}
                          className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                      <span>
                        {clientStartIndex}-{clientEndIndex} of {clientTotalElements}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={clientPage === 0}
                        onClick={() => setClientPage((p) => Math.max(0, p - 1))}
                        className={`h-8 w-8 inline-flex items-center justify-center rounded-lg border ${
                          clientPage === 0
                            ? 'border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                            : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        ‹
                      </button>
                      {/* Simplified pagination for brevity, can expand later if needed */}
                       <span className="text-sm px-2">Page {clientPage + 1} of {Math.max(1, clientTotalPages)}</span>
                      <button
                        type="button"
                        disabled={clientPage + 1 >= clientTotalPages}
                        onClick={() =>
                          setClientPage((p) => (clientTotalPages > 0 ? Math.min(clientTotalPages - 1, p + 1) : p))
                        }
                        className={`h-8 w-8 inline-flex items-center justify-center rounded-lg border ${
                          clientPage + 1 >= clientTotalPages
                            ? 'border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                            : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </div>

                {/* Client Modal */}
                {showClientModal && editingClient && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" style={{marginTop: "0px"}}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-[90%] max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden">
                       <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {editingClient.id ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowClientModal(false)}
                          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-6 overflow-y-auto space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tên khách hàng</label>
                            <input
                                type="text"
                                value={editingClient.name || ''}
                                onChange={(e) => setEditingClient((prev: any) => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Danh mục</label>
                          <select
                            value={editingClient.category || ''}
                            onChange={(e) => setEditingClient((prev: any) => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                          >
                             <option value="">-- Chọn danh mục --</option>
                             {managedClientCategories.map((cat: any) => (
                               <option key={cat.id} value={cat.name}>
                                 {cat.name}
                               </option>
                             ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Slug (URL)</label>
                            <input
                                type="text"
                                value={editingClient.slug || ''}
                                onChange={(e) => setEditingClient((prev: any) => ({ ...prev, slug: e.target.value }))}
                                placeholder="vi-du-slug"
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ghé thăm Website (Link)</label>
                            <input
                                type="text"
                                value={editingClient.link || ''}
                                onChange={(e) => setEditingClient((prev: any) => ({ ...prev, link: e.target.value }))}
                                placeholder="https://example.com"
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mô tả chi tiết</label>
                            <textarea
                                value={editingClient.description || ''}
                                onChange={(e) => setEditingClient((prev: any) => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Đặc điểm nổi bật</label>
                          <div className="space-y-2">
                              {(function() {
                                  let feats: string[] = [];
                                  try { feats = JSON.parse(editingClient.features || '[]'); } catch {}
                                  if (!Array.isArray(feats)) feats = [];
                                  
                                  return (
                                      <>
                                          {feats.map((feat, idx) => (
                                              <div key={idx} className="flex gap-2">
                                                  <input
                                                      type="text"
                                                      value={feat}
                                                      onChange={(e) => {
                                                          const newFeats = [...feats];
                                                          newFeats[idx] = e.target.value;
                                                          setEditingClient((prev: any) => ({ ...prev, features: JSON.stringify(newFeats) }));
                                                      }}
                                                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                                                  />
                                                  <button
                                                      type="button"
                                                      onClick={() => {
                                                          const newFeats = feats.filter((_, i) => i !== idx);
                                                          setEditingClient((prev: any) => ({ ...prev, features: JSON.stringify(newFeats) }));
                                                      }}
                                                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                  >
                                                      <Trash2 className="w-4 h-4" />
                                                  </button>
                                              </div>
                                          ))}
                                          <button
                                              type="button"
                                              onClick={() => {
                                                  setEditingClient((prev: any) => ({ ...prev, features: JSON.stringify([...feats, '']) }));
                                              }}
                                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                          >
                                              + Thêm đặc điểm
                                          </button>
                                      </>
                                  );
                              })()}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hình ảnh dự án</label>
                            <label className="cursor-pointer flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg transition-colors">
                              <Upload className="w-3 h-3" />
                              <span>Upload thêm</span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={async (e) => {
                                  if (!e.target.files?.length) return;
                                  try {
                                    setIsUploading(true);
                                    const newUrls: string[] = [];
                                    for (let i = 0; i < e.target.files.length; i++) {
                                      const url = await handleImageUpload(e.target.files[i]);
                                      newUrls.push(url);
                                    }
                                    let currentImgs: string[] = [];
                                    try { currentImgs = JSON.parse(editingClient.images || '[]'); } catch {}
                                    if (!Array.isArray(currentImgs)) currentImgs = [];
                                    
                                    setEditingClient((prev: any) => ({ 
                                      ...prev, 
                                      images: JSON.stringify([...currentImgs, ...newUrls]) 
                                    }));
                                    setToast({ type: 'success', text: 'Upload thành công!' });
                                  } catch (error) {
                                    setToast({ type: 'error', text: 'Upload thất bại!' });
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }}
                              />
                            </label>
                          </div>
                          <textarea
                            value={(function() {
                              try {
                                const parsed = JSON.parse(editingClient.images || '[]');
                                return Array.isArray(parsed) ? parsed.join('\n') : '';
                              } catch { return ''; }
                            })()}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n');
                              setEditingClient((prev: any) => ({ ...prev, images: JSON.stringify(lines) }));
                            }}
                            placeholder={'https://example.com/image1.jpg\nhttps://example.com/image2.jpg'}
                            className="w-full h-32 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono leading-relaxed"
                          />
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Nhập đường dẫn ảnh, mỗi ảnh một dòng.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Logo</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editingClient.logo || ''}
                              onChange={(e) =>
                                setEditingClient((prev: any) => ({ ...prev, logo: e.target.value }))
                              }
                              placeholder="https://..."
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                            />
                            <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    setIsUploading(true);
                                    const url = await handleImageUpload(file);
                                    setEditingClient((prev: any) => ({ ...prev, logo: url }));
                                    setToast({ type: 'success', text: 'Upload thành công!' });
                                  } catch (error) {
                                    setToast({ type: 'error', text: 'Upload thất bại!' });
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }}
                              />
                              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            </label>
                          </div>
                        </div>
                         <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingClient.featured || false}
                            onChange={(e) =>
                              setEditingClient((prev: any) => ({ ...prev, featured: e.target.checked }))
                            }
                            id="client-featured-checkbox"
                            className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-5 h-5 cursor-pointer"
                          />
                          <label
                            htmlFor="client-featured-checkbox"
                            className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                          >
                            Khách hàng nổi bật
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Trạng thái</label>
                                <select
                                    value={editingClient.status || 'Active'}
                                    onChange={(e) => setEditingClient((prev: any) => ({ ...prev, status: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Độ ưu tiên</label>
                                <select
                                    value={editingClient.priority || 'Medium'}
                                    onChange={(e) => setEditingClient((prev: any) => ({ ...prev, priority: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                                >
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                             </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 p-6 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl">
                        <button
                          type="button"
                          disabled={isSavingClient}
                          onClick={() => setShowClientModal(false)}
                          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          disabled={isSavingClient}
                          onClick={async () => {
                            const payload = { ...editingClient };
                            // Clean up images
                            try {
                              const imgs = JSON.parse(payload.images || '[]');
                              if (Array.isArray(imgs)) {
                                payload.images = JSON.stringify(imgs.filter((i: any) => typeof i === 'string' && i.trim() !== ''));
                              }
                            } catch {}
                            try {
                              setIsSavingClient(true);
                              let saved;
                              if (payload.id) {
                                saved = await api.put(`/api/admin/clients/${payload.id}`, payload);
                              } else {
                                saved = await api.post('/api/admin/clients', payload);
                              }

                              setShowClientModal(false);
                              setEditingClient(null);
                              setClients((prev) => {
                                const exists = prev.find((c) => c.id === saved.id);
                                if (exists) {
                                  return prev.map((c) => (c.id === saved.id ? saved : c));
                                }
                                return [saved, ...prev];
                              });
                              setToast({ type: 'success', text: 'Lưu khách hàng thành công!' });
                            } catch {
                              setToast({ type: 'error', text: 'Lỗi kết nối server' });
                            } finally {
                              setIsSavingClient(false);
                            }
                          }}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSavingClient ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Đang lưu...</span>
                            </>
                          ) : (
                            <span>Lưu khách hàng</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delete Client Confirmation Modal */}
                {showDeleteClientConfirm && clientToDelete && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" style={{marginTop: "0px"}}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              Xóa khách hàng?
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                              Hành động này không thể hoàn tác.
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                          Bạn có chắc chắn muốn xóa khách hàng <span className="font-semibold text-slate-900 dark:text-white">"{clientToDelete.name}"</span> không?
                        </p>

                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            disabled={isDeletingClient}
                            onClick={() => setShowDeleteClientConfirm(false)}
                            className="px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                          >
                            Hủy bỏ
                          </button>
                          <button
                            type="button"
                            disabled={isDeletingClient}
                            onClick={async () => {
                              try {
                                setIsDeletingClient(true);
                                await api.delete(`/api/admin/clients/${clientToDelete.id}`);
                                setClients((prev) => prev.filter((item) => item.id !== clientToDelete.id));
                                setClientTotalElements((prev) => (prev > 0 ? prev - 1 : 0));
                                setShowDeleteClientConfirm(false);
                                setClientToDelete(null);
                                setToast({ type: 'success', text: 'Xóa khách hàng thành công' });
                              } catch (err) {
                                setToast({ type: 'error', text: 'Có lỗi kết nối khi xóa khách hàng' });
                                setShowDeleteClientConfirm(false);
                              } finally {
                                setIsDeletingClient(false);
                              }
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDeletingClient ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Đang xóa...</span>
                              </>
                            ) : (
                              <span>Xóa khách hàng</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'articles' && (
              <ArticlesManagement onToast={(msg: ToastMessage) => setToast(msg)} />
            )}

            {activeTab === 'google-reviews' && (
              <GoogleReviewsManagement />
            )}

            {activeTab === 'contacts' && (
              <ContactManagement onUnreadCountChange={fetchUnreadContactCount} />
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Cài đặt giao diện</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ngôn ngữ mặc định</label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSettingsLang('vi')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            settingsLang === 'vi'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          Tiếng Việt
                        </button>
                        <button
                          type="button"
                          onClick={() => setSettingsLang('en')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            settingsLang === 'en'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          English
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Chế độ hiển thị</label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsDarkMode(false)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            !isDarkMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          Light
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsDarkMode(true)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isDarkMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          Dark
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Độ giãn nội dung</label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setUiDensity('comfortable')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            uiDensity === 'comfortable'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          Thoải mái
                        </button>
                        <button
                          type="button"
                          onClick={() => setUiDensity('compact')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            uiDensity === 'compact'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          Gọn
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Chủ đề màu</label>
                      <select
                        value={primaryTheme}
                        onChange={(e) => setPrimaryTheme(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      >
                        <option value="blue">Xanh dương</option>
                        <option value="purple">Tím</option>
                        <option value="teal">Xanh ngọc</option>
                      </select>
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${primaryTheme === 'blue' ? 'bg-blue-600' : primaryTheme === 'purple' ? 'bg-purple-600' : 'bg-teal-600'}`}></div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Xem trước màu chủ đạo</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={saveSettings}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                    >
                      Lưu cài đặt
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <CategoryManagement />
            )}

            {activeTab === 'static-home' && (
              <div className="space-y-6">
                <HomeContentForm />
              </div>
            )}
            {activeTab === 'static-webdesign' && (
              <div className="space-y-6">
                <WebDesignContentForm />
              </div>
            )}
            {activeTab === 'static-seo-overall' && (
              <div className="space-y-6">
                <SeoOverallContentForm />
              </div>
            )}
            {activeTab === 'static-website-care' && (
              <div className="space-y-6">
                <WebsiteCareContentForm />
              </div>
            )}
            {activeTab === 'static-tiktok-ads' && (
              <div className="space-y-6">
                <TiktokAdsContentForm />
              </div>
            )}
            {activeTab === 'static-facebook-ads' && (
              <div className="space-y-6">
                <FacebookAdsContentForm />
              </div>
            )}
            {activeTab === 'static-google-ads' && (
              <div className="space-y-6">
                <GoogleAdsContentForm />
              </div>
            )}
          </div>
        </main>

        {settingsMessage && (
          <div className="fixed bottom-6 right-6 z-50">
            <div
              className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2 ${
                settingsMessage.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {settingsMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="text-sm font-medium">{settingsMessage.text}</span>
            </div>
          </div>
        )}

        {showBackToTop && (
          <button
            type="button"
            onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm font-semibold">Lên top</span>
          </button>
        )}
      </motion.div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </div>
  );
};

export default AdminDashboard;
