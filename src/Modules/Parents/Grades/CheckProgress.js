import React from 'react'
import ParentDashLayout from '../../../Components/Parents/ParentDashLayout.js';
import DashLayout from "../../../Components/Parents/ParentDashLayout.js";
import ProgressChild from "./ProgressChild.js";
import { useParams } from 'react-router-dom'
import useNavHeading from '../../../Hooks/CommonHooks/useNavHeading .js';
import AllSubject from './allSubject.js';

const CheckProgress = () => {
    const {studentId}  = useParams()
  return (
  
        <ParentDashLayout children={<AllSubject studentId={studentId}/>} hideSearchbar={true} hideAvatarList={true}/>
   
  )
}

export default CheckProgress
