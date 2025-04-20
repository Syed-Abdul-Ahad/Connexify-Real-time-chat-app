import { useState, useEffect, useRef } from "react";
import { Users, PlusIcon} from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";



const Sidebar = () => {

  const [isPopupVisible, setPopupVisible] = useState(false);

  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const {onlineUsers} = useAuthStore()

  const emailRef = useRef(null)

  const handleAddUser = async ()=>{
    const data = {email: emailRef.current.value}
    try{
      console.log(data,"before sending")
      const res = await axiosInstance.post("/messages/addUser",data)
      toast.success(res.data.message)
    }catch(err){
      toast.error(err.response?.data?.message || "Something went wrong");
      console.log(err)
    }
  }

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
          <div className="add-user" onClick={()=>setPopupVisible(true)}><PlusIcon className="lg:ml-28 size-6 cursor-pointer"/></div>
        </div>
      </div>

            {/* Popup Modal */}
            {isPopupVisible && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 w-80 bg-base-300 p-5 rounded-lg shadow-lg flex flex-col gap-7">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Add User</h2>
            <button onClick={() => setPopupVisible(false)} className="text-xl">&times;</button>
          </div>
          <div className="flex flex-col items-center gap-5">
              <input className="input h-9 input-bordered w-full pl-10 email" ref={emailRef} placeholder="Enter email here" type="text" />
              <button type="submit" onClick={handleAddUser} className="btn btn-primary w-full h-4">Submit</button>
          </div>
          <div className="mt-4">
          </div>
        </div>
      )}


      <div className="overflow-y-auto w-full py-3">
        {users.map((user,index) => {
          return <button 
          key={user._id}
          onClick={()=>setSelectedUser(user)}
          className={`
            w-full p-3 flex items-center gap-3
            hover:bg-base-300 transition-colors
            ${selectedUser?._id===user._id ? "bg-base-300 ring-1 ring-base-300": ""}
            selected-user-${index}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
                <img 
                src={user.profilePic || "/avatar.png"}
                alt="pic"
                className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                        <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"></span>
                )}

            </div>

            <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName.split(' ')[0]}</div>
                <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online":"Offline"}
                </div>
            </div>
          </button>
        })}
      </div>

    </aside>
  );
};

export default Sidebar;
