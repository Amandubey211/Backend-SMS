
import React from 'react';

const ChildProfile = ({ children }) => {
  if (!children || children.length === 0) {
    return <div>No children data available</div>;
  }
  console.log('Children data:', children);

  return (
  <>
 
    <div className="flex flex-col  gap-4 mt-2  ">
      {children.map((child, index) => (
        <div className='flex flex-col text-center border border-gray-300 rounded-md items-center justify-around  mx-5 py-5 gap-3  ' >
        <div >
        <img
            src={child.imageUrl}
            alt={child.name}
            className="w-24 h-24 rounded-full object-cover "
          /> 
        </div>
        <h2 className='font-medium' >{child.name}</h2>
        <div className='flex gap-2  ' >
            <span className='text-gray-500'> Id: </span>
            <span className='font-medium text-gray-800' >{child.id}</span>
            <span className='text-gray-500'> Class </span>
            <span className='font-medium text-gray-800'>{child.class}  </span>
            <span className='text-gray-500'>Section</span>
            <span className='font-medium text-gray-800'>  {child.section}</span>
        </div>
        
        <div>
        <button className=" border p-2 w-[300px] rounded bg-pink-100 text-center flex justify-center items-center  ">
        <span className="font-semibold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
        View Profile
                  </span>
                  </button>
        </div>
    </div>
      ))}
    </div>

{/* <div className='flex flex-col text-center border rounded-sm items-center justify-around  mx-5 py-5 gap-3  ' >
    <div >
        <img  
         className="w-24 h-24 rounded-full object-cover "

        src='https://filmfare.wwmindia.com/content/2023/mar/shraddhakapoor11677836769.jpg' />
    </div>
    <h2 className='font-medium' >shraddha kapoor</h2>
    <div className='flex gap-2  ' >
        <span className='text-gray-500'> Id: </span>
        <span className='font-medium text-gray-800' > 01  </span>
        <span className='text-gray-500'> Class </span>
        <span className='font-medium text-gray-800'> 08 </span>
        <span className='text-gray-500'>Section</span>
        <span className='font-medium text-gray-800'>  A</span>
    </div>
    
    <div>
        <button>View Profile</button>
    </div>
</div> */}


</>
    
  );
};

export default ChildProfile;