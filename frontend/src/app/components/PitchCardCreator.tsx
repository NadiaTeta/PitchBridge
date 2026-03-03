import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Video, Info, CheckCircle2, ChevronDown } from 'lucide-react';
import { rwandanDistricts } from '../data/mockData';
import api from '../services/api';

export function PitchCardCreator() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    fundingGoal: '',
    roi: '',
    description: '',
    category: '',
  });
  const [videoUploaded, setVideoUploaded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      await api.post('/projects', {
        name: formData.projectName,
        location: formData.location,
        fundingGoal: parseInt(formData.fundingGoal),
        roi: formData.roi,
        description: formData.description,
        category: formData.category,
      });
    
      alert('Pitch submitted for review!');
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.error || 'Failed to create project');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      
      {/* Navigation Header - Tightened for mobile */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-6 md:pt-8 mb-6 md:mb-8 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2.5 md:p-3 bg-white hover:bg-slate-100 text-slate-900 shadow-sm rounded-xl md:rounded-2xl border border-slate-200 transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <div className="text-right">
           <h1 className="text-xl md:text-2xl font-black text-slate-900">New Pitch</h1>
           <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-wider">Step 1 of 1</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100">
          
          {/* Project Identity Section */}
          <section className="space-y-6">
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
              General Information
            </h2>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Project Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                placeholder="E.g., Smart Poultry Farm"
                className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-sm md:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Category
              </label>
              {/* Responsive Grid: 2 cols on mobile, 3 on desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Agriculture', icon: '🚜' },
                  { id: 'Tech', icon: '📱' },
                  { id: 'Retail', icon: '🛍️' },
                  { id: 'Service', icon: '🛠️' },
                  { id: 'Fashion', icon: '👕' }
                
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all flex flex-col items-center gap-1 md:gap-2 ${
                      formData.category === cat.id
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm'
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <span className="text-xl md:text-2xl">{cat.icon}</span>
                    <span className="text-[10px] font-bold uppercase">{cat.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Location (District)
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium appearance-none text-sm"
                required
              >
                <option value="">Select a district</option>
                {rwandanDistricts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 bottom-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </section>

          {/* Financials Section */}
          <section className="space-y-6 pt-6 border-t border-slate-50">
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
              Investment Details
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Funding Goal (RWF)
                </label>
                <input
                  type="number"
                  value={formData.fundingGoal}
                  onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
                  placeholder="15,000,000"
                  className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-blue-600"
                  required
                />
              </div>
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-blue-700">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-tight leading-normal">
                  Goal must include all setup and operational costs for 12 months.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                ROI Description
              </label>
              <textarea
                value={formData.roi}
                onChange={(e) => setFormData({ ...formData, roi: e.target.value })}
                placeholder="Expected returns and timeline..."
                rows={3}
                className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none font-medium text-sm"
                required
              />
            </div>
          </section>

          {/* Narrative & Media */}
          <section className="space-y-6 pt-6 border-t border-slate-50">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Pitch Story
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What problem are you solving?"
                rows={4}
                className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none font-medium text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Video Pitch (30-60s)
              </label>
              <div className={`relative border-2 border-dashed rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 text-center transition-all ${
                videoUploaded ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
              }`}>
                {!videoUploaded ? (
                  <button
                    type="button"
                    onClick={() => setVideoUploaded(true)}
                    className="flex flex-col items-center gap-3 w-full group"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center shadow-sm text-blue-600 group-active:scale-90 transition-transform">
                      <Video className="w-6 h-6 md:w-8" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm md:text-base">Record/Upload Video</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">Max 50MB</p>
                    </div>
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg text-white">
                      <CheckCircle2 className="w-6 h-6 md:w-8" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-700 text-sm">Video Ready!</p>
                      <button 
                        type="button" 
                        onClick={() => setVideoUploaded(false)}
                        className="text-[9px] font-black uppercase text-slate-400 hover:text-red-500 mt-2 p-2"
                      >
                        Change Video
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="w-full py-4 md:py-5 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-xl md:rounded-2xl transition-all shadow-xl active:scale-95 tracking-widest uppercase text-xs md:text-sm"
          >
            Launch Pitch Card
          </button>
        </form>
      </div>
    </div>
  );
}