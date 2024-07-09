import React, { useState } from 'react'
import Sidebar from './Sidebar'
import logo from '../../Assets/HomeAssets/StudentDiwanLogo.png'
import { RxCross2 } from 'react-icons/rx'

export default function NotificationBar() {
  const [notiarray,setNotiarray] = useState([1,2,3,4,5,6])
 const removeNotification = (removeItem)=>{
  setNotiarray(notiarray.filter((item) => item !== removeItem));
 }
  return (
    <div >
        {/* <Sidebar isOpen={isOpen} onClose={onClose} title={'Recent Notifications'} > */}
        <div className="  w-full h-[85vh] overflow-y-scroll  ">
     
        {
notiarray.map((i,index)=>(
  <div className='flex w-[90%] flex-row border my-4 items-center  justify-center w-[100%]  h-[10rem] p-2 relative ' id='children' key={i}>
       <button  className="p-1 m-1 opacity-70 absolute top-0 right-0" onClick={()=>removeNotification(i)}>
            <RxCross2 className="text-xl"  />
          </button>
  <div className='w-[20%] flex  '>
    <img src={logo} alt='notication' className='w-[100%]'/>
  </div>
  <div className='w-[75%]'>
    <p>{i}</p>
    <h1 className='font-bold '>Teacher: Dyno</h1>
    <p className='text-gray-500'>new assignment created english story
    </p>
  </div>


</div>
))

        }
        
        </div>
        <p className='text-purple-500' onClick={()=>setNotiarray([])}>Clear All Notification</p>
         {/* </Sidebar> */}
    </div>

  )
}

