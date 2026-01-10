import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function PublicHeader() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-gray-800">VapIV</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`btn-ghost ${location.pathname === '/' ? 'text-primary-600 bg-primary-50' : ''}`}
          >
            API 服务
          </Link>
          <Link
            to="/docs"
            className={`btn-ghost ${location.pathname === '/docs' ? 'text-primary-600 bg-primary-50' : ''}`}
          >
            文档
          </Link>
          <Link
            to="/pricing"
            className={`btn-ghost ${location.pathname === '/pricing' ? 'text-primary-600 bg-primary-50' : ''}`}
          >
            定价
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost">
            登录
          </Link>
          <Link to="/register" className="btn-primary">
            免费注册
          </Link>
        </div>
      </div>
    </header>
  );
}
