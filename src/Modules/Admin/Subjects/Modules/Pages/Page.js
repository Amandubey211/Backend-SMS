import React from 'react'
import DashLayout from '../../../../../Components/Admin/AdminDashLayout'
import Layout from '../../../../../Components/Common/Layout'
import MainSection from './MainSection'

const Page = () => {
  return (
    <div>
        <Layout title={`Pages | Student Diwan`}>
            <DashLayout children={<MainSection/>} hideSearchbar={true}/>
        </Layout>
    </div>
  )
}

export default Page
