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
		preprocessorOptions: {
			less: {
				modifyVars: {
					hack: `true; @import (reference) "${ resolve('src/assets/style/mixin.less')}";`,
				},
				javascriptEnabled: !0
			}
		}
	},
})
