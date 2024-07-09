import React from 'react'
import Layout from '../../../../../../Components/Common/Layout'
import MainSection from './MainSection'
import SideMenubar from '../../../../../../Components/Admin/SideMenubar'

const CreateQuizzes = () => {
  return (
    <Layout title="Create Quizzes">
        <div className='flex '>

        <SideMenubar/>
        <MainSection/>
        </div>
    

    </Layout>
  )
}

export default CreateQuizzes
