import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'

const NoDataFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
    <FaExclamationTriangle className="w-12 h-12 mb-3" />
    <p className="text-lg font-semibold">No data found</p>
  </div>
  )
}

export default NoDataFound
