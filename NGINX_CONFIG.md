# Nginx 配置说明

## 配置方案

将本地 Vite 开发服务（通过 NPS 映射）代理到 HTTPS 子路径。

### 架构流程

```
本地 Vite 服务（base: '/frontend/'）
http://192.168.1.110:5173/frontend/
         ↓ (NPS 内网穿透)
http://www.shiji.morgen-ai.com:12777/frontend/
         ↓ (Nginx 反向代理，保留路径)
https://www.shiji.morgen-ai.com/frontend/
```

## Nginx 配置

在现有的 `server { listen 443 ssl; }` 块中添加以下配置：

```nginx
server {
    listen       443 ssl;
    server_name  www.shiji.morgen-ai.com;

    # ... SSL 证书配置 ...

    # ========== 前端 H5 项目代理配置 ==========
    location /frontend/ {
        # ⚠️ 注意：proxy_pass 末尾不带斜杠，会保留 /frontend/ 前缀
        # 这样才能匹配 Vite 的 base: '/frontend/' 配置
        proxy_pass http://www.shiji.morgen-ai.com:12777;
        
        # 重要：保留原始 Host 头，避免 Vite HMR 失效
        proxy_set_header Host $http_host;
        
        # 传递真实客户端 IP
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # 传递协议信息（HTTPS）
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket 支持（Vite HMR 需要）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态资源缓存优化（可选）
    location ~* ^/frontend/.*\.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf)$ {
        proxy_pass http://www.shiji.morgen-ai.com:12777;
        proxy_set_header Host $http_host;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # ... 其他已有配置 ...
}
```

## 完整配置示例

```nginx
server {
    listen       443 ssl;
    server_name  www.shiji.morgen-ai.com;

    ssl_certificate      /etc/nginx/cert/shiji.morgen-ai.com.pem;
    ssl_certificate_key  /etc/nginx/cert/shiji.morgen-ai.com.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

    # 禁止访问 actuator
    location ~ ^(/[^/]*)?/actuator.*(/.*)?$ {
        return 403;
    }

    # 前端 H5 项目
    location /frontend/ {
        # 不带尾部斜杠，保留 /frontend/ 前缀
        proxy_pass http://www.shiji.morgen-ai.com:12777;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket 支持（Vite HMR）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 用户协议
    location = /sjAgreement.html {
        root /srv/www;
        try_files /sjAgreement.html =404;
        default_type text/html;
        expires 1h;
    }

    # 隐私政策
    location = /sjPrivacyPolicy.html {
        root /srv/www;
        try_files /sjPrivacyPolicy.html =404;
        default_type text/html;
        expires 1h;
    }

    # ... 其他配置 ...
}
```

## 关键配置说明

### 1. `proxy_pass` 尾部斜杠（关键配置）

```nginx
# ✅ 正确：不带斜杠，保留 /frontend/ 前缀（匹配 Vite base 配置）
location /frontend/ {
    proxy_pass http://www.shiji.morgen-ai.com:12777;
}

# ❌ 错误：带斜杠，会去掉 /frontend/ 前缀
location /frontend/ {
    proxy_pass http://www.shiji.morgen-ai.com:12777/;
}
```

**请求示例：**
- 客户端访问：`https://www.shiji.morgen-ai.com/frontend/auth`
- 代理到：`http://www.shiji.morgen-ai.com:12777/frontend/auth` ✅
- Vite 接收：`/frontend/auth`（匹配 `base: '/frontend/'`）✅

**为什么不能去掉前缀？**
- Vite 配置了 `base: '/frontend/'`
- 所有静态资源路径都是 `/frontend/assets/xxx.js`
- 如果去掉前缀，Vite 会找不到资源，导致 404 或重定向

### 2. WebSocket 支持（Vite HMR）

```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

这些配置确保 Vite 的热更新（HMR）功能正常工作。

### 3. Host 头设置

```nginx
proxy_set_header Host $http_host;
```

保留原始 Host，让 Vite 知道真实的访问地址。

## 微信授权配置

### 1. 微信公众号后台配置

登录 [微信公众平台](https://mp.weixin.qq.com/)：

1. 进入 **设置与开发** → **接口权限** → **网页授权**
2. 配置授权回调域名：
   ```
   www.shiji.morgen-ai.com
   ```
   （注意：不需要 `https://` 和路径）

### 2. 授权回调地址

配置完成后，微信授权回调地址会是：

```
https://www.shiji.morgen-ai.com/frontend/auth?code=xxx&state=STATE
```

项目中的 `src/views/auth/index.vue` 会自动处理这个回调。

## 验证步骤

### 1. 重启 Nginx

```bash
# 检查配置是否正确
nginx -t

# 重新加载配置
nginx -s reload

# 或重启 Nginx
systemctl restart nginx
```

### 2. 测试访问

在浏览器中访问：
```
https://www.shiji.morgen-ai.com/frontend/
```

### 3. 检查 Vite HMR

修改代码，查看浏览器是否自动刷新（热更新）。

## 常见问题

### Q1: 访问提示 404

**原因：** NPS 服务未正常运行或端口映射错误

**解决：**
```bash
# 检查 NPS 服务状态
# 确保本地 192.168.1.110:5173 已映射到 12777 端口
```

### Q2: 资源加载 404

**原因：** Vite `base` 配置不正确

**解决：** 确保已按上述修改 `vite.config.ts`

### Q3: 微信授权失败

**原因：** 微信公众号后台未配置域名

**解决：** 在微信公众平台配置 `www.shiji.morgen-ai.com`

### Q4: HMR 不工作

**原因：** Nginx 未配置 WebSocket 支持

**解决：** 添加上述 `Upgrade` 和 `Connection` 配置

## 部署流程

### 开发环境（本地调试）

1. 启动本地 Vite 服务：
   ```bash
   npm run dev
   # 监听在 http://192.168.1.110:5173/
   ```

2. 确保 NPS 正常运行
   ```bash
   # 映射 5173 → 12777
   ```

3. 配置 Nginx（如上）

4. 访问：`https://www.shiji.morgen-ai.com/frontend/`

### 生产环境（构建部署）

1. 构建项目：
   ```bash
   npm run build
   # 生成 dist/ 目录
   ```

2. 将 `dist/` 目录部署到服务器

3. 修改 Nginx 配置：
   ```nginx
   location /frontend/ {
       alias /path/to/dist/;
       try_files $uri $uri/ /frontend/index.html;
   }
   ```

## 注意事项

1. **HTTPS 环境**
   - 已配置 SSL 证书，所有请求都会自动跳转到 HTTPS
   - 微信授权必须使用 HTTPS

2. **子路径问题**
   - Vue Router 使用 `createWebHistory`，Nginx 需要配置 `try_files`
   - 所有静态资源都会加上 `/frontend/` 前缀

3. **API 请求**
   - 项目中的 API 请求使用 `/api` 前缀
   - 由 Vite 代理到 `https://www.shiji.morgen-ai.com/prod-api/`
   - 生产环境需要在 Nginx 中配置相应代理

4. **微信环境检测**
   - 项目已实现微信环境检测
   - 非微信环境会提示用户

