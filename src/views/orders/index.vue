<template>
  <app-layout>
    <app-header title="我的订单" />
    
    <div class="orders-page">
      <!-- 订单状态筛选 -->
      <van-tabs 
        v-model:active="activeTab" 
        @change="onTabChange"
        sticky
        :offset-top="stickyOffset"
        background="#fff"
      >
        <van-tab title="全部" :name="-1"></van-tab>
        <van-tab title="待支付" :name="OrderStatus.PENDING"></van-tab>
        <van-tab title="已支付" :name="OrderStatus.PAID"></van-tab>
        <van-tab title="已取消" :name="OrderStatus.CANCELLED"></van-tab>
        <van-tab title="已退款" :name="OrderStatus.REFUNDED"></van-tab>
      </van-tabs>

      <van-pull-refresh 
        v-model="refreshing" 
        @refresh="onRefresh"
        pulling-text="下拉刷新"
        loosing-text="释放刷新"
        loading-text="加载中..."
      >
        <!-- 回到顶部按钮（向下滚动一定距离显示） -->
        <van-back-top right="16" bottom="80" :offset="200" />
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div 
            v-for="order in orderList" 
            :key="order.outTradeNo" 
            class="order-card"
          >
            <div class="order-header">
              <span class="order-title">{{ order.productName }}</span>
              <span :class="['order-status', getOrderStatusClass(order.orderStatus)]">
                {{ order.orderStatusText }}
              </span>
            </div>

            <div class="order-info">
              <div class="info-row">
                <span class="label">订单号：</span>
                <span class="value">{{ order.outTradeNo }}</span>
              </div>
              <div v-if="order.paymentChannel" class="info-row">
                <span class="label">支付方式：</span>
                <span class="value">{{ order.paymentChannel }}</span>
              </div>
            </div>

            <div class="order-content">
              <div class="price-row">
                <span class="label">订单金额：</span>
                <span class="value">¥{{ order.originalAmount }}</span>
              </div>
              <div v-if="order.couponDiscount" class="price-row">
                <span class="label">优惠金额：</span>
                <span class="value discount">-¥{{ order.couponDiscount }}</span>
              </div>
              <div class="price-row">
                <span class="label">实付金额：</span>
                <span class="value final">¥{{ order.totalAmount }}</span>
              </div>
            </div>

            <div class="order-footer">
              <div class="time-info">
                <van-icon name="clock-o" />
                <span>{{ getTimeText(order) }}</span>
                <span class="time">{{ getTimeValue(order) }}</span>
              </div>
              <!-- 待支付订单显示取消/去支付按钮 -->
              <div v-if="order.orderStatus === OrderStatus.PENDING" class="action-buttons">
                <van-button
                  size="small"
                  type="default"
                  class="cancel-btn"
                  @click="handleCancelOrder(order)"
                >
                  取消订单
                </van-button>
                <van-button
                  size="small"
                  type="primary"
                  class="pay-btn"
                  @click="handleContinuePay(order)"
                >
                  去支付
                </van-button>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <van-empty
            v-if="!loading && !refreshing && orderList.length === 0"
            description="暂无订单"
            image="search"
          />
        </van-list>
      </van-pull-refresh>
    </div>
  </app-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast, showConfirmDialog, showLoadingToast, closeToast, showDialog } from 'vant'
import AppLayout from '@/components/AppLayout.vue'
import AppHeader from '@/components/AppHeader.vue'
import { getOrderList, closeOrder, continuePay } from '@/api/order'
import { formatDateTime } from '@/utils/format'
import { isWechat, waitForWxJSBridge } from '@/utils/wechat'
import type { Order } from '@/types/order'
import { OrderStatus } from '@/types/order'
import type { WxPayConfig } from '@/types/payment'

const orderList = ref<Order[]>([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageNum = ref(1)
const pageSize = 10
const total = ref(0)
const activeTab = ref<number>(-1) // -1 表示全部
// 顶部自定义导航栏高度为 56px，如后续调整，请同步修改此偏移
const stickyOffset = 56

// 获取订单状态样式类
const getOrderStatusClass = (status: OrderStatus) => {
  const classMap = {
    [OrderStatus.PENDING]: 'pending',
    [OrderStatus.PAID]: 'completed',
    [OrderStatus.CANCELLED]: 'cancelled',
    [OrderStatus.REFUNDED]: 'refunded'
  }
  return classMap[status] || 'pending'
}

// 获取时间文本
const getTimeText = (order: Order) => {
  if (order.orderStatus === OrderStatus.PAID && order.paidTime) {
    return '支付时间：'
  }
  return '下单时间：'
}

// 获取时间值
const getTimeValue = (order: Order) => {
  if (order.orderStatus === OrderStatus.PAID && order.paidTime) {
    return formatDateTime(order.paidTime)
  }
  return formatDateTime(order.orderTime)
}

// 获取订单列表
const fetchOrders = async (isRefresh = false) => {
  try {
    const params: any = {
      pageNum: pageNum.value,
      pageSize: pageSize
    }

    // 如果选择了具体状态，添加 orderStatus 参数
    if (activeTab.value !== -1) {
      params.orderStatus = activeTab.value
    }

    const res = await getOrderList(params)
    
    const data = res.data || res
    const orders = data.rows || []
    total.value = data.total || 0

    if (isRefresh) {
      orderList.value = orders
    } else {
      orderList.value = [...orderList.value, ...orders]
    }

    // 判断是否还有更多数据
    if (orderList.value.length >= total.value) {
      finished.value = true
    }

    console.log('订单列表:', orderList.value)
    console.log(`已加载 ${orderList.value.length}/${total.value} 条`)
  } catch (error) {
    console.error('获取订单列表失败:', error)
    showToast({
      message: '获取订单列表失败',
      position: 'top'
    })
    // 如果是第一次加载失败，标记为已完成，避免一直加载
    if (pageNum.value === 1) {
      finished.value = true
    }
  }
}

// 加载更多
const onLoad = async () => {
  loading.value = true
  try {
    await fetchOrders(false)
    pageNum.value++
  } finally {
    loading.value = false
  }
}

// 下拉刷新
const onRefresh = async () => {
  pageNum.value = 1
  finished.value = false
  try {
    await fetchOrders(true)
    pageNum.value = 2 // 刷新后页码从 2 开始
    showToast({
      message: '刷新成功',
      position: 'top',
      duration: 1500
    })
  } finally {
    refreshing.value = false
  }
}

// Tab 切换
const onTabChange = () => {
  // 重置列表
  orderList.value = []
  pageNum.value = 1
  finished.value = false
  loading.value = false
  
  // 加载新数据
  onLoad()
}

// 取消订单
const handleCancelOrder = async (order: Order) => {
  try {
    // 弹出确认对话框（showConfirmDialog 自动挂载到 body）
    await showConfirmDialog({
      title: '确认取消',
      message: `确定要取消订单吗？\n订单号：${order.outTradeNo}`,
      confirmButtonText: '确认取消',
      cancelButtonText: '我再想想',
      confirmButtonColor: '#ff6b6b',
    })

    // 显示加载提示
    showLoadingToast({
      message: '取消中...',
      forbidClick: true,
      duration: 0
    })
    console.log('取消订单:', order.outTradeNo)
    // 调用取消订单接口
    await closeOrder(order.outTradeNo)

    closeToast()

    // 显示成功提示
    showToast({
      message: '订单已取消',
      position: 'top',
      duration: 2000
    })

    // 刷新订单列表
    setTimeout(() => {
      onRefresh()
    }, 500)
  } catch (error: any) {
    closeToast()
    
    // 用户点击了取消按钮，不显示错误
    if (error === 'cancel') {
      return
    }

    console.error('取消订单失败:', error)
    showToast({
      message: error.message || '取消订单失败',
      position: 'top'
    })
  }
}

// 调用微信支付
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

// 继续支付（去支付）
const handleContinuePay = async (order: Order) => {
  try {
    // 显示加载提示
    showLoadingToast({
      message: '正在拉起支付...',
      forbidClick: true,
      duration: 0
    })

    // 调用继续支付接口
    const res = await continuePay(order.outTradeNo)
    const payData = res.data || res

    console.log('继续支付响应数据:', payData)

    // 检查响应状态
    if (payData.code !== 'SUCCESS') {
      closeToast()
      showToast({
        message: payData.message || '获取支付参数失败',
        position: 'top'
      })
      return
    }

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

    // 调起微信支付
    await invokeWxPay(wxPayConfig)

    // 支付成功
    closeToast()
    showDialog({
      title: '支付成功',
      message: `订单号：${payData.outTradeNo}`,
      confirmButtonText: '确定'
    }).then(() => {
      // 刷新订单列表
      onRefresh()
    })
  } catch (error: any) {
    closeToast()
    
    const errorMsg = error.message || '支付失败'
    if (errorMsg === '用户取消支付') {
      showToast({
        message: '已取消支付',
        position: 'top'
      })
    } else {
      console.error('支付失败:', error)
      showToast({
        message: errorMsg,
        position: 'top'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.orders-page {
  min-height: calc(100vh - 56px);
  background: #f5f7fa;

  // Tabs 样式
  :deep(.van-tabs) {
    background: #fff;
    margin-bottom: 12px;

    .van-tab {
      font-size: 14px;
      color: #666;

      &--active {
        color: #00b894;
        font-weight: 600;
      }
    }

    .van-tabs__line {
      background: #00b894;
    }
  }

  :deep(.van-pull-refresh) {
    padding: 0 16px 60px;
    min-height: calc(100vh - 88px);
  }

  :deep(.van-pull-refresh__track) {
    min-height: calc(100vh - 88px);
  }
}

.order-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;

  &:active {
    transform: scale(0.98);
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;

    .order-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .order-status {
      font-size: 13px;
      padding: 4px 12px;
      border-radius: 12px;
      
      &.completed {
        background: #e8f8f5;
        color: #00b894;
      }

      &.pending {
        background: #fff3e0;
        color: #ff9500;
      }

      &.cancelled {
        background: #f5f5f5;
        color: #999;
      }
    }
  }

  .order-content {
    margin-bottom: 12px;

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .label {
        font-size: 14px;
        color: #666;
      }

      .value {
        font-size: 14px;
        color: #333;

        &.discount {
          color: #00b894;
        }

        &.final {
          font-size: 18px;
          font-weight: 600;
          color: #ff6b6b;
        }
      }
    }
  }

  .order-info {
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;

    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      font-size: 13px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        color: #999;
        margin-right: 8px;
      }

      .value {
        color: #666;
        flex: 1;
        word-break: break-all;
      }
    }
  }

  .order-footer {
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;

    .time-info {
      display: flex;
      align-items: center;
      font-size: 13px;
      color: #999;
      margin-bottom: 12px;

      .van-icon {
        margin-right: 4px;
        font-size: 14px;
      }

      .time {
        margin-left: 8px;
        color: #666;
      }
    }

    .action-buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;

      .cancel-btn {
        border-color: #ff6b6b;
        color: #ff6b6b;
        
        &:active {
          background: #fff5f5;
        }
      }

      .pay-btn {
        background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
        border: none;
        
        &:active {
          opacity: 0.8;
        }
      }
    }
  }
}

// 订单状态样式
.order-status {
  &.pending {
    background: #fff3e0;
    color: #ff9500;
  }

  &.refunded {
    background: #f5f5f5;
    color: #999;
  }
}
</style>

