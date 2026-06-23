import type { KPIData, ChartDataPoint } from "@/types";

export const dashboardKPIs: KPIData[] = [
  { label: "Total Revenue", value: 2847500, prefix: "$", suffix: "", change: 12.5 },
  { label: "Active Customers", value: 48320, suffix: "", change: 8.3 },
  { label: "Conversion Rate", value: 3.8, suffix: "%", change: -0.4 },
  { label: "Avg Order Value", value: 156, prefix: "$", suffix: "", change: 5.2 },
];

export const monthlyRevenue: ChartDataPoint[] = [
  { name: "Jan", revenue: 186000, target: 180000 },
  { name: "Feb", revenue: 205000, target: 190000 },
  { name: "Mar", revenue: 237000, target: 210000 },
  { name: "Apr", revenue: 273000, target: 230000 },
  { name: "May", revenue: 209000, target: 240000 },
  { name: "Jun", revenue: 314000, target: 250000 },
  { name: "Jul", revenue: 352000, target: 270000 },
  { name: "Aug", revenue: 328000, target: 280000 },
  { name: "Sep", revenue: 391000, target: 290000 },
  { name: "Oct", revenue: 349000, target: 300000 },
  { name: "Nov", revenue: 430000, target: 310000 },
  { name: "Dec", revenue: 463000, target: 320000 },
];

export const salesByCategory: ChartDataPoint[] = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Home & Garden", value: 18 },
  { name: "Sports", value: 12 },
  { name: "Books", value: 10 },
];

export const customerGrowth: ChartDataPoint[] = [
  { name: "Q1", customers: 11200, newCustomers: 3200 },
  { name: "Q2", customers: 14800, newCustomers: 3600 },
  { name: "Q3", customers: 19200, newCustomers: 4400 },
  { name: "Q4", customers: 24100, newCustomers: 4900 },
];

export const regionPerformance: ChartDataPoint[] = [
  { name: "North", sales: 420000, orders: 2800 },
  { name: "South", sales: 380000, orders: 2500 },
  { name: "East", sales: 510000, orders: 3400 },
  { name: "West", sales: 460000, orders: 3100 },
  { name: "Central", sales: 290000, orders: 1900 },
];

export const dashboardFilters = {
  regions: ["All", "North", "South", "East", "West", "Central"],
  periods: ["Last 7 Days", "Last 30 Days", "Last Quarter", "YTD", "Last Year"],
  categories: ["All", "Electronics", "Clothing", "Home & Garden", "Sports", "Books"],
};
