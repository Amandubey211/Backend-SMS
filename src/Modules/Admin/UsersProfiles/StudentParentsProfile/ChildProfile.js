import React from 'react';
import profileIcon from '../../../../Assets/DashboardAssets/profileIcon.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProtectedSection from '../../../../Routes/ProtectedRoutes/ProtectedSection';
import { PERMISSIONS } from '../../../../config/permission';
import ProtectedAction from '../../../../Routes/ProtectedRoutes/ProtectedAction';

const ChildProfile = ({ children }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('admAccounts');

  if (!children || children?.length === 0) {
    return <div>{t('No children data available')}</div>;
  }

  // console.log('Children data:', children);

  return (

      <div className="flex flex-col gap-4 mt-2">
        {children?.map((child, index) => (
          <div key={index} className='flex flex-col text-center border border-gray-300 rounded-md items-center justify-around mx-5 py-5 gap-3'>
            <div>
              <img
                src={child?.imageUrl || profileIcon}
                alt={child?.name}
                className="w-24 h-24 rounded-full object-cover border"
              />
            </div>
            <h2 className='font-medium'>{child?.name}</h2>
            <div className='flex gap-2'>
              <span className='text-gray-500'>{t('Adm')}</span>
              <span className='font-medium text-gray-800'>{child?.admissionNumber}</span>
              <span className='text-gray-500'>{t('Class')}</span>
              <span className='font-medium text-gray-800'>{child?.class}</span>
              <span className='text-gray-500'>{t('Section')}</span>
              <span className='font-medium text-gray-800'>{child?.section}</span>
            </div>
            <div>
            <ProtectedAction requiredPermission={PERMISSIONS.VIEW_STUDENT}>
              <button
                className="border p-2 w-[300px] rounded bg-pink-100 text-center flex justify-center items-center"
                onClick={() => navigate(`/users/students/${child?.id}`)}
              >
                <span className="font-semibold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                  {t('View Profile')}
                </span>
              </button>
              </ProtectedAction>
            </div>
          </div>
        ))}
      </div>
    
  );
};

export default ChildProfile;
