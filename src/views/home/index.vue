<template>
  <app-layout>
    <app-header title="时机AI圈主神器" />
    
    <div class="home-page">
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
            <span class="value expired">已过期</span>
          </div>
          <div class="vip-info-item">
            <span class="label">永久训练卡</span>
            <span class="value">1 张</span>
          </div>
        </div>

        <!-- 装饰元素 -->
        <div class="decoration decoration-1"></div>
        <div class="decoration decoration-2"></div>
      </div>

      <!-- 选择购买 -->
      <div class="section-title">选择购买</div>

      <!-- VIP 套餐 -->
      <div class="product-card">
        <div class="product-header">
          <div class="product-title">VIP会员月度套餐</div>
          <div class="product-price">
            <span class="price-num">39.9</span>
            <span class="price-unit">元</span>
          </div>
          <van-button 
            type="primary" 
            size="small" 
            round
            class="buy-btn"
            @click="handleBuy('vip', 39.9)"
          >
            购买
          </van-button>
        </div>

        <van-radio-group v-model="vipOption">
          <div class="option-item">
            <van-radio name="1">每天领取100枚合训训练卡</van-radio>
          </div>
          <div class="option-item">
            <van-radio name="2">人岗匹配新闻权</van-radio>
          </div>
        </van-radio-group>
      </div>

      <!-- 永久训练卡 -->
      <div class="product-card">
        <div class="product-header-simple">
          <div class="product-title">永久训练卡</div>
        </div>
        
        <div class="product-desc">
          使用训练卡参与模拟面试、只真简历和和模拟训练
        </div>

        <van-radio-group v-model="cardOption">
          <div class="option-item">
            <van-radio name="forever">永久有效</van-radio>
          </div>
        </van-radio-group>

        <div class="card-items">
          <div class="card-item">
            <div class="card-item-info">
              <div class="card-name">永久训练卡 1张</div>
              <div class="card-price">
                <span class="price-num">9.9</span>
                <span class="price-unit">元</span>
              </div>
            </div>
            <van-button 
              type="warning" 
              size="small" 
              round
              class="buy-btn"
              @click="handleBuy('card1', 9.9)"
            >
              购买
            </van-button>
          </div>

          <div class="card-item">
            <div class="card-item-info">
              <div class="card-name">永久训练卡 10张</div>
              <div class="card-price">
                <span class="price-num">59.9</span>
                <span class="price-unit">元</span>
              </div>
            </div>
            <van-button 
              type="warning" 
              size="small" 
              round
              class="buy-btn"
              @click="handleBuy('card10', 59.9)"
            >
              购买
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import AppHeader from '@/components/AppHeader.vue'

const vipOption = ref('1')
const cardOption = ref('forever')

const handleBuy = (type: string, price: number) => {
  console.log('购买:', type, price)
  // TODO: 调用支付接口
}
</script>

<style scoped lang="scss">
.home-page {
  padding: 16px;
  padding-bottom: 60px;
  background: #f5f7fa;
  min-height: calc(100vh - 46px);
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

