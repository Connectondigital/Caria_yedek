import React, { useMemo } from "react";
import {
  TrendingUp,
  Users,
  Handshake,
  Wallet,
  Award,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  Flame
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAdminStore } from "../state/adminStore";

// Error Boundary Placeholder (Simulation)
class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
          <h2 className="text-xl font-black text-red-600 uppercase tracking-tighter">Bir Hata Oluştu</h2>
          <p className="text-sm text-red-500 mt-2">Executive Dashboard yüklenirken beklenmedik bir hata meydana geldi.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const ExecutivePage = () => {
  const { theme } = useTheme();
  const { leadsInbox, salesLeads, clients } = useAdminStore();

  // Dynamic Stats calculation
  const statsData = useMemo(() => {
    // Total Revenue from clients (simulated sum of budgets for 'Sold' stage or just sum of all)
    const totalRevenue = clients.reduce((sum, c) => sum + (c.currency === 'GBP' ? c.budget * 40 : c.budget), 0);
    const monthlyIncome = totalRevenue / 12; // Just a mock calculation

    const activeLeadsCount = leadsInbox.filter(l => l.status === 'new').length +
      salesLeads.filter(l => l.status !== 'closed' && l.status !== 'lost').length;

    const closedSalesCount = salesLeads.filter(l => l.status === 'closed').length;

    return [
      { label: "TOPLAM PORTFÖY DEĞERİ", value: `₺${(totalRevenue / 1000000).toFixed(1)}M`, icon: Wallet, trend: "+12%", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
      { label: "POTANSİYEL GELİR", value: `₺${(monthlyIncome / 1000000).toFixed(1)}M`, icon: TrendingUp, trend: "+21%", color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
      { label: "AKTİF LEAD & FIRSAT", value: activeLeadsCount.toString(), icon: Users, trend: "+8", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
      { label: "KAPANAN SATIŞ", value: closedSalesCount.toString(), icon: Handshake, trend: "+4", color: "text-[#3BB2B8]", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
      { label: "EN İYİ DANIŞMAN", value: "Buse A.", icon: Award, trend: "MVP", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    ];
  }, [leadsInbox, salesLeads, clients]);

  const funnelStages = useMemo(() => {
    const totalLeads = leadsInbox.length + salesLeads.length;
    const firstContact = salesLeads.filter(l => l.status === 'first_contact').length;
    const interested = salesLeads.filter(l => l.status === 'interested').length;
    const negotiation = salesLeads.filter(l => l.status === 'negotiation').length;
    const closed = salesLeads.filter(l => l.status === 'closed').length;

    const getPct = (count) => totalLeads > 0 ? `${(count / totalLeads * 100).toFixed(0)}%` : '0%';

    return [
      { label: "Lead (Ads + CRM)", count: totalLeads, pct: "100%", color: "bg-slate-200 dark:bg-slate-800" },
      { label: "İlk Görüşme", count: firstContact, pct: getPct(totalLeads - 10), color: "bg-blue-200 dark:bg-blue-900/40" },
      { label: "Teklif & İndirim", count: negotiation, pct: getPct(totalLeads - 20), color: "bg-cyan-200 dark:bg-cyan-900/40" },
      { label: "Pazarlık", count: 8, pct: "12%", color: "bg-orange-200 dark:bg-orange-900/40" },
      { label: "Satış", count: closed, pct: getPct(closed * 10), color: "bg-[#3BB2B8] shadow-lg shadow-cyan-500/20", highlight: true },
    ];
  }, [leadsInbox, salesLeads]);

  const advisors = [
    { name: "Buse Aydın", sales: salesLeads.filter(l => l.consultant === 'Buse Aydın' && l.status === 'closed').length + 4, revenue: "₺12.4M", conv: "38%", avatar: "BA" },
    { name: "Can Korkmaz", sales: salesLeads.filter(l => l.consultant === 'Can Korkmaz' && l.status === 'closed').length + 3, revenue: "₺9.1M", conv: "31%", avatar: "CK" },
    { name: "Ece Temel", sales: salesLeads.filter(l => l.consultant === 'Ece Temel' && l.status === 'closed').length + 2, revenue: "₺6.8M", conv: "24%", avatar: "ET" },
  ];


  return (
    <DashboardErrorBoundary>
      <div className="flex flex-col w-full min-h-full bg-white dark:bg-slate-950 font-sans scroll-smooth">
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-[#3BB2B8]/10 rounded-2xl flex items-center justify-center text-[#3BB2B8]">
                  <BarChart3 size={24} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic translate-y-0.5">
                  Executive Overview
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.3em] ml-1">
                YÖNETİCİ PANELİ • PERFORMANS • GELİR • STRATEJİ
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                Sistem Aktif
              </span>
            </div>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statsData.map((s, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 group hover:border-[#3BB2B8]/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center ${s.color}`}>
                  <s.icon size={24} />
                </div>
                <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${s.trend.startsWith('+') ? 'text-green-500 bg-green-500/10' : 'text-purple-500 bg-purple-500/10'}`}>
                  {s.trend}
                </div>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</div>
              <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">{s.value}</div>
            </div>
          ))}
        </div>


        {/* Main Content Grid */}
        <div className="px-8 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Sales Funnel */}
          <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Flame size={16} className="text-orange-500" /> Satış Hunisi (Pipeline)
              </h3>
              <button className="text-[10px] font-black text-[#3BB2B8] uppercase tracking-widest hover:underline">Detaylı Rapor</button>
            </div>

            <div className="space-y-4">
              {funnelStages.map((stage, idx) => (
                <div key={idx} className="relative group">
                  <div
                    className={`h-12 ${stage.color} rounded-2xl transition-all duration-500 group-hover:scale-[1.01] flex items-center justify-between px-6`}
                    style={{ width: stage.pct }}
                  >
                    <span className={`text-[11px] font-black uppercase tracking-wider ${stage.highlight ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                      {stage.label}
                    </span>
                    <span className={`text-xs font-black ${stage.highlight ? 'text-white' : 'text-slate-400'}`}>
                      {stage.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Executive Summary Card */}
          <div className="lg:col-span-4 bg-slate-900 dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3BB2B8]/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#3BB2B8] rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">AI Executive Summary</h3>
              </div>

              <div className="space-y-4 flex-1">
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  Bu ay gelir <span className="text-[#3BB2B8] font-black">%21 arttı.</span><br />
                  VIP müşteri dönüşü güçlü seyrediyor.<br />
                  Teklif → Satış oranı geçen aya göre düşüşte.<br />
                </p>
                <div className="pt-4 border-t border-slate-800">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">STRATEJİK ÖNERİ</div>
                  <p className="text-xs text-slate-400 italic">
                    "Follow-up otomasyonu artırılmalı ve sıcak lead'ler için özel kampanya kurgulanmalı."
                  </p>
                </div>
              </div>

              <button className="mt-8 w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Analiz Raporu Oluştur
              </button>
            </div>
          </div>

          {/* Revenue Trend Placeholder */}
          <div className="lg:col-span-12 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 h-80 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Gelir Trendi (Son 6 Ay)</h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3BB2B8]"></div>
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              </div>
            </div>
            <div className="flex-1 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center relative bg-white/30 dark:bg-transparent backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#3BB2B8]/5 to-transparent"></div>
              <div className="text-xs font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] italic z-10 flex items-center gap-3">
                <ArrowUpRight size={24} className="text-[#3BB2B8] animate-pulse" />
                Grafik (Mock) — Son 6 Ay
              </div>
            </div>
          </div>

          {/* Advisor Performance Table */}
          <div className="lg:col-span-12 bg-white dark:bg-slate-900/20 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Danışman Performansı</h3>
              <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#3BB2B8] transition-colors">
                Tümünü Gör <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-50 dark:border-slate-800">
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Danışman</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Satış Adedi</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Toplam Ciro</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Dönüşüm Oranı</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {advisors.map((adv, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#3BB2B8]/10 text-[#3BB2B8] flex items-center justify-center font-black text-xs">
                            {adv.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{adv.name}</div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sertifikalı Danışman</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-sm font-black text-slate-700 dark:text-slate-300">{adv.sales}</div>
                      </td>
                      <td className="px-8 py-5 uppercase">
                        <div className="text-sm font-black text-[#3BB2B8] tracking-tighter">{adv.revenue}</div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#3BB2B8] h-full" style={{ width: adv.conv }}></div>
                          </div>
                          <span className="text-xs font-black text-slate-400 tracking-tighter">{adv.conv}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="inline-flex items-center gap-1 text-green-500 font-black text-[10px]">
                          <TrendingUp size={12} /> +4%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardErrorBoundary>
  );
};

export default ExecutivePage;
