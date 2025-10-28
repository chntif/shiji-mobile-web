# 微信支付对接说明

## 功能概述

已完成商品购买页的微信 JSAPI 支付接口对接。

## 支付流程

```
用户点击购买
    ↓
创建订单（调用 /app/wechat/pay/jsapi）
    ↓
获取支付参数
    ↓
调起微信支付（ WeixinJSBridge ）
    ↓
用户完成支付
    ↓
支付成功回调
    ↓
刷新用户权益信息
```

## 使用方式

### 1. 设置 Token

在微信环境中测试前，需要先设置 Authorization Token：

```javascript
import { setAuthToken } from '@/utils/request'

// 设置 token
setAuthToken('your-token-here')
```

### 2. 在微信环境中测试

- 必须在微信公众号或微信内置浏览器中打开
- 确保已完成微信 JSSDK 配置
- 点击商品的"购买"按钮即可测试

### 3. 支付参数

接口会自动处理以下参数：

- `productCode`: 从商品信息中获取
- `paymentSource`: 默认 `MP`（公众号支付）
- `userCouponId`: 如果商品有优惠券，自动传递

## 接口详情

### 请求接口

```
POST /app/wechat/pay/jsapi
```

### 请求参数

```typescript
{
  productCode: string        // 商品编码（必需）
  paymentSource?: string     // 支付来源，默认 MP
  userCouponId?: number      // 用户优惠券ID（可选）
}
```

### 响应数据

```typescript
{
  code: string              // 状态码 "SUCCESS"
  message: string           // 消息
  outTradeNo: string        // 商户订单号
  timeStamp: string         // 时间戳（注意：S 必须大写）
  nonceStr: string          // 随机字符串
  packageValue: string      // 预支付交易会话标识
  signType: string          // 签名类型
  paySign: string           // 签名
  appId: string             // 应用ID（公众号ID，JSAPI 调起支付必需）
}
```

### 微信 JSAPI 调起支付参数

根据[微信官方文档](https://pay.weixin.qq.com/doc/v3/merchant/4012791857)，调起支付需要以下参数：

```typescript
{
  appId: string             // 应用ID（必需）
  timeStamp: string         // 时间戳（注意：S 必须大写）
  nonceStr: string          // 随机字符串
  package: string           // 订单详情扩展字符串
  signType: string          // 签名类型
  paySign: string           // 签名
}
```

## 调试信息

支付流程会在控制台输出以下日志：

1. `购买商品:` - 商品信息
2. `支付请求参数:` - 发送给接口的参数
3. `支付响应数据:` - 接口返回的支付配置
4. `调起微信支付:` - 微信支付配置（包含 appId, timeStamp 等参数）

**重要提示**：
- `timeStamp` 参数中的 S 必须大写，这是微信 JSAPI 的强制要求
- `appId` 是调起支付的必需参数，会从接口响应中获取

## 错误处理

### 1. 非微信环境

如果不在微信客户端中，会弹出提示："请在微信客户端打开"

### 2. 用户取消支付

显示 Toast："已取消支付"

### 3. 支付失败

显示具体的错误信息

### 4. 创建订单失败

显示接口返回的错误消息

## 支付成功后

1. 弹出对话框显示订单号
2. 点击"查看订单"按钮
3. 自动刷新用户权益信息（VIP、训练卡余额）

## 开发环境测试

由于本地开发环境无法直接测试微信支付，建议：

1. 使用微信公众平台的测试号
2. 在微信开发者工具中预览
3. 真机测试（通过内网穿透或部署到测试服务器）

## 注意事项

1. 必须在微信环境中才能调起支付
2. 需要设置有效的 Authorization Token
3. 商品编码需要与后端配置一致
4. 确保微信 JSSDK 已正确配置

## 常见问题

### Q: 本地如何测试？
A: 需要使用内网穿透工具（如 ngrok）或部署到测试服务器，然后在微信中访问。

### Q: 支付参数从哪里来？
A: 调用 `/app/wechat/pay/jsapi` 接口获取，接口会返回所有支付所需参数。

### Q: 如何验证支付是否成功？
A: 查看订单页或刷新首页查看用户权益信息是否更新。

