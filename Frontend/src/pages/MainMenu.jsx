import React from 'react';
import { useEffect } from 'react';
import {
  FileText,
  Text,
  Repeat,
  CircleArrowOutUpLeft, 
  Mic
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MainMenu = ({children}) => {
  const navigate=  useNavigate();
  const user = useSelector((store)=>store?.user);



useEffect(() => {
  if (!user) navigate("/login");
}, [user, navigate]);


  const Logout =  async()=>{
    try {

       await axios.post(import.meta.env.VITE_BASE_URL+"/auth/logout",{},{withCredentials:true})
       navigate("/")
    } catch (error) {
      if(error?.response?.status === 401) return navigate("/login");

    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

      <div className="w-[20%] min-h-screen bg-black/30 backdrop-blur border-r border-white/10">
        <div className="border-b border-white/20 py-5 px-5">
          <h1 className="font-bold text-2xl text-white">EchoMind</h1>
          <p className="text-slate-400 text-xs">AI Audio Intelligence</p>
        </div>
        <div className="flex flex-col gap-4 px-5 py-6 text-white">
          <button onClick={()=>navigate("/audio-to-text")} className="flex items-center gap-3 text-left font-semibold text-sm text-slate-200  border p-3 rounded-2xl border-transparent hover:bg-white/10 focus:bg-blue-500/10 transition-all duration-300">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-blue-950/80`}>
              <Text className="w-6 h-6 text-white" />
            </div>
            Audio To Text
          </button>

         <button
         onClick={()=>navigate("/audio-to-summary")}
         className="flex items-center gap-3 text-left font-semibold text-sm text-slate-200  border p-3 rounded-2xl border-transparent hover:bg-white/10 focus:bg-green-500/20 transition-all duration-300">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-green-500/10 `}>
              <FileText  className="w-6 h-6 text-green-400 " />
            </div>
            Audio Summary
          </button>

          <button 
           onClick={()=>navigate("/audio-to-audio")}
          className="flex items-center gap-3 text-left font-semibold text-sm text-slate-200  border p-3 rounded-2xl border-transparent hover:bg-purple-500/20 focus:bg-blue-500/20 transition-all duration-300">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-purple-500/10`}>
              <Repeat className="w-6 h-6 text-purple-400 " />
            </div>
            Audio To Audio
          </button>


          

<button 
           //onClick={Logout}
             onClick={()=>navigate("/pdfPodCast")}
          className="flex items-center gap-3 text-left font-semibold text-sm text-slate-200  border p-3 rounded-2xl border-transparent hover:bg-purple-500/40 focus:bg-purple-500/30 transition-all duration-300">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-purple-500/70`}>
              <Mic  className="w-6 h-6" />
            </div>
            Pdf To PodCast
          </button>

          <button 
           onClick={Logout}
          className="flex items-center gap-3 text-left font-semibold text-sm text-slate-200  border p-3 rounded-2xl border-transparent hover:bg-red-500/20 focus:bg-red-500/20 transition-all duration-300">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/40`}>
              <CircleArrowOutUpLeft  className="w-6 h-6 text-purple-400 " />
            </div>
            Logout
          </button>

        </div>
      </div>

      {/* Main Content Area */}
      {/* <div className="flex-1 p-10 text-white">
        <h2 className="text-3xl font-semibold mb-4">Audio to Text</h2>
        <p className="text-gray-300">Upload your audio file to convert it into text.</p>
      </div> */}

      <div className="flex-1 p-10 text-white">
        {children}
      </div>
    
    </div>
  );
};

export default MainMenu;
