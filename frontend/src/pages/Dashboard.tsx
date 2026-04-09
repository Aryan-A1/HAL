import { useState, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, MapPin, Phone, Mail, Camera, Leaf, Plus, Trash2,
  ChevronDown, Save, CheckCircle2, Sprout, FlaskConical,
  Droplets, ArrowRight, Calendar, Edit3,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SOIL_TYPES = [
  { value: 'alluvial',  label: 'जलोढ़ मिट्टी (Alluvial Soil)' },
  { value: 'black',     label: 'काली मिट्टी (Black Soil / Regur)' },
  { value: 'red_yellow',label: 'लाल और पीली मिट्टी (Red & Yellow Soil)' },
  { value: 'laterite',  label: 'लेटराइट मिट्टी (Laterite Soil)' },
  { value: 'desert',    label: 'शुष्क या मरुस्थलीय मिट्टी (Desert Soil)' },
  { value: 'peaty',     label: 'पीटमय और दलदली मिट्टी (Peaty & Marshy Soil)' },
  { value: 'forest',    label: 'वन या पर्वतीय मिट्टी (Forest & Mountain Soil)' },
];

const GROWTH_STAGES = ['Seedling', 'Vegetative', 'Flowering', 'Harvesting'];

const CROP_SUGGESTIONS = [
  'Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane',
  'Soybean', 'Potato', 'Tomato', 'Onion', 'Mustard',
  'Groundnut', 'Sunflower', 'Chickpea', 'Lentil', 'Bajra',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface CropEntry {
  id: string;
  name: string;
  plantingDate: string;
  growthStage: string;
}

interface ProfileData {
  photoUrl: string | null;
  phone: string;
  country: string;
  state: string;
  city: string;
  village: string;
  soilType: string;
  crops: CropEntry[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionCard = ({ icon: Icon, title, subtitle, children }: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
  >
    <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <h2 className="text-base font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const FieldInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${props.className || ''}`}
  />
);

const FieldSelect = ({ value, onChange, children }: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white pr-10"
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'F';

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'N/A';

  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData>({
    photoUrl: null,
    phone: user?.phone_number || '',
    country: user?.country || '',
    state: user?.state || '',
    city: user?.city || '',
    village: '',
    soilType: '',
    crops: [],
  });

  const [saved, setSaved] = useState(false);

  // ── helpers ──
  const update = (key: keyof ProfileData, value: any) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update('photoUrl', url);
  };

  const addCrop = () => {
    const newCrop: CropEntry = {
      id: crypto.randomUUID(),
      name: '',
      plantingDate: '',
      growthStage: 'Seedling',
    };
    update('crops', [...profile.crops, newCrop]);
  };

  const updateCrop = (id: string, key: keyof CropEntry, value: string) => {
    update('crops', profile.crops.map((c) => c.id === id ? { ...c, [key]: value } : c));
  };

  const removeCrop = (id: string) => {
    update('crops', profile.crops.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    if (!profile.phone && !user?.phone_number) {
      toast.error('Please enter your phone number.');
      return;
    }
    // TODO: POST to /api/profile when endpoint is ready
    setSaved(true);
    toast.success('Profile saved successfully! 🌱');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F0F7F0]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16 space-y-6">

        {/* ── Page header ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Profile</h1>
            <p className="text-sm text-gray-500 mt-0.5">Your farming information, all in one place</p>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Profile'}
          </button>
        </div>

        {/* ── Profile Display Card (read-only digest) ───────────────────── */}
        <div className="bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm">
          <div className="h-20 bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#388E3C] relative">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="absolute bottom-0 left-5 translate-y-1/2">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Profile" className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-primary text-xl font-black">
                  {initials}
                </div>
              )}
            </div>
          </div>
          <div className="px-5 pt-12 pb-4">
            <p className="font-bold text-gray-900 text-lg">{user?.full_name || 'Farmer'}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
              {user?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{user.email}</span>}
              {(profile.phone || user?.phone_number) && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{profile.phone || user?.phone_number}</span>}
              {(profile.city || profile.state) && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</span>}
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" />Member since {memberSince}</span>
            </div>
          </div>
        </div>

        {/* ── Quick feature links ────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Crop Disease', href: '/crop-disease', icon: Leaf, color: 'text-red-500 bg-red-50' },
            { label: 'Irrigation', href: '/crop-irrigation', icon: Droplets, color: 'text-blue-500 bg-blue-50' },
            { label: 'Govt Schemes', href: '/schemes', icon: Sprout, color: 'text-purple-500 bg-purple-50' },
          ].map((f) => (
            <Link key={f.href} to={f.href}
              className="group flex flex-col items-center gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm py-4 hover:shadow-md hover:border-primary/20 transition-all">
              <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center`}>
                <f.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{f.label}</span>
            </Link>
          ))}
        </div>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* SECTION 1 — Basic Farmer Details                               */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <SectionCard icon={User} title="Basic Details" subtitle="Your personal information">
          {/* Photo upload */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-primary/20" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-black border-4 border-primary/20">
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary/80 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">{user?.full_name || 'Farmer'}</p>
              <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
              <button onClick={() => fileRef.current?.click()}
                className="text-xs text-primary font-semibold mt-2 hover:underline flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> Upload Photo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Full Name</FieldLabel>
              <FieldInput value={user?.full_name || ''} disabled placeholder="Your full name" className="bg-gray-50 cursor-not-allowed" />
              <p className="text-[10px] text-gray-400 mt-1">Name is managed via account settings</p>
            </div>
            <div>
              <FieldLabel required>Phone Number</FieldLabel>
              <FieldInput
                type="tel"
                value={profile.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
        </SectionCard>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* SECTION 2 — Location Details                                   */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <SectionCard icon={MapPin} title="Location Details" subtitle="Used for weather and irrigation data">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Country</FieldLabel>
              <FieldInput value={profile.country} onChange={(e) => update('country', e.target.value)} placeholder="India" />
            </div>
            <div>
              <FieldLabel>State</FieldLabel>
              <FieldInput value={profile.state} onChange={(e) => update('state', e.target.value)} placeholder="Punjab" />
            </div>
            <div>
              <FieldLabel>City / District</FieldLabel>
              <FieldInput value={profile.city} onChange={(e) => update('city', e.target.value)} placeholder="Ludhiana" />
            </div>
            <div>
              <FieldLabel>Village <span className="text-gray-400 font-normal text-xs">(optional)</span></FieldLabel>
              <FieldInput value={profile.village} onChange={(e) => update('village', e.target.value)} placeholder="Village name" />
            </div>
          </div>
        </SectionCard>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* SECTION 3 — Farm Details (Soil Type only)                      */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <SectionCard icon={FlaskConical} title="Farm Details" subtitle="Soil information used for irrigation recommendations">
          <div>
            <FieldLabel>Soil Type / मिट्टी का प्रकार</FieldLabel>
            <FieldSelect value={profile.soilType} onChange={(v) => update('soilType', v)}>
              <option value="">— Select your soil type —</option>
              {SOIL_TYPES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </FieldSelect>
            {profile.soilType && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-primary font-semibold flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                {SOIL_TYPES.find((s) => s.value === profile.soilType)?.label}
              </motion.p>
            )}
          </div>
        </SectionCard>

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* SECTION 4 — Crop Management                                    */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <SectionCard icon={Sprout} title="Crop Management" subtitle="Add and manage the crops you're growing">

          <AnimatePresence>
            {profile.crops.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3">
                  <Sprout className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-sm font-semibold text-gray-500">No crops added yet</p>
                <p className="text-xs text-gray-400 mt-1">Add your crops to get irrigation and disease insights</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            <AnimatePresence>
              {profile.crops.map((crop, idx) => (
                <motion.div
                  key={crop.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  className="bg-gray-50 rounded-2xl border border-gray-200 p-4"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-primary uppercase tracking-wider">
                      🌾 Crop {idx + 1}
                    </span>
                    <button
                      onClick={() => removeCrop(crop.id)}
                      className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Crop name with datalist suggestions */}
                    <div className="sm:col-span-1">
                      <FieldLabel required>Crop Name</FieldLabel>
                      <input
                        list={`crops-${crop.id}`}
                        value={crop.name}
                        onChange={(e) => updateCrop(crop.id, 'name', e.target.value)}
                        placeholder="e.g. Wheat"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white"
                      />
                      <datalist id={`crops-${crop.id}`}>
                        {CROP_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
                      </datalist>
                    </div>

                    {/* Planting date */}
                    <div>
                      <FieldLabel>Planting Date</FieldLabel>
                      <div className="relative">
                        <FieldInput
                          type="date"
                          value={crop.plantingDate}
                          onChange={(e) => updateCrop(crop.id, 'plantingDate', e.target.value)}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Growth stage */}
                    <div>
                      <FieldLabel>Growth Stage</FieldLabel>
                      <FieldSelect
                        value={crop.growthStage}
                        onChange={(v) => updateCrop(crop.id, 'growthStage', v)}
                      >
                        {GROWTH_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </FieldSelect>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Add crop button */}
          <button
            onClick={addCrop}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-primary/30 text-primary text-sm font-bold hover:border-primary/60 hover:bg-primary/5 transition-all"
          >
            <Plus className="w-4 h-4" />
            + Add Crop
          </button>
        </SectionCard>

        {/* ── Save button (bottom) ───────────────────────────────────────── */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className={`w-full py-4 rounded-2xl text-sm font-black shadow-md transition-all flex items-center justify-center gap-2 ${
            saved ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saved ? 'Profile Saved! 🌱' : 'Save Profile'}
        </motion.button>

        <p className="text-center text-xs text-gray-400 pb-4">
          HAL AI — Intelligent Agriculture Platform &nbsp;•&nbsp; Powered by AI
        </p>
      </div>
    </div>
  );
}
