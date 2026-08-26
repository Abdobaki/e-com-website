import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar 
} from 'lucide-react';


import { useLanguageStore } from '../lib/i18n';
import { useAppStore } from '../store/useAppStore';
import type { Order } from '../types';

export const ProfitChart: React.FC = () => {
  const { language } = useLanguageStore();
  const { orders, products, settings } = useAppStore();


  // Range State: 'today' | '7days' | '30days' | 'custom'
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | 'custom'>('7days');
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const currencySymbol = language === 'ar' ? settings.currency_ar || 'د.ج' : settings.currency || 'DA';
  const formatPrice = (num: number) => num.toLocaleString('fr-DZ');

  // Product cost map for exact cost calculation
  const productCostMap = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      map[p.id] = p.cost_price || Math.round(p.price * 0.75); // fallback estimate if not set
    });
    return map;
  }, [products]);

  // Compute profit for an individual order
  const calculateOrderFinancials = (order: Order) => {
    let orderRevenue = order.subtotal || order.total || 0;
    let orderCost = 0;

    const items = order?.items || (order as any)?.order_items || [];
    if (items.length > 0) {
      orderRevenue = 0;
      items.forEach((item: any) => {
        const itemPrice = Number(item.product_price || 0);
        const itemCost = Number(item.product_cost_price || productCostMap[item.product_id] || (itemPrice * 0.75));
        const qty = Number(item.quantity || 1);
        orderRevenue += itemPrice * qty;
        orderCost += itemCost * qty;
      });
    } else {
      orderCost = Math.round(orderRevenue * 0.75);
    }

    const orderProfit = orderRevenue - orderCost;
    return { orderRevenue, orderCost, orderProfit };
  };

  // Today's Profit Calculation
  const todayStats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(
      (o) => o.status !== 'cancelled' && o.created_at.startsWith(todayStr)
    );

    let revenue = 0;
    let cost = 0;
    todayOrders.forEach((order) => {
      const { orderRevenue, orderCost } = calculateOrderFinancials(order);
      revenue += orderRevenue;
      cost += orderCost;
    });

    const profit = revenue - cost;
    const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

    return {
      revenue,
      cost,
      profit,
      margin,
      ordersCount: todayOrders.length
    };
  }, [orders, products]);

  // Selected Date Range Financials
  const rangeFilteredOrders = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return orders.filter((order) => {
      if (order.status === 'cancelled') return false;
      const orderDate = new Date(order.created_at);

      if (timeRange === 'today') {
        return orderDate >= todayStart;
      } else if (timeRange === '7days') {
        const past7 = new Date(todayStart);
        past7.setDate(past7.getDate() - 6);
        return orderDate >= past7;
      } else if (timeRange === '30days') {
        const past30 = new Date(todayStart);
        past30.setDate(past30.getDate() - 29);
        return orderDate >= past30;
      } else if (timeRange === 'custom') {
        const start = new Date(customStartDate + 'T00:00:00');
        const end = new Date(customEndDate + 'T23:59:59');
        return orderDate >= start && orderDate <= end;
      }
      return true;
    });
  }, [orders, timeRange, customStartDate, customEndDate, products]);

  const rangeTotals = useMemo(() => {
    let revenue = 0;
    let cost = 0;

    rangeFilteredOrders.forEach((order) => {
      const { orderRevenue, orderCost } = calculateOrderFinancials(order);
      revenue += orderRevenue;
      cost += orderCost;
    });

    const profit = revenue - cost;
    const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

    return {
      revenue,
      cost,
      profit,
      margin,
      ordersCount: rangeFilteredOrders.length
    };
  }, [rangeFilteredOrders, products]);

  // Daily Breakdown for Chart (DA / Day)
  const chartDays = useMemo(() => {
    const daysMap: Record<string, { date: string; label: string; revenue: number; profit: number }> = {};
    const daysCount = timeRange === 'today' ? 1 : timeRange === '30days' ? 30 : 7;

    const now = new Date();
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('fr-DZ', { weekday: 'short', day: 'numeric', month: 'numeric' });
      daysMap[dateStr] = { date: dateStr, label, revenue: 0, profit: 0 };
    }

    rangeFilteredOrders.forEach((order) => {
      const dateStr = order.created_at.split('T')[0];
      if (daysMap[dateStr]) {
        const { orderRevenue, orderProfit } = calculateOrderFinancials(order);
        daysMap[dateStr].revenue += orderRevenue;
        daysMap[dateStr].profit += orderProfit;
      }
    });

    return Object.values(daysMap);
  }, [rangeFilteredOrders, timeRange, products]);

  // SVG Chart Geometry
  const maxProfit = Math.max(...chartDays.map((d) => d.profit), 10000);
  const chartHeight = 180;
  const chartWidth = 550;
  const paddingX = 40;
  const paddingY = 20;

  const points = chartDays.map((day, idx) => {
    const x = paddingX + (idx / Math.max(1, chartDays.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (day.profit / maxProfit) * (chartHeight - paddingY * 2);
    return { x, y, ...day };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Profit Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {language === 'ar' ? 'أرباح اليوم' : 'Bénéfice Aujourd\'hui'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block tracking-tight">
              +{formatPrice(todayStats.profit)} <span className="text-xs font-bold text-slate-300">{currencySymbol}</span>
            </span>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span>{todayStats.ordersCount} commandes</span>
              <span className="text-emerald-400 font-bold">Marge {todayStats.margin}%</span>
            </div>
          </div>
        </div>

        {/* Selected Range Profit */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {language === 'ar' ? 'أرباح الفترة المحددة' : 'Bénéfice Période'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block tracking-tight">
              +{formatPrice(rangeTotals.profit)} <span className="text-xs font-bold text-slate-500">{currencySymbol}</span>
            </span>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>{rangeTotals.ordersCount} commandes</span>
              <span className="text-amber-600 font-bold">Marge {rangeTotals.margin}%</span>
            </div>
          </div>
        </div>

        {/* Selected Range Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {language === 'ar' ? 'رقم الأعمال (المبيعات)' : 'Chiffre d\'Affaires'}
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Ventes
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block tracking-tight">
              {formatPrice(rangeTotals.revenue)} <span className="text-xs font-bold text-slate-500">{currencySymbol}</span>
            </span>
            <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
              Total facturé clients
            </div>
          </div>
        </div>

        {/* Cost of Goods Sold */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {language === 'ar' ? 'تكلفة الشراء (السلع)' : 'Coût d\'Achat (Stock)'}
            </span>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
              Achat
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block tracking-tight">
              {formatPrice(rangeTotals.cost)} <span className="text-xs font-bold text-slate-500">{currencySymbol}</span>
            </span>
            <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
              Montant payé aux fournisseurs
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Chart Section (منحنى بياني للربح DA/DAY) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* Controls & Filter Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {language === 'ar' ? 'المنحنى البياني للأرباح (د.ج / يوم)' : 'Courbe d\'Évolution des Bénéfices (DA / Jour)'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Suivi graphique de vos gains réels nets par jour
            </p>
          </div>

          {/* Time Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'today', label: 'Aujourd\'hui' },
              { id: '7days', label: '7 Derniers Jours' },
              { id: '30days', label: '30 Derniers Jours' },
              { id: 'custom', label: 'Période Personnalisée' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeRange === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Picker Inputs (if custom is selected) */}
        {timeRange === 'custom' && (
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Choisir l'intervalle de dates :</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">Du :</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 font-bold text-xs outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">Au :</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 font-bold text-xs outline-none"
              />
            </div>

            <span className="text-[11px] text-amber-800 font-semibold ml-auto">
              ({rangeTotals.ordersCount} commandes trouvées)
            </span>
          </div>
        )}

        {/* Responsive Interactive SVG Graph */}
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-48 sm:h-64 overflow-visible"
          >
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Background Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = paddingY + ratio * (chartHeight - paddingY * 2);
              const val = Math.round(maxProfit * (1 - ratio));
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-slate-400 font-medium"
                  >
                    {val > 0 ? (val >= 1000 ? `${Math.round(val / 1000)}k` : val) : 0}
                  </text>
                </g>
              );
            })}

            {/* Shaded Area Fill */}
            {points.length > 1 && (
              <path d={areaD} fill="url(#profitGradient)" />
            )}

            {/* Curved Main Line */}
            {points.length > 1 && (
              <path
                d={pathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Interactive Data Nodes */}
            {points.map((pt, idx) => (
              <g key={idx} className="group cursor-pointer">
                {/* Vertical hover line */}
                <line
                  x1={pt.x}
                  y1={paddingY}
                  x2={pt.x}
                  y2={chartHeight - paddingY}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />

                {/* Point Circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  className="fill-white stroke-emerald-600 stroke-2 hover:r-7 transition-all shadow-md"
                />

                {/* Bottom X-Axis Date Label */}
                <text
                  x={pt.x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-500 font-semibold"
                >
                  {pt.label}
                </text>

                {/* Tooltip on Hover */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <rect
                    x={pt.x - 45}
                    y={pt.y - 38}
                    width="90"
                    height="28"
                    rx="8"
                    className="fill-slate-900 shadow-xl"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 20}
                    textAnchor="middle"
                    className="text-[10px] fill-white font-extrabold"
                  >
                    +{formatPrice(pt.profit)} DA
                  </text>
                </g>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};
