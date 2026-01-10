import { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useAuthStore } from '../store/auth';

export function SettingsPage() {
  const { user } = useAuthStore();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('密码长度至少 6 位');
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      setError('修改密码失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
          账户设置
        </h1>
        <p className="text-gray-600">管理您的账户信息和安全设置</p>
      </div>

      {/* Profile Section */}
      <div className="card">
        <h2 className="text-xl font-display font-bold text-gray-800 mb-6">
          个人信息
        </h2>

        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
              <span className="text-3xl font-display font-bold text-primary-700">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-gray-800">
                {user?.username || '用户'}
              </h3>
              <p className="text-gray-500">{user?.email || ''}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                <User className="w-4 h-4 inline mr-2" />
                用户名
              </label>
              <input
                type="text"
                className="input bg-gray-100"
                value={user?.username || ''}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">用户名不可修改</p>
            </div>
            <div>
              <label className="label">
                <Mail className="w-4 h-4 inline mr-2" />
                邮箱
              </label>
              <input
                type="email"
                className="input bg-gray-100"
                value={user?.email || ''}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">邮箱不可修改</p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="card">
        <h2 className="text-xl font-display font-bold text-gray-800 mb-6">
          <Lock className="w-5 h-5 inline mr-2" />
          修改密码
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 flex items-start gap-3">
              <Check className="w-5 h-5 text-emerald-500 mt-0.5" />
              <p className="text-sm text-emerald-600">密码修改成功！</p>
            </div>
          )}

          <div>
            <label className="label">当前密码</label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                className="input pr-12"
                placeholder="请输入当前密码"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                }
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="label">新密码</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="input pr-12"
                placeholder="至少 6 位密码"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                minLength={6}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="label">确认新密码</label>
            <input
              type="password"
              className="input"
              placeholder="再次输入新密码"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              '保存中...'
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                保存修改
              </>
            )}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-200">
        <h2 className="text-xl font-display font-bold text-red-600 mb-4">
          危险区域
        </h2>
        <p className="text-gray-600 mb-4">
          删除账户后，所有数据将永久丢失，无法恢复。
        </p>
        <button className="px-6 py-3 text-red-600 border-2 border-red-200 rounded-2xl font-medium hover:bg-red-50 transition-colors">
          删除账户
        </button>
      </div>
    </div>
  );
}
