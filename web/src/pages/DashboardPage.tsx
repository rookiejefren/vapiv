import { useState, useEffect } from 'react';
import {
  Activity,
  TrendingUp,
  Key,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockUsageData = [
  { date: '01/01', calls: 120 },
  { date: '01/02', calls: 180 },
  { date: '01/03', calls: 150 },
  { date: '01/04', calls: 280 },
  { date: '01/05', calls: 220 },
  { date: '01/06', calls: 350 },
  { date: '01/07', calls: 310 },
];

const stats = [
  {
    label: '今日调用',
    value: '1,234',
    change: '+12.5%',
    trend: 'up',
    icon: Activity,
    color: 'from-primary-400 to-primary-500',
  },
  {
    label: '本月调用',
    value: '45,678',
    change: '+8.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'from-secondary-400 to-secondary-500',
  },
  {
    label: '活跃 Key',
    value: '3',
    change: '0',
    trend: 'neutral',
    icon: Key,
    color: 'from-amber-400 to-orange-500',
  },
  {
    label: '平均响应',
    value: '45ms',
    change: '-5.3%',
    trend: 'down',
    icon: Clock,
    color: 'from-emerald-400 to-teal-500',
  },
];

const recentCalls = [
  { api: 'IP 查询', time: '2 分钟前', status: 'success', duration: '32ms' },
  { api: 'B站视频', time: '5 分钟前', status: 'success', duration: '156ms' },
  { api: 'AES 加密', time: '12 分钟前', status: 'success', duration: '28ms' },
  { api: '抖音视频', time: '18 分钟前', status: 'error', duration: '-' },
  { api: 'QQ 头像', time: '25 分钟前', status: 'success', duration: '45ms' },
];

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
          仪表盘
        </h1>
        <p className="text-gray-600">查看您的 API 使用情况和统计数据</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="card animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-soft`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-emerald-600' :
                stat.trend === 'down' ? 'text-red-500' :
                'text-gray-500'
              }`}>
                {stat.trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
                {stat.trend === 'down' && <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-gray-800 mb-1">
              {stat.value}
            </p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card animate-slide-up animate-delay-200">
        <h2 className="text-xl font-display font-bold text-gray-800 mb-6">
          调用趋势
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockUsageData}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e879f9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e879f9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="#d946ef"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCalls)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Calls */}
      <div className="card animate-slide-up animate-delay-300">
        <h2 className="text-xl font-display font-bold text-gray-800 mb-6">
          最近调用
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">API</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">时间</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">耗时</th>
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-800">{call.api}</td>
                  <td className="py-4 px-4 text-gray-600">{call.time}</td>
                  <td className="py-4 px-4">
                    <span className={`badge ${
                      call.status === 'success' ? 'badge-success' : 'bg-red-100 text-red-700'
                    }`}>
                      {call.status === 'success' ? '成功' : '失败'}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-sm text-gray-600">{call.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
