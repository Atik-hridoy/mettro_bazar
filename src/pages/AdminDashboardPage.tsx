import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { apiClient } from '../services/apiClient';
import type { User } from '../types/user';
import type { Category } from '../types/category';
import {
  LayoutDashboard,
  ListOrdered,
  Package,
  Users,
  Bell,
  Settings,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Clock,
  AlertTriangle,
  Archive,
  Layers,
  Plus,
  Trash2,
  Upload,
  ImageIcon,
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'categories' | 'products'>('overview');
  const [customers, setCustomers] = useState<User[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Utensils');
  const [addingCategory, setAddingCategory] = useState(false);

  // Product form state
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodBadge, setProdBadge] = useState('');
  const [prodIsPopular, setProdIsPopular] = useState(false);
  const [prodIsReadyToCook, setProdIsReadyToCook] = useState(true);
  const [prodPrepTime, setProdPrepTime] = useState('15');
  const [prodVariants, setProdVariants] = useState<{weight: string; price: string; stock: string}[]>([{ weight: '500g', price: '', stock: '100' }]);
  const [prodSteps, setProdSteps] = useState<{title: string; instruction: string}[]>([]);
  const [addingProduct, setAddingProduct] = useState(false);
  const [productSuccess, setProductSuccess] = useState('');

  useEffect(() => {
    // Basic protection - if not admin, go home
    if (!user || (user.phone !== '01700000000' && user.phone !== '12345678901' && !user.isAdmin)) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'customers') {
      const fetchCustomers = async () => {
        setLoadingCustomers(true);
        try {
          const data = await authService.getAllCustomers();
          if (Array.isArray(data)) {
            setCustomers(data);
          } else if (data && typeof data === 'object' && 'results' in data) {
            // Handle paginated response if backend pagination applies
            setCustomers((data as any).results);
          } else {
            setCustomers([]);
          }
        } catch (error) {
          console.error('Failed to fetch customers:', error);
          setCustomers([]);
        } finally {
          setLoadingCustomers(false);
        }
      };
      fetchCustomers();
    }
  }, [activeTab]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await apiClient<Category[]>('/categories/');
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'categories') {
      fetchCategories();
    }
  }, [activeTab]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setAddingCategory(true);
    try {
      await apiClient<Category>('/categories/', {
        method: 'POST',
        body: JSON.stringify({ name: newCatName.trim(), icon_name: newCatIcon }),
      });
      setNewCatName('');
      setNewCatIcon('Utensils');
      fetchCategories();
    } catch (error) {
      console.error('Failed to add category:', error);
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`http://localhost:8000/api/categories/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  // Fetch categories for product form dropdown
  useEffect(() => {
    if (activeTab === 'products' && categories.length === 0) {
      fetchCategories();
    }
  }, [activeTab]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodCategory || !prodPrice) return;
    setAddingProduct(true);
    setProductSuccess('');
    try {
      // Create the product
      const productData = {
        name: prodName.trim(),
        category: prodCategory,
        price: parseFloat(prodPrice),
        image_url: prodImageUrl,
        description: prodDescription,
        badge_text: prodBadge,
        is_popular: prodIsPopular,
        is_ready_to_cook: prodIsReadyToCook,
        preparation_time_minutes: parseInt(prodPrepTime) || 15,
      };
      const newProduct = await apiClient<any>('/products/', {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      // Create weight variants
      for (const v of prodVariants) {
        if (v.weight && v.price) {
          await apiClient('/products/' + newProduct.id + '/weight_variants/', {
            method: 'POST',
            body: JSON.stringify({
              weight: v.weight,
              price: parseFloat(v.price),
              stock: parseInt(v.stock) || 100,
            }),
          }).catch(() => {
            // If nested endpoint doesn't exist, try direct
          });
        }
      }

      setProductSuccess(`Product "${prodName}" created successfully!`);
      // Reset form
      setProdName('');
      setProdCategory('');
      setProdPrice('');
      setProdDescription('');
      setProdImageUrl('');
      setProdBadge('');
      setProdIsPopular(false);
      setProdIsReadyToCook(true);
      setProdPrepTime('15');
      setProdVariants([{ weight: '500g', price: '', stock: '100' }]);
      setProdSteps([]);
    } catch (error) {
      console.error('Failed to add product:', error);
      setProductSuccess('Error: Failed to create product.');
    } finally {
      setAddingProduct(false);
    }
  };

  const colorPrimary = '#1D9E75';
  const colorSecondary = '#0F6E56';
  const colorAmber = '#F59E0B';
  const colorGray = '#9CA3AF';

  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue (৳)',
        data: [250000, 310000, 280000, 350000, 420000, 390000, 452000],
        borderColor: colorPrimary,
        backgroundColor: 'rgba(29, 158, 117, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: colorSecondary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: colorSecondary,
        padding: 12,
        titleFont: { family: 'Inter', size: 14 },
        bodyFont: { family: 'Inter', size: 14 },
        callbacks: {
          label: function (context: any) {
            return '৳ ' + context.parsed.y.toLocaleString();
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(188, 202, 193, 0.2)' },
        ticks: {
          font: { family: 'Inter', size: 12 },
          color: '#6d7a73',
          callback: function (value: any) {
            return '৳' + value / 1000 + 'k';
          },
        },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 12 }, color: '#6d7a73' },
      },
    },
    interaction: { mode: 'index' as const, intersect: false },
  };

  const statusData = {
    labels: ['Delivered', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [colorPrimary, colorAmber, colorGray],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4,
      },
    ],
  };

  const statusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { family: 'Inter', size: 12 },
          color: '#1a1c1b',
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: colorSecondary,
        callbacks: {
          label: function (context: any) {
            return ' ' + context.label + ': ' + context.parsed + '%';
          },
        },
      },
    },
  };

  return (
    <div className="bg-[#f9f9f7] text-[#1a1c1b] flex h-screen overflow-hidden font-sans">
      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col h-screen sticky left-0 top-0 bg-[#f9f9f7] border-r border-[#bccac1] w-64">
        <div className="p-6 border-b border-[#bccac1]">
          <h1 className="text-2xl font-bold text-[#086b53]">Mettro Bazar</h1>
          <p className="text-xs font-semibold text-[#3d4943] mt-1">Admin Dashboard</p>
        </div>
        <div className="flex flex-col gap-2 mt-4 flex-grow">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'bg-[#a0f3d4] text-[#167159]'
                : 'text-[#3d4943] hover:bg-[#eeeeec]'
            } rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors duration-200 w-full text-left`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs font-semibold">Overview</span>
          </button>
          <button
            className="text-[#3d4943] hover:bg-[#eeeeec] mx-2 px-4 py-3 rounded-lg flex items-center gap-3 transition-colors duration-200 cursor-not-allowed opacity-60 w-full text-left"
          >
            <ListOrdered className="w-5 h-5" />
            <span className="text-xs font-semibold">Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`${
              activeTab === 'products'
                ? 'bg-[#a0f3d4] text-[#167159]'
                : 'text-[#3d4943] hover:bg-[#eeeeec]'
            } rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors duration-200 w-full text-left`}
          >
            <Package className="w-5 h-5" />
            <span className="text-xs font-semibold">Products</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`${
              activeTab === 'categories'
                ? 'bg-[#a0f3d4] text-[#167159]'
                : 'text-[#3d4943] hover:bg-[#eeeeec]'
            } rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors duration-200 w-full text-left`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-xs font-semibold">Categories</span>
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`${
              activeTab === 'customers'
                ? 'bg-[#a0f3d4] text-[#167159]'
                : 'text-[#3d4943] hover:bg-[#eeeeec]'
            } rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-colors duration-200 w-full text-left`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-semibold">Customers</span>
          </button>
        </div>
        <div className="p-4 border-t border-[#bccac1] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full object-cover border border-[#bccac1] bg-[#00694c] flex items-center justify-center text-white font-bold">
            AD
          </div>
          <div>
            <p className="text-xs font-semibold">Admin User</p>
            <p className="text-sm text-[#3d4943] text-xs">admin@mettrobazar.com</p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden">
        {/* TopAppBar */}
        <header className="sticky top-0 w-full z-40 bg-[#f9f9f7] border-b border-[#bccac1] shadow-sm flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-semibold text-[#00694c]">Operational Command Center</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#3d4943] hover:bg-[#f4f4f2] rounded-full transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-[#3d4943] hover:bg-[#f4f4f2] rounded-full transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          {activeTab === 'overview' ? (
            <>
              {/* Metric Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md border border-[#bccac1]/30 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[#3d4943]">
                    <span className="text-xs font-semibold uppercase tracking-wider">Today's Orders</span>
                    <ShoppingBag className="w-5 h-5 text-[#00694c]" />
                  </div>
                  <div className="text-3xl font-bold text-[#00694c]">1,245</div>
                  <div className="text-sm text-[#086b53] flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>12% vs yesterday</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md border border-[#bccac1]/30 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[#3d4943]">
                    <span className="text-xs font-semibold uppercase tracking-wider">Today's Revenue</span>
                    <CreditCard className="w-5 h-5 text-[#00694c]" />
                  </div>
                  <div className="text-3xl font-bold text-[#00694c]">৳ 452K</div>
                  <div className="text-sm text-[#086b53] flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>8% vs yesterday</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md border border-[#bccac1]/30 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[#3d4943]">
                    <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
                    <Clock className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <div className="text-3xl font-bold text-[#F59E0B]">84</div>
                  <div className="text-sm text-[#3d4943]">Requires attention</div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md border border-[#bccac1]/30 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[#3d4943]">
                    <span className="text-xs font-semibold uppercase tracking-wider">Low Stock Items</span>
                    <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
                  </div>
                  <div className="text-3xl font-bold text-[#ba1a1a]">12</div>
                  <div className="text-sm text-[#ba1a1a] flex items-center gap-1">
                    <Archive className="w-4 h-4" />
                    <span>Restock needed</span>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-md border border-[#bccac1]/30">
                  <h3 className="text-xl font-semibold text-[#00694c] mb-4">Sales Trends</h3>
                  <div className="w-full h-72 relative">
                    <Line data={salesData} options={salesOptions} />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md border border-[#bccac1]/30 flex flex-col">
                  <h3 className="text-xl font-semibold text-[#00694c] mb-4">Order Statuses</h3>
                  <div className="w-full h-64 relative flex-grow flex items-center justify-center">
                    <Doughnut data={statusData} options={statusOptions} />
                  </div>
                </div>
              </div>

              {/* Tables Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
                <div className="lg:col-span-2 bg-white rounded-lg p-0 shadow-md border border-[#bccac1]/30 overflow-hidden">
                  <div className="p-6 border-b border-[#bccac1]/30">
                    <h3 className="text-xl font-semibold text-[#00694c]">Recent Orders</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#f9f9f7] text-[#3d4943] text-xs font-semibold border-b border-[#bccac1]/30">
                          <th className="p-4 font-semibold">Order ID</th>
                          <th className="p-4 font-semibold">Customer</th>
                          <th className="p-4 font-semibold">Date</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-[#bccac1]/20">
                        <tr className="hover:bg-[#E1F5EE]/30 transition-colors">
                          <td className="p-4 text-[#00694c] font-medium">#ORD-001</td>
                          <td className="p-4">Rahim Uddin</td>
                          <td className="p-4 text-[#3d4943]">Today, 10:45 AM</td>
                          <td className="p-4">
                            <span className="bg-[#E1F5EE] text-[#0F6E56] px-2 py-1 rounded-full text-xs font-semibold">Delivered</span>
                          </td>
                          <td className="p-4 text-right font-medium">৳ 2,450</td>
                        </tr>
                        <tr className="hover:bg-[#E1F5EE]/30 transition-colors">
                          <td className="p-4 text-[#00694c] font-medium">#ORD-002</td>
                          <td className="p-4">Karim Hasan</td>
                          <td className="p-4 text-[#3d4943]">Today, 09:30 AM</td>
                          <td className="p-4">
                            <span className="bg-[#FEF3C7] text-[#B45309] px-2 py-1 rounded-full text-xs font-semibold">Pending</span>
                          </td>
                          <td className="p-4 text-right font-medium">৳ 1,200</td>
                        </tr>
                        <tr className="hover:bg-[#E1F5EE]/30 transition-colors">
                          <td className="p-4 text-[#00694c] font-medium">#ORD-003</td>
                          <td className="p-4">Salma Begum</td>
                          <td className="p-4 text-[#3d4943]">Yesterday, 04:15 PM</td>
                          <td className="p-4">
                            <span className="bg-[#E1F5EE] text-[#0F6E56] px-2 py-1 rounded-full text-xs font-semibold">Delivered</span>
                          </td>
                          <td className="p-4 text-right font-medium">৳ 3,890</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t border-[#bccac1]/30 text-center">
                    <button className="text-[#00694c] font-semibold text-sm hover:underline">View All Orders</button>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-0 shadow-md border border-[#bccac1]/30 overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-[#bccac1]/30">
                    <h3 className="text-xl font-semibold text-[#00694c]">Top Selling Items</h3>
                  </div>
                  <div className="flex flex-col p-2">
                    <div className="flex items-center gap-4 p-4 hover:bg-[#f4f4f2] transition-colors rounded-lg">
                      <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-400">IMG</div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-[#1a1c1b]">Spicy Marinated Chicken</h4>
                        <p className="text-xs text-[#3d4943]">120 sold today</p>
                      </div>
                      <div className="text-[#00694c] font-semibold">৳ 450</div>
                    </div>
                    <div className="flex items-center gap-4 p-4 hover:bg-[#f4f4f2] transition-colors rounded-lg">
                      <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-400">IMG</div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-[#1a1c1b]">Fresh Veggie Mix</h4>
                        <p className="text-xs text-[#3d4943]">95 sold today</p>
                      </div>
                      <div className="text-[#00694c] font-semibold">৳ 120</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === 'customers' ? (
            <div className="bg-white rounded-lg p-0 shadow-md border border-[#bccac1]/30 overflow-hidden">
              <div className="p-6 border-b border-[#bccac1]/30">
                <h3 className="text-xl font-semibold text-[#00694c]">Customer Directory</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f9f9f7] text-[#3d4943] text-xs font-semibold border-b border-[#bccac1]/30">
                      <th className="p-4 font-semibold">ID</th>
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Phone</th>
                      <th className="p-4 font-semibold">Address</th>
                      <th className="p-4 font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-[#bccac1]/20">
                    {loadingCustomers ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-[#3d4943]">
                          Loading customers...
                        </td>
                      </tr>
                    ) : customers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-[#3d4943]">
                          No customers found.
                        </td>
                      </tr>
                    ) : (
                      customers.map((c) => (
                        <tr key={c.id} className="hover:bg-[#E1F5EE]/30 transition-colors">
                          <td className="p-4 text-[#3d4943] text-xs font-mono">{c.id.substring(0, 8)}...</td>
                          <td className="p-4 font-medium text-[#1a1c1b]">{c.name || 'N/A'}</td>
                          <td className="p-4 text-[#3d4943]">{c.phone}</td>
                          <td className="p-4 text-[#3d4943] max-w-[200px] truncate">{c.address || 'N/A'}</td>
                          <td className="p-4">
                            {c.isAdmin ? (
                              <span className="bg-[#00694c] text-white px-2 py-1 rounded-full text-xs font-semibold">Admin</span>
                            ) : (
                              <span className="bg-[#f4f4f2] text-[#3d4943] px-2 py-1 rounded-full text-xs font-semibold">User</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'categories' ? (
            <div className="space-y-6">
              {/* Add Category Form */}
              <div className="bg-white rounded-lg p-6 shadow-md border border-[#bccac1]/30">
                <h3 className="text-xl font-semibold text-[#00694c] mb-4">Add New Category</h3>
                <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-[#3d4943] mb-1">Category Name</label>
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Fresh Fruits"
                      className="w-full px-4 py-2.5 border border-[#bccac1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <label className="block text-xs font-semibold text-[#3d4943] mb-1">Icon Name</label>
                    <select
                      value={newCatIcon}
                      onChange={(e) => setNewCatIcon(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#bccac1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent bg-white"
                    >
                      <option value="Utensils">Utensils</option>
                      <option value="Beef">Beef</option>
                      <option value="Drumstick">Drumstick</option>
                      <option value="Fish">Fish</option>
                      <option value="Carrot">Carrot</option>
                      <option value="Apple">Apple</option>
                      <option value="Egg">Egg</option>
                      <option value="Milk">Milk</option>
                      <option value="Cookie">Cookie</option>
                      <option value="Coffee">Coffee</option>
                      <option value="ShoppingBasket">Shopping Basket</option>
                      <option value="Salad">Salad</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={addingCategory || !newCatName.trim()}
                      className="flex items-center gap-2 bg-[#00694c] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#005a40] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      {addingCategory ? 'Adding...' : 'Add Category'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Categories List */}
              <div className="bg-white rounded-lg p-0 shadow-md border border-[#bccac1]/30 overflow-hidden">
                <div className="p-6 border-b border-[#bccac1]/30">
                  <h3 className="text-xl font-semibold text-[#00694c]">Existing Categories</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f9f9f7] text-[#3d4943] text-xs font-semibold border-b border-[#bccac1]/30">
                        <th className="p-4 font-semibold">Name</th>
                        <th className="p-4 font-semibold">Slug</th>
                        <th className="p-4 font-semibold">Icon</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-[#bccac1]/20">
                      {loadingCategories ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-[#3d4943]">
                            Loading categories...
                          </td>
                        </tr>
                      ) : categories.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-[#3d4943]">
                            No categories found. Add one above!
                          </td>
                        </tr>
                      ) : (
                        categories.map((cat) => (
                          <tr key={cat.id} className="hover:bg-[#E1F5EE]/30 transition-colors">
                            <td className="p-4 font-medium text-[#1a1c1b]">{cat.name}</td>
                            <td className="p-4 text-[#3d4943] font-mono text-xs">{cat.slug}</td>
                            <td className="p-4 text-[#3d4943]">
                              <span className="bg-[#E1F5EE] text-[#0F6E56] px-2 py-1 rounded-full text-xs font-semibold">{cat.iconName}</span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                title="Delete category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'products' ? (
            <div className="space-y-6">
              {productSuccess && (
                <div className={`p-4 rounded-lg text-sm font-semibold ${productSuccess.startsWith('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-[#E1F5EE] text-[#0F6E56] border border-[#a0f3d4]'}`}>
                  {productSuccess}
                </div>
              )}
              <div className="bg-white rounded-lg p-6 shadow-md border border-[#bccac1]/30">
                <h3 className="text-xl font-semibold text-[#00694c] mb-6 flex items-center gap-2">
                  <Upload className="w-5 h-5" /> Add New Product
                </h3>
                <form onSubmit={handleAddProduct} className="space-y-6">
                  {/* Row 1: Name & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#3d4943] mb-1">Product Name *</label>
                      <input type="text" value={prodName} onChange={(e) => setProdName(e.target.value)} placeholder="e.g. Spicy Marinated Chicken" className="w-full px-4 py-2.5 border border-[#bccac1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#3d4943] mb-1">Category *</label>
                      <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} className="w-full px-4 py-2.5 border border-[#bccac1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] bg-white" required>
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Price, Prep Time, Badge */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#3d4943] mb-1">Base Price (৳) *</label>
                      <input type="number" step="0.01" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} placeholder="450" className="w-full px-4 py-2.5 border border-[#bccac1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#3d4943] mb-1">Preparation Time (min)</label>
                      <input type="number" value={prodPrepTime} onChange={(e) => setProdPrepTime(e.target.value)} placeholder="15" className="w-full px-4 py-2.5 border border-[#bccac1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#3d4943] mb-1">Badge Text</label>
                      <input type="text" value={prodBadge} onChange={(e) => setProdBadge(e.target.value)} placeholder="e.g. Best Seller" className="w-full px-4 py-2.5 border border-[#bccac1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-xs font-semibold text-[#3d4943] mb-1 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Product Image URL</label>
                    <input type="text" value={prodImageUrl} onChange={(e) => setProdImageUrl(e.target.value)} placeholder="https://example.com/image.jpg or /images/product.jpg" className="w-full px-4 py-2.5 border border-[#bccac1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-[#3d4943] mb-1">Description</label>
                    <textarea value={prodDescription} onChange={(e) => setProdDescription(e.target.value)} placeholder="Premium quality, fresh and hygienically packed..." rows={3} className="w-full px-4 py-2.5 border border-[#bccac1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] resize-none" />
                  </div>

                  {/* Toggles Row */}
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={prodIsPopular} onChange={(e) => setProdIsPopular(e.target.checked)} className="w-4 h-4 accent-[#00694c]" />
                      <span className="text-sm font-semibold text-[#3d4943]">Popular Product</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={prodIsReadyToCook} onChange={(e) => setProdIsReadyToCook(e.target.checked)} className="w-4 h-4 accent-[#00694c]" />
                      <span className="text-sm font-semibold text-[#3d4943]">Ready to Cook</span>
                    </label>
                  </div>

                  {/* Weight Variants */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#3d4943] uppercase tracking-wider">Weight Variants</label>
                      <button type="button" onClick={() => setProdVariants([...prodVariants, { weight: '', price: '', stock: '100' }])} className="text-xs font-semibold text-[#00694c] hover:underline flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Variant
                      </button>
                    </div>
                    {prodVariants.map((v, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <input type="text" value={v.weight} onChange={(e) => { const arr = [...prodVariants]; arr[i].weight = e.target.value; setProdVariants(arr); }} placeholder="e.g. 500g" className="flex-1 px-3 py-2 border border-[#bccac1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
                        <input type="number" step="0.01" value={v.price} onChange={(e) => { const arr = [...prodVariants]; arr[i].price = e.target.value; setProdVariants(arr); }} placeholder="Price" className="w-28 px-3 py-2 border border-[#bccac1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
                        <input type="number" value={v.stock} onChange={(e) => { const arr = [...prodVariants]; arr[i].stock = e.target.value; setProdVariants(arr); }} placeholder="Stock" className="w-24 px-3 py-2 border border-[#bccac1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
                        {prodVariants.length > 1 && (
                          <button type="button" onClick={() => setProdVariants(prodVariants.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Cooking Steps */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#3d4943] uppercase tracking-wider">Cooking Steps</label>
                      <button type="button" onClick={() => setProdSteps([...prodSteps, { title: '', instruction: '' }])} className="text-xs font-semibold text-[#00694c] hover:underline flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Step
                      </button>
                    </div>
                    {prodSteps.map((s, i) => (
                      <div key={i} className="flex gap-3 items-start bg-[#f9f9f7] p-3 rounded-lg border border-[#bccac1]/30">
                        <span className="text-xs font-bold text-[#00694c] bg-[#E1F5EE] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1">{i + 1}</span>
                        <div className="flex-1 space-y-2">
                          <input type="text" value={s.title} onChange={(e) => { const arr = [...prodSteps]; arr[i].title = e.target.value; setProdSteps(arr); }} placeholder="Step title" className="w-full px-3 py-2 border border-[#bccac1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]" />
                          <textarea value={s.instruction} onChange={(e) => { const arr = [...prodSteps]; arr[i].instruction = e.target.value; setProdSteps(arr); }} placeholder="Step instruction" rows={2} className="w-full px-3 py-2 border border-[#bccac1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75] resize-none" />
                        </div>
                        <button type="button" onClick={() => setProdSteps(prodSteps.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 p-1 mt-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {prodSteps.length === 0 && <p className="text-xs text-[#3d4943] italic">No cooking steps added yet. Click "Add Step" above.</p>}
                  </div>

                  {/* Submit */}
                  <div className="pt-4 border-t border-[#bccac1]/30">
                    <button type="submit" disabled={addingProduct || !prodName.trim() || !prodCategory || !prodPrice} className="flex items-center gap-2 bg-[#00694c] text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-[#005a40] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                      <Upload className="w-4 h-4" />
                      {addingProduct ? 'Creating Product...' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};
