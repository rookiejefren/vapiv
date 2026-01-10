import { useState } from 'react';
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  calls: number;
}

const mockKeys: ApiKey[] = [
  {
    id: '1',
    name: '生产环境',
    key: 'vap_prod_a1b2c3d4e5f6g7h8i9j0',
    createdAt: '2024-01-01',
    lastUsed: '2 小时前',
    calls: 12450,
  },
  {
    id: '2',
    name: '测试环境',
    key: 'vap_test_k1l2m3n4o5p6q7r8s9t0',
    createdAt: '2024-01-05',
    lastUsed: '1 天前',
    calls: 3280,
  },
  {
    id: '3',
    name: '开发调试',
    key: 'vap_dev_u1v2w3x4y5z6a7b8c9d0',
    createdAt: '2024-01-10',
    lastUsed: '5 分钟前',
    calls: 890,
  },
];

export function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(mockKeys);
  const [showModal, setShowModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const copyKey = async (key: string, id: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const createKey = () => {
    if (!newKeyName.trim()) return;

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `vap_${newKeyName.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(36).slice(2, 22)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: '从未使用',
      calls: 0,
    };

    setKeys([newKey, ...keys]);
    setNewKeyName('');
    setShowModal(false);
  };

  const deleteKey = (id: string) => {
    setKeys(keys.filter((k) => k.id !== id));
    setDeleteConfirm(null);
  };

  const maskKey = (key: string) => {
    return key.slice(0, 12) + '•'.repeat(16) + key.slice(-4);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
            API Key 管理
          </h1>
          <p className="text-gray-600">创建和管理您的 API 密钥</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          创建 Key
        </button>
      </div>

      {/* Keys List */}
      <div className="space-y-4">
        {keys.map((apiKey, index) => (
          <div
            key={apiKey.id}
            className="card animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <Key className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-gray-800 mb-1">
                    {apiKey.name}
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    <code className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono text-gray-700">
                      {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {visibleKeys.has(apiKey.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => copyKey(apiKey.key, apiKey.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {copiedKey === apiKey.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>创建于 {apiKey.createdAt}</span>
                    <span>最后使用: {apiKey.lastUsed}</span>
                    <span>调用次数: {apiKey.calls.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                {deleteConfirm === apiKey.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteKey(apiKey.id)}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      确认删除
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(apiKey.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {keys.length === 0 && (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-display font-bold text-gray-800 mb-2">
            暂无 API Key
          </h3>
          <p className="text-gray-600 mb-6">创建您的第一个 API Key 开始使用</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            创建 Key
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-md mx-4 animate-slide-up">
            <h2 className="text-xl font-display font-bold text-gray-800 mb-6">
              创建新的 API Key
            </h2>

            <div className="mb-6">
              <label className="label">Key 名称</label>
              <input
                type="text"
                className="input"
                placeholder="例如：生产环境"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-50 flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <p className="text-sm text-amber-700">
                API Key 创建后只会显示一次，请妥善保存。
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                onClick={createKey}
                disabled={!newKeyName.trim()}
                className="btn-primary flex-1"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
