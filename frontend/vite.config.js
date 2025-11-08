import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Nếu cổng 5173 bị chiếm, sẽ báo lỗi thay vì tự động chuyển sang cổng khác
    host: 'localhost', // Chỉ cho phép truy cập từ localhost
    open: false, // Không tự động mở trình duyệt
  },
  preview: {
    port: 5173,
    strictPort: true,
    host: 'localhost', // Chỉ cho phép truy cập từ localhost
  },
})
