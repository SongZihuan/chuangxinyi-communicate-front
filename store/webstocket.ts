import { ref } from 'vue';
import { defineStore } from 'pinia';
import {ElMessage} from 'element-plus';
import {useSocket} from '~/common/useWebstocket'
import { useAuthStore } from '~/store/auth'
import { useMsgStore } from '~/store/msg'

export const useSocketStore = (nuxtApp: any) => {
	const msgStore = useMsgStore();
  const authStore = useAuthStore()
  const token = authStore.centerToken

	return defineStore("socket", () => {
		let isConnected = ref(false)
		let message = ref("")
		let reconnectError = ref(false)
		let heartBeatInterval = ref(50000)
		let heartBeatTimer = ref(0)
		let socketInstance = ref(null)
		let orderData = ref([])
		let tokenStatus = ref(false)
		let sendTokenStatus = ref(false)
		let orderDataFinishStatus = ref(null)

		const resetState = () => {
			isConnected.value = false;
			message.value = '';
			reconnectError.value = false;
			heartBeatInterval.value = 50000;
			heartBeatTimer.value = 0;
			socketInstance.value = null;
			orderData.value = [];
			tokenStatus.value = false;
			localStorage.setItem('socketStatus', 'false');
		}

		const SOCKET_ONOPEN = (event: any) => {
			socketInstance.value = event.currentTarget;
			isConnected.value = true;
      useSocketStore().sendMessage("TOKEN", {
        data: JSON.stringify({
          Token: token,
        }),
      });
		}

		const SOCKET_ONCLOSE = () => {
			isConnected.value = false;
			// 连接关闭时停掉心跳消息
			window.clearInterval(heartBeatTimer.value);
			heartBeatTimer.value = 0;
		}

		const SOCKET_ONERROR = () => {
			resetState();
			useSocket();
		}

		// 收到服务端发送的消息
		const SOCKET_ONMESSAGE = async (msg: any) => {
			if (msg.code === "PONG" && tokenStatus.value == false) {
				bindTokenCallback();
			} else if (msg.code === "BAD_TOKEN" || msg.code === "LOGOUT") {
        await nuxtApp.runWithContext(async ()=>{
          const { centerToken } = useAuthStore()
          if (centerToken) {
            process.client && ElMessage.error("登录过期，请重新登录")
          }

          await authStore.logout()

          sendMessageNow(MessageTypeEnum.BYE);
          (socketInstance.value as any).close()
          resetState();
        })
			} else if (msg.code === "BAD_DATA" || msg.code === "BAD_TOKEN") {
				ElMessage.error("WebSocket 错误")
			} else if (msg.code === "NEW_MESSAGE" || msg.code === "READ_MESSAGE") {
				await msgStore.setMessageList();
			}

			message.value = msg;
		}
		// 自动重连
		const SOCKET_RECONNECT = () => {
			// console.info("消息系统重连中...", count);
		}
		// 重连错误
		const SOCKET_RECONNECT_ERROR = () => {
			reconnectError.value = true;
		}
		// 发送消息
		const sendMessage = (code: any, options?: any) => {
			if (!socketInstance.value) {
				setTimeout(() => {
					sendMessage(code, options);
				}, 1500);
				return;
			}
			if (code === "TOKEN") {
				sendTokenStatus.value = true;
			}

			(socketInstance.value as any).sendObj({
				code: code,
				...options,
			});
		}
		const sendMessageNow = (code: any, options?: any) => {
			if (code === "TOKEN") {
				sendTokenStatus.value = true;
			}

			(socketInstance.value as any).sendObj({
				code: code,
				...options,
			});
		}
		// 绑定token的回调
		const bindTokenCallback = async () => {
      sendMessage("GET_MESSAGE");

			isConnected.value = true;
			tokenStatus.value = true;
			// 连接成功时启动定时发送心跳消息，避免被服务器断开连接
			heartBeatTimer.value = window.setInterval(() => {
				const message = 'PING';
				isConnected &&
				(socketInstance.value as any).sendObj({
					code: message,
				});
			}, heartBeatInterval.value);
		}

		return {
			isConnected,
			message,
			reconnectError,
			heartBeatInterval,
			heartBeatTimer,
			orderData,
			tokenStatus,
			socketInstance,
			sendTokenStatus,
			orderDataFinishStatus,

			resetState,
			SOCKET_ONOPEN,
			SOCKET_ONCLOSE,
			SOCKET_ONERROR,
			SOCKET_ONMESSAGE,
			SOCKET_RECONNECT,
			SOCKET_RECONNECT_ERROR,
			sendMessage,
			sendMessageNow,
			bindTokenCallback,
		}
	})()
}
