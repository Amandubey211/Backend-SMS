import React from 'react'
import ParentDashLayout from '../../../Components/Parents/ParentDashLayout.js';
import DashLayout from "../../../Components/Parents/ParentDashLayout.js";
import ProgressChild from "./ProgressChild.js";
import { useParams } from 'react-router-dom'
import useNavHeading from '../../../Hooks/CommonHooks/useNavHeading .js';

const CheckProgress = () => {
    const {cid,sid}  = useParams()
    useNavHeading(cid,sid)
  return (
  
        <ParentDashLayout children={<ProgressChild/>} hideSearchbar={true} hideAvatarList={true}/>
   
  )
}

export default CheckProgress
