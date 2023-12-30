import VueNativeSock from 'vue-native-websocket-vue3';
import {useSocketStore} from '~/store/webstocket'
import { useAuthStore } from '~/store/auth'

export const useSocket = (nuxtApp: any) => {
	const socketStore = useSocketStore();
  const authStore = useAuthStore()

  if (process.server) return;

  if (!authStore.centerToken) return;

	if (socketStore.isConnected) return;

	socketStore.resetState();

  const runtimeConfig = useRuntimeConfig()

  nuxtApp.vueApp.use(VueNativeSock, runtimeConfig.public.CENTER_WS_URL, {
		// 启用pinia集成 | enable pinia integration
		store: socketStore,
		// 数据发送/接收使用使用json
		format: 'json',
		// 开启手动调用 connect() 连接服务器
		connectManually: false,
		// 开启自动重连
		reconnection: true,
		// 尝试重连的次数
		reconnectionAttempts: -1,
		// 重连间隔时间
		reconnectionDelay: 3000,
	});
	// 监听页面刷新
	socketStore.sendTokenStatus = false;
};
