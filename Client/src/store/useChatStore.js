import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import { useAuthStore } from "./useAuthStore"




export const useChatStore = create((set, get)=>({
    messages: [],
    users:[],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async ()=>{
      set({isUsersLoading: true});
      try{
        const res = await axiosInstance.get("/messages/users")
        set({users: res.data.data.users})
      }
      catch(err){
        toast.error(err.response)
      }
      finally{
        set({isUsersLoading:false})
      }
    },

    getMessages: async(userId)=>{
        set({isMessagesLoading: true})
        try{
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({messages: res.data.data.messages})
        }catch(err){
            toast.error(err.response.data.message)
        }
        finally{
            set({isMessagesLoading: false})
        }
    },

    sendMessage: async(messageData)=>{
        const {selectedUser, messages} = get()
        try{
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
          set({messages: [...messages, res.data.data.newMessage]})
        }
        catch(err){
          toast.error(err.response.data.message)
        }
    },

    subscribeToMessages: ()=>{
      const {selectedUser} = get()
      if(!selectedUser){
        return;
      }

      const socket = useAuthStore.getState().socket;


      socket.on("newMessage",(newMessage)=>{

        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
        if(!isMessageSentFromSelectedUser) return;

        set({
          messages: [...get().messages, newMessage]
        })
      })
    },

    unSubscribeFromMessages: ()=>{
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage")
    },

    setSelectedUser: (selectedUser)=>set({selectedUser})

}))
