<template>
  <app-layout>
    <app-header title="我的订单" />
    
    <div class="orders-page">
      <van-pull-refresh 
        v-model="refreshing" 
        @refresh="onRefresh"
        :pulling-text="'下拉刷新'"
        :loosing-text="'释放刷新'"
        :loading-text="'加载中...'"
      >
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div 
            v-for="order in orderList" 
            :key="order.id" 
            class="order-card"
          >
            <div class="order-header">
              <span class="order-title">{{ order.productName }}</span>
              <span :class="['order-status', order.statusClass]">
                {{ order.statusText }}
              </span>
            </div>

            <div class="order-content">
              <div class="price-row">
                <span class="label">订单金额：</span>
                <span class="value">{{ order.originalPrice }}</span>
              </div>
              <div class="price-row">
                <span class="label">优惠金额：</span>
                <span class="value discount">{{ order.discountPrice }}</span>
              </div>
              <div class="price-row">
                <span class="label">实付金额：</span>
                <span class="value final">{{ order.actualPrice }}</span>
              </div>
            </div>

            <div class="order-footer">
              <div class="expire-info">
                <van-icon name="clock-o" />
                <span>已完成</span>
                <span class="expire-time">{{ order.expireTime }}</span>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <van-empty
            v-if="!loading && orderList.length === 0"
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
import AppLayout from '@/components/AppLayout.vue'
import AppHeader from '@/components/AppHeader.vue'

interface Order {
  id: number
  productName: string
  originalPrice: string
  discountPrice: string
  actualPrice: string
  statusText: string
  statusClass: string
  expireTime: string
}

const orderList = ref<Order[]>([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)

// 模拟数据
const mockOrders = [
  {
    id: 1,
    productName: '购买 VIP月度套餐',
    originalPrice: '39.9',
    discountPrice: '20',
    actualPrice: '19.9',
    statusText: '已完成',
    statusClass: 'completed',
    expireTime: '2025-01-01 10:00:00'
  },
  {
    id: 2,
    productName: '购买 永久训练卡 10张',
    originalPrice: '59.9',
    discountPrice: '0',
    actualPrice: '59.9',
    statusText: '已完成',
    statusClass: 'completed',
    expireTime: '2025-01-02 15:30:00'
  },
  {
    id: 3,
    productName: '购买 永久训练卡 1张',
    originalPrice: '9.9',
    discountPrice: '0',
    actualPrice: '9.9',
    statusText: '已完成',
    statusClass: 'completed',
    expireTime: '2025-01-03 09:20:00'
  }
]

// 加载更多
const onLoad = () => {
  // TODO: 调用接口获取订单列表
  setTimeout(() => {
    if (page.value === 1) {
      orderList.value = [...mockOrders]
      page.value++
    } else if (page.value === 2) {
      // 模拟第二页数据
      orderList.value = [
        ...orderList.value,
        ...mockOrders.map(item => ({
          ...item,
          id: item.id + 10
        }))
      ]
      page.value++
    } else {
      finished.value = true
    }
    loading.value = false
  }, 1000)
}

// 下拉刷新
const onRefresh = () => {
  // TODO: 调用接口刷新订单列表
  setTimeout(() => {
    page.value = 1
    finished.value = false
    orderList.value = []
    refreshing.value = false
    onLoad()
  }, 1000)
}
</script>

<style scoped lang="scss">
.orders-page {
  min-height: calc(100vh - 56px);
  background: #f5f7fa;
  padding: 16px;
  padding-bottom: 60px;

  :deep(.van-pull-refresh) {
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

  .order-footer {
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;

    .expire-info {
      display: flex;
      align-items: center;
      font-size: 13px;
      color: #999;

      .van-icon {
        margin-right: 4px;
        font-size: 14px;
      }

      .expire-time {
        margin-left: auto;
        color: #666;
      }
    }
  }
}
</style>

