import React from 'react'
import ParentDashLayout from '../../../Components/Parents/ParentDashLayout.js';
import DashLayout from "../../../Components/Parents/ParentDashLayout.js";
import ParentGradeSection from "./ParentGradeSection.js";
import { useParams } from 'react-router-dom'
import useNavHeading from '../../../Hooks/CommonHooks/useNavHeading ';

const ParentChildGrade = () => {
    const {cid,sid}  = useParams()
    useNavHeading(cid,sid)
  return (
  
        <DashLayout children={<ParentGradeSection/>} hideSearchbar={true}/>
   
  )
}

export default ParentChildGrade
