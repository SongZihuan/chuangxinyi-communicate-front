import {useMsgApi} from '~/api/msg'

export const useMsgStore = defineStore("msg", ()=>{
  let msgList = ref([])

  const setMessageList = async () => {
    let { data, status } = await useMsgApi().getMessage(1, 3)
    if (status.value === "success" && data.value.code === "SUCCESS") {
      msgList.value = data.value.data.message
    } else {
      console.log("AAA", data.value)
    }
  }

  const pushMessage = (newMessage: any) => {
    msgList.value.unshift(newMessage)
    msgList.value.pop()
  }

  return {
    msgList,

    setMessageList,
    pushMessage,
  }
})
