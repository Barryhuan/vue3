//~ vite配置文件
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
export default defineConfig({
	// ~ 插件
	plugins: [vue()],
	// ~ 自定义路径
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'), // ~ 指向src文件夹，
			'@api': resolve(__dirname, 'src/api'), // ~ 指向api文件夹
			'@assets': resolve(__dirname, 'src/assets'), // ~ 指向静态资源文件
			'@img': resolve(__dirname, 'src/assets/images'), // ~ 指向图片资源
			'@style': resolve(__dirname, 'src/assets/style'), // ~ 指向样式资源
			'@views': resolve(__dirname, 'src/views'), // ~ 指向样式资源
		},
	},
	// ~ 基础路径
	base: './',
	// ~ 配置本地服务器
	server: {
		port: 4000,
		open: !0,
		cors: !0,
	},
	// ~ 导入less全局变量
	css: {
		// ~ 预处理配置
		preprocessorOptions: {
			// ~ less
			less: {
				modifyVars: {
					hack: `true; @import (reference) "${ resolve('src/assets/style/mixin.less')}";`,
				},
				javascriptEnabled: !0
			}
		}
	},
	// ~ 打包配置
	build: {
		assetsDir: 'static/img/', // ~ 静态资源路径
		rollupOptions: {
			output: {
				chunkFileNames: 'static/js/[name]-[hash].js', // ~ 其他js文件
				entryFileNames: 'static/js/[name]-[hash].js', // ~ 入口文件
				assetFileNames: 'static/[ext]/[name]-[hash].[ext]', // ~ 其他样式和字体文件
			}
		},
		brotliSize: !1, // ~ 取消计算打包速度
		// ~ 简洁配置
		terserOptions: {
			// ~ 压缩配置
			compress: {
				drop_console: !0,
				drop_debugger: !0
			}
		}
	}
})
