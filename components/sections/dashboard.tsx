"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart } from "lucide-react";
import {
  dashboardKPIs,
  monthlyRevenue,
  salesByCategory,
  customerGrowth,
  regionPerformance,
  dashboardFilters,
} from "@/data/dashboard";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { MotionWrapper } from "@/components/animations/motion-wrapper";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";

const COLORS = ["#3B82F6", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"];

const kpiIcons = [DollarSign, Users, ShoppingCart, TrendingUp];

function KPICard({
  label,
  value,
  prefix = "",
  suffix = "",
  change,
  index,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  index: number;
}) {
  const { count, ref } = useCountUp(value, 2000);
  const Icon = kpiIcons[index] || DollarSign;
  const isPositive = change >= 0;

  const displayValue =
    suffix === "%"
      ? `${count.toFixed(1)}${suffix}`
      : prefix === "$" && value > 10000
        ? `${prefix}${(count / 1000000).toFixed(2)}M`
        : `${prefix}${count.toLocaleString()}${suffix}`;

  return (
    <div ref={ref}>
      <GlassCard hover={false} className="!p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="text-2xl font-bold md:text-3xl">{displayValue}</div>
        <div
          className={cn(
            "mt-2 flex items-center gap-1 text-xs font-medium",
            isPositive ? "text-emerald-400" : "text-red-400"
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {isPositive ? "+" : ""}
          {change}% vs last period
        </div>
      </GlassCard>
    </div>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg p-3 text-sm shadow-lg">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export function DashboardSection() {
  const [region, setRegion] = useState("All");
  const [period, setPeriod] = useState("YTD");

  return (
    <section id="dashboard" className="section-padding bg-muted/10">
      <div className="container-custom">
        <MotionWrapper>
          <SectionHeading
            label="Dashboard Showcase"
            title="Interactive Analytics Preview"
            description="A Power BI-style dashboard demonstrating real-time KPI tracking, trend analysis, and interactive filtering."
          />
        </MotionWrapper>

        <MotionWrapper delay={0.1}>
          <div className="mb-6 flex flex-wrap gap-3">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-lg glass px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Filter by region"
            >
              {dashboardFilters.regions.map((r) => (
                <option key={r} value={r}>
                  Region: {r}
                </option>
              ))}
            </select>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg glass px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Filter by period"
            >
              {dashboardFilters.periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </MotionWrapper>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {dashboardKPIs.map((kpi, i) => (
            <MotionWrapper key={kpi.label} delay={0.1 + i * 0.05}>
              <KPICard {...kpi} index={i} />
            </MotionWrapper>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <MotionWrapper delay={0.2}>
            <GlassCard hover={false}>
              <h3 className="mb-4 font-semibold">Monthly Revenue vs Target</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target" fill="#8B5CF6" radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={0.25}>
            <GlassCard hover={false}>
              <h3 className="mb-4 font-semibold">Sales by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {salesByCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={0.3}>
            <GlassCard hover={false}>
              <h3 className="mb-4 font-semibold">Customer Growth Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    name="Total Customers"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newCustomers"
                    name="New Customers"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={{ fill: "#06B6D4", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={0.35}>
            <GlassCard hover={false}>
              <h3 className="mb-4 font-semibold">Regional Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={60} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sales" name="Sales" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
