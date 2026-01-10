import { Link } from 'react-router-dom';
import {
  Sparkles,
  Globe,
  Lock,
  Zap,
  Video,
  Image,
  Shield,
  ArrowRight,
  Check,
} from 'lucide-react';

const apis = [
  {
    icon: Globe,
    name: 'IP 查询',
    description: '获取 IP 地址的地理位置信息',
    endpoint: 'GET /api/ip',
    badge: '免费',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: Image,
    name: 'QQ 头像',
    description: '获取 QQ 用户头像',
    endpoint: 'GET /api/qq/avatar',
    badge: '免费',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: Video,
    name: 'B站视频',
    description: '获取 B站视频信息和下载链接',
    endpoint: 'GET /api/bilibili/video',
    badge: 'API Key',
    badgeColor: 'bg-primary-100 text-primary-700',
  },
  {
    icon: Video,
    name: '抖音视频',
    description: '解析抖音视频，获取无水印链接',
    endpoint: 'GET /api/douyin/video',
    badge: 'API Key',
    badgeColor: 'bg-primary-100 text-primary-700',
  },
  {
    icon: Lock,
    name: 'AES 加密',
    description: 'AES 对称加密/解密服务',
    endpoint: 'POST /api/crypto/encrypt',
    badge: 'API Key',
    badgeColor: 'bg-primary-100 text-primary-700',
  },
];

const features = [
  {
    icon: Zap,
    title: '高性能',
    description: '毫秒级响应，99.9% 可用性保障',
  },
  {
    icon: Shield,
    title: '安全可靠',
    description: 'HTTPS 加密传输，API Key 鉴权',
  },
  {
    icon: Sparkles,
    title: '简单易用',
    description: 'RESTful 设计，完善的文档支持',
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-48 h-48 bg-pink-200/20 rounded-full blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-soft mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-gray-600">简单、快速、可靠的 API 服务</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up">
              <span className="gradient-text">VapIV</span>
              <br />
              <span className="text-gray-800">API 服务平台</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 animate-slide-up animate-delay-100">
              提供多媒体解析、数据加密等实用 API 服务
              <br />
              快速集成，即刻开始
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animate-delay-200">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                免费开始使用
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/docs" className="btn-secondary text-lg px-8 py-4">
                查看文档
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-8 rounded-3xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API List Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">可用 API 服务</h2>
            <p className="text-xl text-gray-600">丰富的接口满足您的各种需求</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apis.map((api, index) => (
              <div
                key={api.name}
                className="card-interactive group animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <api.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className={`badge ${api.badgeColor}`}>{api.badge}</span>
                </div>

                <h3 className="text-lg font-display font-bold text-gray-800 mb-2">
                  {api.name}
                </h3>
                <p className="text-gray-600 mb-4">{api.description}</p>

                <code className="inline-block px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono text-gray-700">
                  {api.endpoint}
                </code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="card bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-12 text-center">
            <h2 className="section-title mb-4">准备好开始了吗？</h2>
            <p className="text-xl text-gray-600 mb-8">
              注册即可获得免费 API 调用额度
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              {['注册即送 1000 次调用', '无需信用卡', '随时取消'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-gray-700">
                  <Check className="w-5 h-5 text-secondary-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <Link to="/register" className="btn-primary text-lg px-10 py-4">
              免费注册
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
