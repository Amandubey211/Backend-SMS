import React from 'react'
import Layout from '../../../../../../Components/Common/Layout'
import DashLayout from '../../../../../../Components/Admin/AdminDashLayout'
import MainSection from './MainSection'
import { useParams } from 'react-router-dom'
import useNavHeading from '../../../../../../Hooks/CommonHooks/useNavHeading '

const Syllabus = () => {
    const { cid, sid } = useParams();
    useNavHeading(cid, sid);
  return (
    <div>
      <Layout title={`Syllabus | Student Diwan `} >
        <DashLayout children={<MainSection/>} hideSearchbar={true}/>
      </Layout>
    </div>
  )
}

export default Syllabus
