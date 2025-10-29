<template>
  <app-layout>
    <app-header title="时机" />

    <div class="home-page">
      <!-- 加载状态 -->
      <van-loading v-if="loading" class="loading-center" vertical>
        加载中...
      </van-loading>

      <template v-else>
        <!-- VIP 会员特权卡 -->
        <div class="vip-card">
          <div class="vip-header">
            <van-icon name="diamond-o" class="vip-icon" />
            <span class="vip-title">VIP会员特权</span>
          </div>
          <div class="vip-desc">解锁全部功能，成为"offer收割机"</div>

          <div class="vip-info">
            <div class="vip-info-item">
              <span class="label">VIP会员到期时间</span>
              <span :class="['value', vipStatusClass]">{{ vipStatusText }}</span>
            </div>
            <div class="vip-info-item">
              <span class="label">永久训练卡</span>
              <span class="value">{{ userBenefit?.cardBalance || 0 }} 张</span>
            </div>
            <div class="vip-info-item">
              <span class="label">临时训练卡</span>
              <span class="value">{{ userBenefit?.tempCardBalance || 0 }} 张</span>
            </div>
          </div>

          <!-- 装饰元素 -->
          <div class="decoration decoration-1"></div>
          <div class="decoration decoration-2"></div>
        </div>

        <!-- 选择购买 -->
        <div class="section-title">选择购买</div>

        <!-- VIP 套餐 -->
        <div v-if="vipProduct" class="product-card">
          <div class="product-header">
            <div class="product-title">{{ vipProduct.productName }}</div>
            <div class="product-price">
              <span class="price-num">{{ vipProduct.discountPrice }}</span>
              <span class="price-unit">元</span>
            </div>
            <van-button type="primary" size="small" round class="buy-btn" @click="handleBuy(vipProduct)">
              购买
            </van-button>
          </div>

          <div class="product-desc">{{ vipProduct.productDescription }}</div>

          <!-- 优惠券提示 -->
          <div v-if="vipProduct.hasCoupon && vipProduct.couponName" class="coupon-tip">
            <van-icon name="fire-o" />
            <span>已使用优惠券：{{ vipProduct.couponName }}</span>
          </div>
        </div>

        <!-- 永久训练卡 -->
        <div v-if="cardProducts.length > 0" class="product-card">
          <div class="product-header-simple">
            <div class="product-title">永久训练卡</div>
          </div>

          <div class="product-desc">
            使用训练卡参与模拟面试、优化简历和模拟训练
          </div>

          <van-radio-group v-model="cardOption">
            <div class="option-item">
              <van-radio name="forever">永久有效</van-radio>
            </div>
          </van-radio-group>

          <div class="card-items">
            <div v-for="card in cardProducts" :key="card.productCode" class="card-item">
              <div class="card-item-info">
                <div class="card-name">{{ card.productName }}</div>
                <div class="card-price">
                  <span class="price-num">{{ card.discountPrice }}</span>
                  <span class="price-unit">元</span>
                </div>
                <!-- 优惠券提示 -->
                <div v-if="card.hasCoupon && card.couponName" class="card-coupon">
                  优惠券：{{ card.couponName }}
                </div>
              </div>
              <van-button type="warning" size="small" round class="buy-btn" @click="handleBuy(card)">
                购买
              </van-button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </app-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { showToast, showLoadingToast, closeToast, showDialog } from 'vant'
import AppLayout from '@/components/AppLayout.vue'
import AppHeader from '@/components/AppHeader.vue'
import { getProductList } from '@/api/product'
import { getUserBenefit } from '@/api/benefit'
import { jsapiPay } from '@/api/payment'
import { formatDateTime } from '@/utils/format'
import { isWechat, waitForWxJSBridge } from '@/utils/wechat'
import type { Product } from '@/types/product'
import type { UserBenefit } from '@/types/benefit'
import type { WxPayConfig } from '@/types/payment'
import { PaymentSource } from '@/types/payment'

const loading = ref(false)
const productList = ref<Product[]>([])
const userBenefit = ref<UserBenefit | null>(null)
const cardOption = ref('forever')

// VIP 套餐商品
const vipProduct = computed(() => {
  return productList.value.find(item => item.productCode.startsWith('VIP'))
})

// 训练卡商品列表
const cardProducts = computed(() => {
  return productList.value.filter(item => item.productCode.startsWith('CARD'))
})

// VIP 状态文本
const vipStatusText = computed(() => {
  if (!userBenefit.value) return '加载中...'

  if (userBenefit.value.isVip === 1 && userBenefit.value.vipExpireTime) {
    return formatDateTime(userBenefit.value.vipExpireTime)
  }

  return '未开通'
})

// VIP 状态样式类
const vipStatusClass = computed(() => {
  if (!userBenefit.value) return ''

  if (userBenefit.value.isVip === 1) {
    // 检查是否过期
    if (userBenefit.value.vipExpireTime) {
      const expireDate = new Date(userBenefit.value.vipExpireTime)
      const now = new Date()
      return expireDate > now ? 'active' : 'expired'
    }
  }

  return 'expired'
})

// 获取用户权益信息
const fetchUserBenefit = async () => {
  try {
    const res = await getUserBenefit()
    userBenefit.value = res.data || res
    console.log('用户权益信息:', userBenefit.value)
  } catch (error) {
    console.error('获取用户权益信息失败:', error)
    showToast({
      message: '获取用户权益信息失败',
      position: 'top'
    })
  }
}

// 获取商品列表
const fetchProductList = async () => {
  try {
    const res = await getProductList()
    productList.value = res.data || res
    console.log('商品列表:', productList.value)
  } catch (error) {
    console.error('获取商品列表失败:', error)
    showToast({
      message: '获取商品列表失败',
      position: 'top'
    })
  }
}

// 初始化数据
const initData = async () => {
  loading.value = true
  try {
    await Promise.all([fetchUserBenefit(), fetchProductList()])
  } finally {
    loading.value = false
  }
}

// 调起微信支付
const invokeWxPay = async (payConfig: WxPayConfig): Promise<void> => {
  // 检查是否在微信环境
  if (!isWechat()) {
    showDialog({
      title: '提示',
      message: '请在微信客户端打开'
    })
    throw new Error('Not in WeChat')
  }

  // 等待 WeixinJSBridge 加载完成
  await waitForWxJSBridge()

  return new Promise((resolve, reject) => {
    if (typeof window.WeixinJSBridge === 'undefined') {
      reject(new Error('WeixinJSBridge not found'))
      return
    }

    window.WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      payConfig,
      (res: any) => {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          // 支付成功
          resolve()
        } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
          // 用户取消支付
          reject(new Error('用户取消支付'))
        } else {
          // 支付失败
          reject(new Error(res.err_msg || '支付失败'))
        }
      }
    )
  })
}

// 购买商品
const handleBuy = async (product: Product) => {
  console.log('购买商品:', product)

  try {
    // 显示加载提示
    showLoadingToast({
      message: '正在创建订单...',
      forbidClick: true,
      duration: 0
    })

    // 调用支付接口
    const payParams = {
      productCode: product.productCode,
      paymentSource: PaymentSource.MP, // 公众号支付
      // 如果商品有优惠券，传递优惠券ID
      ...(product.hasCoupon && product.userCouponId
        ? { userCouponId: product.userCouponId }
        : {})
    }

    console.log('支付请求参数:', payParams)
    const res = await jsapiPay(payParams)
    const payData = res.data || res

    console.log('支付响应数据:', payData)

    // 检查响应状态
    if (payData.code !== 'SUCCESS') {
      closeToast()
      showToast({
        message: payData.message || '创建订单失败',
        position: 'top'
      })
      return
    }

    closeToast()

    // 准备微信支付配置（符合微信 JSAPI 规范）
    const wxPayConfig: WxPayConfig = {
      appId: payData.appId,
      timeStamp: payData.timeStamp, // 注意：S 必须大写
      nonceStr: payData.nonceStr,
      package: payData.packageValue,
      signType: payData.signType,
      paySign: payData.paySign
    }

    console.log('调起微信支付:', wxPayConfig)

    // 显示支付中提示
    showLoadingToast({
      message: '正在调起支付...',
      forbidClick: true,
      duration: 0
    })

    // 调起微信支付
    await invokeWxPay(wxPayConfig)

    // 支付成功
    closeToast()
    showToast({
      message: `${product.productName} 购买成功`,
      position: 'top',
      duration: 2000
    })

    // 刷新用户权益信息
    fetchUserBenefit()
  } catch (error: any) {
    closeToast()
    console.error('购买失败:', error)

    const errorMsg = error.message || '支付失败'
    if (errorMsg === '用户取消支付') {
      showToast({
        message: '已取消支付',
        position: 'top'
      })
    } else if (errorMsg !== 'Not in WeChat') {
      showToast({
        message: errorMsg,
        position: 'top'
      })
    }
  }
}

// 组件挂载时初始化数据
onMounted(() => {
  initData()
})
</script>

<style scoped lang="scss">
.home-page {
  padding: 16px;
  padding-bottom: 60px;
  background: #f5f7fa;
  min-height: calc(100vh - 56px);
}

// 加载状态
.loading-center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

// VIP 卡片
.vip-card {
  background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 180, 148, 0.3);

  .vip-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    .vip-icon {
      font-size: 24px;
      color: #fff;
      margin-right: 8px;
    }

    .vip-title {
      font-size: 20px;
      font-weight: 600;
      color: #fff;
    }
  }

  .vip-desc {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 20px;
  }

  .vip-info {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .vip-info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      backdrop-filter: blur(10px);

      .label {
        font-size: 14px;
        color: #fff;
      }

      .value {
        font-size: 16px;
        font-weight: 600;
        color: #fff;

        &.active {
          color: #4ade80;
        }

        &.expired {
          color: #ffd21e;
        }
      }
    }
  }

  // 装饰元素
  .decoration {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);

    &.decoration-1 {
      width: 100px;
      height: 100px;
      top: -30px;
      right: -20px;
    }

    &.decoration-2 {
      width: 60px;
      height: 60px;
      bottom: -20px;
      left: -10px;
    }
  }
}

// 分区标题
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

// 商品卡片
.product-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  .product-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;

    .product-title {
      flex: 1;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .product-price {
      margin-right: 12px;
      display: flex;
      align-items: baseline;

      .price-num {
        font-size: 22px;
        font-weight: 600;
        color: #ff6b6b;
      }

      .price-unit {
        font-size: 14px;
        color: #ff6b6b;
        margin-left: 2px;
      }
    }

    .buy-btn {
      background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
      border: none;
      padding: 0 20px;
    }
  }

  .product-header-simple {
    margin-bottom: 12px;

    .product-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }

  .product-desc {
    font-size: 13px;
    color: #999;
    margin-bottom: 12px;
    line-height: 1.5;
  }

  // 优惠券提示
  .coupon-tip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: #fff3e0;
    border-radius: 6px;
    margin-top: 12px;

    .van-icon {
      font-size: 16px;
      color: #ff9500;
    }

    span {
      font-size: 13px;
      color: #ff9500;
    }
  }

  .option-item {
    padding: 10px 0;

    :deep(.van-radio) {
      align-items: center;

      .van-radio__label {
        font-size: 14px;
        color: #666;
      }

      .van-radio__icon--checked {
        .van-icon {
          background-color: #00b894;
          border-color: #00b894;
        }
      }
    }
  }

  .card-items {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .card-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      background: #f8f9fb;
      border-radius: 8px;

      .card-item-info {
        flex: 1;

        .card-name {
          font-size: 14px;
          color: #333;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .card-coupon {
          font-size: 12px;
          color: #ff9500;
          margin-top: 4px;
        }

        .card-price {
          display: flex;
          align-items: baseline;

          .price-num {
            font-size: 20px;
            font-weight: 600;
            color: #ff9500;
          }

          .price-unit {
            font-size: 13px;
            color: #ff9500;
            margin-left: 2px;
          }
        }
      }

      .buy-btn {
        background: linear-gradient(135deg, #ff9500 0%, #ff7700 100%);
        border: none;
        padding: 0 20px;
      }
    }
  }
}
</style>
