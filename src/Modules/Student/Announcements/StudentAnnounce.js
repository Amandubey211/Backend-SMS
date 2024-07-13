import React,{useEffect, useState} from 'react'
import Announce from './Announce'
import Layout from '../../../Components/Common/Layout';
import DashLayout from '../../../Components/Student/StudentDashLayout';
import { MdQueryBuilder } from "react-icons/md";
// import { notices } from '../studentDummyData/studentDummyData';

const StudentAnnounce = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [notices,setNotices]=useState([])
 
useEffect(()=>{
  const fetchNotices=async()=>{
      try {
          const token =localStorage.getItem('student:token')
          if(!token){
            throw new Error ('Authentication not found')
          }
          // const response= await fetch('http://localhost:8080/student/all/notices',{
            const response= await fetch('http://localhost:8080/admin/all/notices',{

            
            
            headers:{
              // 'Authorization': token
              'Authentication': token

            }
          })
          if(!response.ok){
            throw new Error(`Failed to fetch notices, status: ${response.status}`);

          }
          const data=await response.json()
          if(data.success && data.notices){
            const formattedNotices = data.notices.map(notice => ({
              ...notice,
              startDate: new Date(notice.startDate),
              endDate: new Date(notice.endDate)
            }));
            console.log("Formatted notices:", formattedNotices);
            setNotices(formattedNotices);
          }else{
            console.log("No notices data or unsuccessful response");

          }
      } catch (error) {
        console.error("Failed to fetch notices:", error);

      }
  }
  fetchNotices()
},[])

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <Layout title="Event">
        <DashLayout>
          <div className="p-4  ">
            <h1 className="mb-2 bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent font-semibold bg-clip-text">
              Student Notice board
            </h1>
            <div className="flex p-[10px]  justify-between ">
              <div className="flex gap-4  ">
                <input
                  type="text"
                  placeholder="Search by Notice"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className=" p-2 border rounded w-[250px] "
                />
                <button className=" border w-[100px] rounded bg-pink-100 text-center flex justify-center items-center  ">
                  <span className="font-semibold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
                    Search
                  </span>
                </button>
               
              </div>

              <div>
            
              </div>
            </div>

            <div className="   mt-5  rounded-lg overflow-auto">
              {filteredNotices.map((notice, index) => (
                <div key={notice.id} className="border  ">
                  <div
                    className={`cursor-pointer   p-2   flex flex-col   'bg-white'}`}
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="flex gap-6 px-3 py-2">
                      {/* <img className=" h-10 w-10 " src="https://via.placeholder.com/40" alt="notice-image" /> */}
                      <img
                        className=" h-10 w-10  rounded "
                        src='https://www.adobe.com/content/dam/www/us/en/events/overview-page/eventshub_evergreen_opengraph_1200x630_2x.jpg'
                        // src={notice.imageUrl}
                        alt="notice-image"
                      />

                      <div className="flex flex-col gap-3 mt-[-5px]">
                        <h2
                          className=" font-[500]  text-[#4D4D4D] "
                          style={{ fontStyle: "inter" }}
                        >
                          {notice.title}
                        </h2>

                        <div className="flex flex-row gap-[50px] text-xs">
                          <div className="flex   flex-wrap  justify-center items-center  ">
                            
                          
                            <MdQueryBuilder
                              style={{
                                color: "gray",
                               
                              }}
                              className=" text-gray-400 text-xl"
                            />

                            <span className=" text-sm p-1 font-[400] text-[#7F7F7F] ">
                              July 25,2014
                            </span>
                          </div>
                          <div className="px-2 text-xs bg-pink-100 text-center flex justify-center items-center">
                            <span
                              className={` ${
                                notice.priority === "High Priority"
                                  ? "  font-semibold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text"
                                  : "text-blue-500 font-bold "
                              }`}
                            >
                              {notice.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {activeIndex === index && (
                      <div className="p-2 text-[#4D4D4D] ">
                        <p>{notice.description}</p>
                      </div>
                    )}
                  </div>
                </div>

               
              ))}
            </div>
          </div>
        </DashLayout>
      </Layout>
    </>
  );
}

export default StudentAnnounce


