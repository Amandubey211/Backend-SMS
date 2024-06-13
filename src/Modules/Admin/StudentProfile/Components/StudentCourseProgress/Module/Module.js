import React from 'react'
import Layout from '../../../../../../Components/Common/Layout'
import DashLayout from '../../../../../../Components/Admin/AdminDashLayout'
// import DashLayout from '../../../../../Components/Admin/AdminDashLayout'
import MainSection from './MainSection'
import { useParams } from 'react-router-dom'
import useNavHeading from '../../../../../../Hooks/CommonHooks/useNavHeading '

const Module = () => {
    const {cid,sid}  = useParams()
    useNavHeading(cid,sid)
  return (

    <MainSection/>
    // <Layout title="Module | student diwan">
    //     <DashLayout children={<MainSection/>}/>
    // </Layout>
  )
}

export default Module
