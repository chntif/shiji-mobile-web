import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 统一使用 /frontend/ 子路径（开发和生产环境）
  // 这样通过 Nginx 代理访问时路径才能正确匹配
  const base = '/frontend/'

  return {
    base, // 设置基础路径

    plugins: [
      vue(),
      vueDevTools(),
      Components({
        resolvers: [VantResolver()],
      }),
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },

    server: {
      allowedHosts: ['www.shiji.morgen-ai.com'],
      proxy: {
        '/api': {
          target: 'https://www.shiji.morgen-ai.com/prod-api/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },

    build: {
      // 生成的静态资源在 /frontend/ 下
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  }
})
