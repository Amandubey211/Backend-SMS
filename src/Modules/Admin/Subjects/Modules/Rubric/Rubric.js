import React from 'react'
import Layout from '../../../../../Components/Common/Layout'
import DashLayout from '../../../../../Components/Admin/AdminDashLayout'
import MainSection from './MainSection'

const Rubric = () => {
  return (
    <Layout title="Rubric | Student Diwan">
        <DashLayout children={<MainSection/>}/>
    </Layout>
  )
}

export default Rubric
