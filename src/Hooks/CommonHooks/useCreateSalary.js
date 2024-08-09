import axios from 'axios'
import React, { useState } from 'react'
import { baseUrl } from '../../config/Common'
import toast from 'react-hot-toast'

const useCreateSalary = () => {

    const [isLoading, setIsLoading] = useState(false)

    const [salaryData, setSalaryData] = useState([])


    const createSalary = async (status, action) => {
        const token = localStorage.getItem(
            process.env.REACT_APP_ADMIN_TOKEN_STORAGE_KEY
        );
        setIsLoading(true)
        try {
            const response = await axios.post(`${baseUrl}/admin/staff/craete_salary`,
                { status, action },
                { headers: { Authentication: token } },

            )
            console.log('data---', response.data);
            setIsLoading(false)
            setSalaryData(response.data)
        } catch (error) {
            setIsLoading(false)
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }

    }


    return { createSalary, salaryData, isLoading }
}

export default useCreateSalary