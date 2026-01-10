import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Key,
  ScrollText,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';

const navItems = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/dashboard' },
  { icon: Key, label: 'API Key', path: '/dashboard/keys' },
  { icon: ScrollText, label: '调用日志', path: '/dashboard/logs' },
  { icon: Settings, label: '设置', path: '/dashboard/settings' },
];

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-gray-800">VapIV</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-primary-400" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
            <span className="text-primary-700 font-semibold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">{user?.username || '用户'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">退出登录</span>
        </button>
      </div>
    </aside>
  );
}
