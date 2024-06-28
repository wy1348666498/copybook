import { defineConfig } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import UnoCSS from 'unocss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    resolve: {
      // 设置别名
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    esbuild: {
      // 判断是否为生产环境
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
    plugins: [Uni(), UnoCSS()],
  }
})
