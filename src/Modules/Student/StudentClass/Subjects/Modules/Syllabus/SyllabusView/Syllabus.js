import React from 'react'
// import Layout from '../../../../../../Components/Common/Layout'
// import DashLayout from '../../../../../../Components/Admin/AdminDashLayout'
import MainSection from './MainSection'
import { useParams } from 'react-router-dom'
import Layout from '../../../../../../../Components/Common/Layout'
import StudentDashLayout from '../../../../../../../Components/Student/StudentDashLayout'
import useNavHeading from '../../../../../../../Hooks/CommonHooks/useNavHeading '
// import useNavHeading from '../../../../../../Hooks/CommonHooks/useNavHeading '

const Syllabus = () => {
    const { cid, sid } = useParams();
    useNavHeading(cid, sid);
  return (
    <div>
      <Layout title={`Syllabus | Student Diwan `} >
        <StudentDashLayout children={<MainSection/>} hideSearchbar={true}/>
      </Layout>
    </div>
  )
}

export default Syllabus
