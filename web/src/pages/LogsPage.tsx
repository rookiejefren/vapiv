import { useState } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

interface LogEntry {
  id: string;
  api: string;
  method: string;
  status: 'success' | 'error';
  statusCode: number;
  duration: number;
  ip: string;
  time: string;
}

const mockLogs: LogEntry[] = [
  { id: '1', api: '/api/ip', method: 'GET', status: 'success', statusCode: 200, duration: 32, ip: '192.168.1.100', time: '2024-01-10 14:30:25' },
  { id: '2', api: '/api/bilibili/video', method: 'GET', status: 'success', statusCode: 200, duration: 156, ip: '192.168.1.100', time: '2024-01-10 14:28:12' },
  { id: '3', api: '/api/crypto/encrypt', method: 'POST', status: 'success', statusCode: 200, duration: 28, ip: '192.168.1.101', time: '2024-01-10 14:25:08' },
  { id: '4', api: '/api/douyin/video', method: 'GET', status: 'error', statusCode: 500, duration: 2045, ip: '192.168.1.100', time: '2024-01-10 14:20:33' },
  { id: '5', api: '/api/qq/avatar', method: 'GET', status: 'success', statusCode: 200, duration: 45, ip: '192.168.1.102', time: '2024-01-10 14:18:15' },
  { id: '6', api: '/api/bilibili/video/url', method: 'GET', status: 'success', statusCode: 200, duration: 234, ip: '192.168.1.100', time: '2024-01-10 14:15:42' },
  { id: '7', api: '/api/ip', method: 'GET', status: 'success', statusCode: 200, duration: 18, ip: '192.168.1.103', time: '2024-01-10 14:12:08' },
  { id: '8', api: '/api/crypto/decrypt', method: 'POST', status: 'error', statusCode: 400, duration: 12, ip: '192.168.1.100', time: '2024-01-10 14:10:55' },
];

export function LogsPage() {
  const [logs] = useState<LogEntry[]>(mockLogs);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'error'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.api.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
          调用日志
        </h1>
        <p className="text-gray-600">查看 API 调用历史记录</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="input pl-12"
              placeholder="搜索 API 路径..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="input w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">全部状态</option>
              <option value="success">成功</option>
              <option value="error">失败</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">API</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">方法</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">状态</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">耗时</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">IP</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">时间</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="py-4 px-4">
                    <code className="text-sm font-mono text-gray-800">{log.api}</code>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`badge ${
                      log.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                      log.method === 'POST' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {log.method}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {log.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        log.status === 'success' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {log.statusCode}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-sm">{log.duration}ms</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600 font-mono">{log.ip}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-500">{log.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无匹配的日志记录</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            共 {filteredLogs.length} 条记录
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              第 {currentPage} 页
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
