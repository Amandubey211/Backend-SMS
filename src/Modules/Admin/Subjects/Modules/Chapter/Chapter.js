import React from 'react'
import useNavHeading from '../../../../../Hooks/CommonHooks/useNavHeading '
import { useParams } from 'react-router-dom'
import Layout from '../../../../../Components/Common/Layout'
import MainSection from './MainSection'
import DashLayout from '../../../../../Components/Admin/AdminDashLayout'

const Chapter = () => {
    const {cid,sid}  = useParams()
    useNavHeading(cid,sid)
  return (
    <Layout title="Chapters | student diwan">
        <DashLayout children={<MainSection/>}/>
    </Layout>
  )
}

export default Chapter

