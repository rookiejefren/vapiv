# VAPIV

Go 语言开发的公共 API 服务平台，参考 [uapis.cn](https://uapis.cn/)

## 功能特性

- 用户认证（JWT）
- API Key 管理
- 积分计费系统
- 请求限流
- Docker 部署

## API 列表

### 公共 API（无需认证）

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/ip` | GET | IP 地址查询 |
| `/api/qq/avatar` | GET | QQ 头像获取 |

### 需要 API Key

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/crypto/encrypt` | POST | AES 加密 |
| `/api/crypto/decrypt` | POST | AES 解密 |
| `/api/bilibili/video` | GET | B站视频信息 |

## 快速开始

```bash
# 复制环境变量
cp .env.example .env

# Docker 启动
docker-compose up -d

# 或本地开发
go run ./cmd/server
```

## 技术栈

- Go + Gin
- PostgreSQL + GORM
- Redis
- Docker
