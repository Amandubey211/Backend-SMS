import React from "react";
import { CiUser } from "react-icons/ci";
import VerificationForm from "./VerificationForm"; // Assuming this is the form you're referencing
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Details = ({ student }) => {
  console.log(student);
  
  const { t } = useTranslation('admVerification'); // Initialize useTranslation hook

  return (
    <div className="relative container mx-auto p-1 ">
      {/* Main container to hold details and form */}
      <div className="relative">
        {/* Main Details Section */}
        <div className="relative z-0 flex-1 bg-white rounded-lg overflow-hidden">
          <div className="flex bg-pink-100 rounded-tl-full rounded-tr-full flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white flex justify-center items-center bg-gray-200 text-gray-800">
              {student?.profile ? (
                <img
                  className="w-full h-full object-cover"
                  src={student.profile}
                  alt={`${student?.firstName} ${student?.lastName}`}
                />
              ) : (
                <CiUser size={32} />
              )}
            </div>
            <div className="text-center">
              <h2 className="text-2xl capitalize font-semibold text-gray-800">{`${student?.firstName} ${student?.lastName}`}</h2>
              <p className="rounded-full text-center border py-1 mt-1 border-green-900 bg-green-100 text-green-800">
                {student?.role}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-800 mt-24">
              {t('Personal Information')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Email')}:</span>
                <p className="text-gray-600 truncate">{student?.email}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Contact Number')}:</span>
                <p className="text-gray-600">{student?.contactNumber}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Age')}:</span>
                <p className="text-gray-600">{student?.age}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Date of Birth')}:</span>
                <p className="text-gray-600">
                  {formatDate(student?.dateOfBirth)}
                </p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Birth Place')}:</span>
                <p className="text-gray-600">{student?.placeOfBirth}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Gender')}:</span>
                <p className="text-gray-600">{student?.gender}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Blood Group')}:</span>
                <p className="text-gray-600">{student?.bloodGroup}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Religion')}:</span>
                <p className="text-gray-600">{student?.religion}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Transport Requirement')}:</span>
                <p className="text-gray-600">{student?.transportRequirement ? 'Yes':'No'}</p>
              </div>
            </div>

            {/* Father Information */}
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {t('Father Information')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Father\'s First Name')}:</span>
                <p className="text-gray-600">{student?.fatherInfo?.firstName}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Father\'s Middle Name')}:</span>
                <p className="text-gray-600">{student?.fatherInfo?.middleName}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Father\'s Last Name')}:</span>
                <p className="text-gray-600">{student?.fatherInfo?.lastName}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Father\'s Religion')}:</span>
                <p className="text-gray-600">{student?.fatherInfo?.religion}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Father\'s Nationality')}:</span>
                <p className="text-gray-600">{student?.fatherInfo?.nationality}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Father\'s Job Title')}:</span>
                <p className="text-gray-600">{student?.fatherInfo?.jobTitle}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Father\'s Cell Number')}:</span>
                <p className="text-gray-600">{student?.fatherInfo?.cell1?.value}</p>
                <p className="text-gray-600">{student?.fatherInfo?.cell2?.value}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Father\'s Work Phone')}:</span>
                <p className="text-gray-600">{student?.fatherInfo?.workPhone}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Father\'s Email')}:</span>
                <p className="text-gray-600">{student?.fatherInfo?.email1} </p>
                <p className="text-gray-600">{student?.fatherInfo?.email2} </p>
              </div>
            </div>

            {/* Mother Information */}
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {t('Mother Information')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Mother\'s First Name')}:</span>
                <p className="text-gray-600">{student?.motherInfo?.firstName}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Mother\'s Middle Name')}:</span>
                <p className="text-gray-600">{student?.motherInfo?.middleName}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Mother\'s Last Name')}:</span>
                <p className="text-gray-600">{student?.motherInfo?.lastName}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Mother\'s Religion')}:</span>
                <p className="text-gray-600">{student?.motherInfo?.religion}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Mother\'s Nationality')}:</span>
                <p className="text-gray-600">{student?.motherInfo?.nationality}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Mother\'s Job Title')}:</span>
                <p className="text-gray-600">{student?.motherInfo?.jobTitle}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Mother\'s Cell Number')}:</span>
                <p className="text-gray-600">{student?.motherInfo?.cell1?.value}</p>
                <p className="text-gray-600">{student?.motherInfo?.cell2?.value}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Mother\'s Work Phone')}:</span>
                <p className="text-gray-600">{student?.motherInfo?.workPhone}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Mother\'s Email')}:</span>
                <p className="text-gray-600">{student?.motherInfo?.email1}</p>
                <p className="text-gray-600">{student?.motherInfo?.email2}</p>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {t('Guardian Information')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Guardian Name')}:</span>
                <p className="text-gray-600">{student?.guardianName}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Guardian Relation To Student')}:</span>
                <p className="text-gray-600">{student?.guardianRelationToStudent}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Guardian Contact Number:')}:</span>
                <p className="text-gray-600">{student?.guardianContactNumber}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Guardian Email')}:</span>
                <p className="text-gray-600">{student?.guardianEmail}</p>
              </div>
         

            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {t('Previous School Info')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Previous School Name')}:</span>
                <p className="text-gray-600">{student?.academicHistory?.previousSchoolName}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Previous Class')}:</span>
                <p className="text-gray-600">{student?.academicHistory?.previousClass}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Curriculum')}:</span>
                <p className="text-gray-600">{student?.academicHistory?.curriculum}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('last Day At School')}:</span>
                <p className="text-gray-600">{student?.academicHistory?.lastDayAtSchoo?.slice(0,10)}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('source Of Fee')}:</span>
                <p className="text-gray-600">{student?.academicHistory?.sourceOfFee}</p>
              </div>
           
         

            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {t('preferences')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Second Language')}:</span>
                {student?.secondLanguage?.map((i)=>(<p className="text-gray-600">{i}</p>))}
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Third Language')}:</span>
                {student?.thirdLanguage?.map((i)=>(<p className="text-gray-600">{i}</p>))}
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Value Education')}:</span>
                {student?.valueEducation?.map((i)=>(<p className="text-gray-600">{i}</p>))}
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Is Left Handed')}:</span>
                <p className="text-gray-600">{student?.isLeftHanded ? 'Yes':'No'}</p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Medical Condition')}:</span>
                <p className="text-gray-600">{student?.medicalCondition}</p>
              </div>
            </div>

            {/* Address Information */}
            <h3 className="text-lg font-medium text-gray-800 mb-4 border-t pt-4">
              {t('Addresses')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Permanent Address')}:</span>
                <p className="text-gray-600">
                  {student?.permanentAddress?.unitNumber} {student?.permanentAddress?.buildingNumber}, {student?.permanentAddress?.streetName}, {student?.permanentAddress?.compoundName}, {student?.permanentAddress?.city}, {student?.permanentAddress?.state}, {student?.permanentAddress?.postalCode}, {student?.permanentAddress?.country}
                </p>
              </div>
              <div className="bg-pink-100 rounded-md p-4">
                <span className="font-medium text-gray-700">{t('Residential Address')}:</span>
                <p className="text-gray-600">
                  {student?.residentialAddress?.unitNumber} {student?.residentialAddress?.buildingNumber}, {student?.residentialAddress?.streetName}, {student?.residentialAddress?.compoundName}, {student?.residentialAddress?.city}, {student?.residentialAddress?.state}, {student?.residentialAddress?.postalCode}, {student?.residentialAddress?.country}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky and Overlapping Form */}
        <div className="absolute -top-10 right-11 w-full lg:w-1/3 z-10">
          <div className="bg-white p-4 border rounded-lg shadow-lg sticky top-6">
            <VerificationForm email={student?.email} studentId={student?._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
