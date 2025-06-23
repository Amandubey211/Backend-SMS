import { CiUser } from "react-icons/ci";
import VerificationForm from "./VerificationForm";
import { useTranslation } from "react-i18next";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Details = ({ student }) => {
  const { t } = useTranslation("admVerification");

  // Calculate age from date of birth
  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Function to render address
  const renderAddress = (address) => {
    if (!address) return "N/A";
    const parts = [
      address.buildingNumber,
      address.streetName,
      address.city,
      address.state,
      address.postalCode,
    ].filter(Boolean);
    return parts.join(", ") || "N/A";
  };

  // Function to render language list
  const renderLanguageList = (languages) => {
    if (!languages || languages.length === 0) return "N/A";
    return languages.join(", ");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="relative capitalize">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md flex justify-center items-center bg-gray-100">
              {student?.profile ? (
                <img
                  className="w-full h-full object-cover"
                  src={student.profile}
                  alt={`${student?.firstName} ${student?.lastName}`}
                />
              ) : (
                <CiUser size={48} className="text-gray-400" />
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 capitalize">{`${student?.firstName} ${student?.lastName}`}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  {student?.role}
                </span>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  {student?.enrollmentStatus}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                  {student?.academicHistory?.curriculum} Curriculum
                </span>
              </div>
              <div className="mt-3 text-gray-600">
                <p>Admission Number: {student?.admissionNumber || "Pending"}</p>
                <p>Email: {student?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Student Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("Personal Information")}
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem
                  label={t("Date of Birth")}
                  value={`${formatDate(student?.dateOfBirth)} (${calculateAge(
                    student?.dateOfBirth
                  )} years)`}
                />
                <DetailItem label={t("Gender")} value={student?.gender} />
                <DetailItem
                  label={t("Blood Group")}
                  value={student?.bloodGroup}
                />
                <DetailItem
                  label={t("Nationality")}
                  value={student?.nationality}
                />
                <DetailItem label={t("Religion")} value={student?.religion} />
                <DetailItem
                  label={t("Native Language")}
                  value={student?.nativeLanguage}
                />
                <DetailItem
                  label={t("Place of Birth")}
                  value={student?.placeOfBirth}
                />
                <DetailItem
                  label={t("Passport Number")}
                  value={student?.passportNumber}
                />
                <DetailItem
                  label={t("Passport Expiry")}
                  value={formatDate(student?.idExpiry)}
                />
                <DetailItem
                  label={t("Contact Number")}
                  value={student?.contactNumber}
                />
                <DetailItem
                  label={t("Emergency Number")}
                  value={student?.emergencyNumber}
                />
                <DetailItem
                  label={t("Transport Required")}
                  value={student?.transportRequirement ? "Yes" : "No"}
                />
              </div>
            </div>

            {/* Family Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Father Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {t("Father Information")}
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    {student?.fatherInfo?.photo && (
                      <img
                        src={student.fatherInfo.photo}
                        alt="Father"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-lg text-gray-800">{`${student?.fatherInfo?.firstName} ${student?.fatherInfo?.lastName}`}</h3>
                      <p className="text-gray-600">
                        {student?.fatherInfo?.jobTitle} at{" "}
                        {student?.fatherInfo?.company}
                      </p>
                    </div>
                  </div>
                  <DetailItem
                    label={t("ID Number")}
                    value={student?.fatherInfo?.idNumber}
                  />
                  <DetailItem
                    label={t("ID Expiry")}
                    value={formatDate(student?.fatherInfo?.idExpiry)}
                  />
                  <DetailItem
                    label={t("Nationality")}
                    value={student?.fatherInfo?.nationality}
                  />
                  <DetailItem
                    label={t("Religion")}
                    value={student?.fatherInfo?.religion}
                  />
                  <DetailItem
                    label={t("Primary Contact")}
                    value={student?.fatherInfo?.cell1?.value}
                  />
                  <DetailItem
                    label={t("Secondary Contact")}
                    value={student?.fatherInfo?.cell2?.value}
                  />
                  <DetailItem
                    label={t("Primary Email")}
                    value={student?.fatherInfo?.email1}
                  />
                  <DetailItem
                    label={t("Secondary Email")}
                    value={student?.fatherInfo?.email2}
                  />
                </div>
              </div>

              {/* Mother Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-pink-50 to-pink-100 px-6 py-4 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {t("Mother Information")}
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    {student?.motherInfo?.photo && (
                      <img
                        src={student.motherInfo.photo}
                        alt="Mother"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-lg text-gray-800">{`${student?.motherInfo?.firstName}  ${student?.motherInfo?.lastName}`}</h3>
                      <p className="text-gray-600">
                        {student?.motherInfo?.jobTitle} at{" "}
                        {student?.motherInfo?.company}
                      </p>
                    </div>
                  </div>
                  <DetailItem
                    label={t("ID Number")}
                    value={student?.motherInfo?.idNumber}
                  />
                  <DetailItem
                    label={t("ID Expiry")}
                    value={formatDate(student?.motherInfo?.idExpiry)}
                  />
                  <DetailItem
                    label={t("Nationality")}
                    value={student?.motherInfo?.nationality}
                  />
                  <DetailItem
                    label={t("Religion")}
                    value={student?.motherInfo?.religion}
                  />
                  <DetailItem
                    label={t("Primary Contact")}
                    value={student?.motherInfo?.cell1?.value}
                  />
                  <DetailItem
                    label={t("Secondary Contact")}
                    value={student?.motherInfo?.cell2?.value}
                  />
                  <DetailItem
                    label={t("Primary Email")}
                    value={student?.motherInfo?.email1}
                  />
                  <DetailItem
                    label={t("Secondary Email")}
                    value={student?.motherInfo?.email2}
                  />
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("Guardian Information")}
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem
                  label={t("Guardian Name")}
                  value={student?.guardianName}
                />
                <DetailItem
                  label={t("Relation to Student")}
                  value={student?.guardianRelationToStudent}
                />
                <DetailItem
                  label={t("Contact Number")}
                  value={student?.guardianContactNumber}
                />
                <DetailItem label={t("Email")} value={student?.guardianEmail} />
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("Academic Information")}
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem
                  label={t("Previous School")}
                  value={student?.academicHistory?.previousSchoolName}
                />
                <DetailItem
                  label={t("Previous Class")}
                  value={student?.academicHistory?.previousClass}
                />
                <DetailItem
                  label={t("Curriculum")}
                  value={student?.academicHistory?.curriculum}
                />
                <DetailItem
                  label={t("Source of Fee")}
                  value={student?.academicHistory?.sourceOfFee}
                />
                <DetailItem
                  label={t("Second Language")}
                  value={renderLanguageList(student?.secondLanguage)}
                />
                <DetailItem
                  label={t("Third Language")}
                  value={renderLanguageList(student?.thirdLanguage)}
                />
                <DetailItem
                  label={t("Value Education")}
                  value={renderLanguageList(student?.valueEducation)}
                />
                <DetailItem
                  label={t("Left Handed")}
                  value={student?.isLeftHanded ? "Yes" : "No"}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("Address Information")}
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">
                    {t("Residential Address")}
                  </h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {renderAddress(student?.residentialAddress)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">
                    {t("Permanent Address")}
                  </h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {renderAddress(student?.permanentAddress)}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("Medical Information")}
                </h2>
              </div>
              <div className="p-6">
                <DetailItem
                  label={t("Medical Conditions")}
                  value={student?.medicalCondition || "None reported"}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Verification Form and Documents */}
          <div className="space-y-6">
            {/* Verification Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("Verification")}
                </h2>
              </div>
              <div className="p-6">
                <VerificationForm
                  email={student?.email}
                  studentId={student?._id}
                />
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("Submitted Documents")}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {student?.attachments?.mandatory &&
                  Object.entries(student.attachments.mandatory).map(
                    ([docName, docUrl]) => (
                      <DocumentItem key={docName} name={docName} url={docUrl} />
                    )
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Detail Item Component
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-gray-800">{value || "N/A"}</p>
  </div>
);

// Document Item Component
const DocumentItem = ({ name, url }) => {
  const isImage = url?.match(/\.(jpeg|jpg|gif|png)$/) != null;
  const isPdf = url?.match(/\.(pdf)$/) != null;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="font-medium text-gray-700 capitalize">{name}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        {isImage ? "View Image" : isPdf ? "View PDF" : "View Document"}
      </a>
    </div>
  );
};

export default Details;
