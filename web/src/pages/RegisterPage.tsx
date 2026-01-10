import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, ArrowRight, Mail } from 'lucide-react';
import { authApi } from '../lib/api';
import { useAuthStore } from '../store/auth';

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    code: '',
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    if (!form.email || sendingCode || countdown > 0) return;

    setSendingCode(true);
    setError('');

    try {
      await authApi.sendCode(form.email, 'register');
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || '发送验证码失败');
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.register(form.username, form.email, form.password, form.code);
      const res = await authApi.login(form.username, form.password) as any;
      login(res.data.token, { id: '', username: form.username, email: form.email });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="card p-8 md:p-10 animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center shadow-soft">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-2xl text-gray-800">VapIV</span>
            </Link>
            <h1 className="text-2xl font-display font-bold text-gray-800 mb-2">
              创建账户
            </h1>
            <p className="text-gray-600">注册开始使用 VapIV API 服务</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="label">用户名</label>
              <input
                type="text"
                className="input"
                placeholder="请输入用户名"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">邮箱</label>
              <div className="relative">
                <input
                  type="email"
                  className="input pr-28"
                  placeholder="请输入邮箱"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <button
                  type="button"
                  disabled={!form.email || sendingCode || countdown > 0}
                  onClick={handleSendCode}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? `${countdown}s` : sendingCode ? '发送中...' : '发送验证码'}
                </button>
              </div>
            </div>

            <div>
              <label className="label">验证码</label>
              <div className="relative">
                <input
                  type="text"
                  className="input pl-12"
                  placeholder="请输入 6 位验证码"
                  maxLength={6}
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="label">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="至少 6 位密码"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4"
            >
              {loading ? '注册中...' : '创建账户'}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-8">
            已有账户？{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
