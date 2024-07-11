import React from 'react'
import Layout from '../../../../../../Components/Common/Layout'
import DashLayout from '../../../../../../Components/Admin/AdminDashLayout'
import MainSection from './MainSection'
import useNavHeading from '../../../../../../Hooks/CommonHooks/useNavHeading '
import { useSelector } from 'react-redux'

const Syllabus = () => {
  const className = useSelector((store) => store.Common.selectedClass);
  const subjectName = useSelector((store) => store.Common.selectedSubject);

  useNavHeading(className, subjectName);
  return (
    <div>
      <Layout title={`Syllabus | Student Diwan `} >
        <DashLayout children={<MainSection/>} hideSearchbar={true}/>
      </Layout>
    </div>
  )
}

export default Syllabus
