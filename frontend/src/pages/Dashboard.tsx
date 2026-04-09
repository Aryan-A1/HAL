import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/services/authApi';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import {
  Leaf,
  Droplets,
  Sprout,
  Activity,
  MapPin,
  Phone,
  Mail,
  LogOut,
  ArrowRight,
  Sun,
  CloudRain,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const logoutAction = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authApi.logout();
    logoutAction();
    navigate('/login');
  };

  const firstName = user?.full_name?.split(' ')[0] || 'Farmer';
  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'F';

  const locationParts = [user?.city, user?.state, user?.country].filter(Boolean);
  const location = locationParts.length > 0 ? locationParts.join(', ') : 'Location not set';

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'N/A';

  return (
    <div className="min-h-screen bg-[#F0F7F0]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8 space-y-8">

        {/* ── Profile Card ─────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-sm border border-green-100 overflow-hidden">
          {/* Green banner */}
          <div className="h-28 bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#388E3C] relative">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            {/* Avatar sits on the banner, anchored to bottom-left */}
            <div className="absolute bottom-0 left-6 translate-y-1/2">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-[#1B5E20] text-2xl font-bold">
                {initials}
              </div>
            </div>
          </div>

          {/* Content below banner */}
          <div className="px-6 pb-6 pt-14">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {user?.full_name || 'Farmer'}
                </h2>
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Smart Farmer
                </span>
              </div>

              <Link
                to="/crop-disease"
                className="inline-flex items-center gap-2 bg-[#1B5E20] hover:bg-[#2E7D32] text-white text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm self-start"
              >
                + Scan a Crop
              </Link>
            </div>

            {/* User meta info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {locationParts.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-green-600" />
                  {location}
                </span>
              )}
              {user?.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-green-600" />
                  {user.email}
                </span>
              )}
              {user?.phone_number && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-green-600" />
                  {user.phone_number}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-green-600" />
                Member since {memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats Row ────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Crops', value: '—', icon: Sprout, color: 'bg-green-50 text-green-700', border: 'border-green-200' },
            { label: 'Healthy Crops', value: '—', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200' },
            { label: 'Needs Attention', value: '—', icon: AlertTriangle, color: 'bg-amber-50 text-amber-700', border: 'border-amber-200' },
            { label: 'Scans Completed', value: '—', icon: TrendingUp, color: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
          ].map((stat) => (
            <div key={stat.label} className={`bg-white rounded-2xl border ${stat.border} p-4 shadow-sm flex items-center gap-3`}>
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Feature Cards ────────────────────────────────── */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* Crop Disease */}
            <Link to="/crop-disease" className="group bg-white rounded-2xl border border-green-100 shadow-sm p-5 hover:shadow-md hover:border-green-300 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-red-500" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1B5E20] group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Crop Disease Detection</h4>
              <p className="text-sm text-gray-500 mb-4">Upload a photo of your crop to detect diseases using AI instantly.</p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1B5E20] bg-green-50 px-2.5 py-1 rounded-full">
                <Activity className="w-3 h-3" /> AI Powered
              </span>
            </Link>

            {/* Irrigation */}
            <Link to="/crop-irrigation" className="group bg-white rounded-2xl border border-blue-100 shadow-sm p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-blue-500" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Irrigation Schedule</h4>
              <p className="text-sm text-gray-500 mb-4">Get smart irrigation recommendations based on weather and soil data.</p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                <Droplets className="w-3 h-3" /> Smart Scheduling
              </span>
            </Link>

            {/* Govt Schemes */}
            <Link to="/schemes" className="group bg-white rounded-2xl border border-purple-100 shadow-sm p-5 hover:shadow-md hover:border-purple-300 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-purple-500" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Govt Schemes</h4>
              <p className="text-sm text-gray-500 mb-4">Explore government farming schemes, subsidies, and financial support.</p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Official Data
              </span>
            </Link>
          </div>
        </div>

        {/* ── Bottom Row: Irrigation Status + Weather ──────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Irrigation Status */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold text-gray-900">Irrigation Status</h4>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Next Watering', value: 'Not scheduled', icon: Clock },
                { label: 'Last Watered', value: 'No data yet', icon: CheckCircle2 },
                { label: 'Water Source', value: 'Not configured', icon: Droplets },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <span className="flex items-center gap-2 text-gray-500">
                    <row.icon className="w-3.5 h-3.5" />
                    {row.label}
                  </span>
                  <span className="font-medium text-gray-700">{row.value}</span>
                </div>
              ))}
            </div>
            <Link to="/crop-irrigation" className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium py-2 rounded-xl transition-colors">
              Set Schedule <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Weather / Insights */}
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-5 h-5 text-amber-500" />
              <h4 className="font-semibold text-gray-900">Quick Insights</h4>
            </div>
            <div className="space-y-3">
              {[
                { icon: Sun, text: 'Check today\'s weather before irrigating', color: 'bg-amber-50 text-amber-600' },
                { icon: Leaf, text: 'Scan your crops weekly for early disease detection', color: 'bg-green-50 text-green-600' },
                { icon: CloudRain, text: 'Rain can reduce irrigation needs significantly', color: 'bg-blue-50 text-blue-600' },
                { icon: TrendingUp, text: 'Use crop data to improve per-season yields', color: 'bg-purple-50 text-purple-600' },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className={`w-7 h-7 rounded-lg ${tip.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <tip.icon className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-gray-600 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 py-2">
          HAL AI — Intelligent Agriculture Platform &nbsp;•&nbsp; Powered by AI
        </p>
      </div>
    </div>
  );
}
