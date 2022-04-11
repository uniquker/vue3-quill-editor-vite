import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"
// import { resolve } from 'path' // 主要用于alias文件路径别名

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  // 打包配置
  build: {
		// input: 'src/components/main.js',
    lib: {
      entry: 'src/components/quill-editor/index.js',
      name: 'vue3-quill-editor',
      fileName: (format) => `vue3-quill-editor.${format}.js`
    },
    sourcemap: true,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
