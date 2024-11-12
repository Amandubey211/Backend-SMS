import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ImageUpload from "../../../Addmission/Components/ImageUpload";
import FormInput from "../../../Accounting/subClass/component/FormInput";
import RadioGroup from "../../../../LoginPages/Student/SignUp/RadioGroup";
import SelectInput from "../../../../LoginPages/Student/SignUp/SelectInput";
import FormSelect from "../../../Accounting/subClass/component/FormSelect";
const UpdateStudent = ({ data, handleUpdateSidebarClose }) => {

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false)
  const [studentData, setParentData] = useState({
    id: '',
    firstName: '',
    lastName: "",
    contactNumber: '',
    email: "",
    profile: null,
    dateOfBirth: '',
    admissionNumber: '',
    Q_Id: '',
    transportRequirement: '',
    permanentAddress: data?.permanentAddress || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      residentialAddress: data?.residentialAddress || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    active: true
  });
  useEffect(() => {
    console.log(data);

    setParentData({
      id: data?._id,
      firstName: data?.firstName,
      lastName: data?.lastName,
      contactNumber: data?.contactNumber,
      email: data?.email,
      profile: data?.profile,
      dateOfBirth: data?.dateOfBirth?.slice(0, 10),
      admissionNumber: data?.admissionNumber,
      Q_Id: data?.Q_Id,
      transportRequirement: data?.transportRequirement,
      permanentAddress: data?.permanentAddress || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      residentialAddress: data?.residentialAddress || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      active: true
    })
  }, [data]);

  const handleAddressChange = (e, addressType) => {
    const { name, value } = e.target;
  
    setParentData((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [name]: value,
      },
    }));
  };

  const handleInputChange = (e, addressType) => {
    const { name, value } = e.target;

    setParentData((prev) => ({
        ...prev,
          
            [name]: value,
        
    }));
};
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setParentData((prev) => ({
        ...prev,
        profile: file,
      }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    Object.keys(studentData).forEach((key) => formData.append(key, studentData[key]));
    console.log(formData);

    // await dispatch(updateParent({ data: formData }));
    setLoading(false)
    handleUpdateSidebarClose();
  };

  return (

    <div
      className="p-4 bg-gray-50 h-full  border rounded-lg overflow-auto"
      style={{ maxHeight: "90vh" }}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col  justify-around gap-5 ">
          <div className="flex flex-row justify-between p-1 border-b  border-gray-200 gap-4 ">
            <div className="mt-10">
              <div className="image-upload-container">
                <ImageUpload
                  imagePreview={imagePreview}
                  handleImageChange={handleImageChange}
                  handleRemoveImage={handleRemoveImage}
                />
              </div>
            </div>
            <div className="flex flex-col gap-5 ">
              <div className="flex  gap-5">
                <FormInput
                  id="contactNumber"
                  label="Mobile Number"
                  value={studentData.contactNumber}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  id="email"
                  label="Email"
                  value={studentData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className=" flex  gap-5  ">
                <FormInput
                  id="firstName"
                  label="First Name"
                  value={studentData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  id="lastName"
                  label="Last Name"
                  value={studentData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex  gap-5  ">

                <FormInput
                  id="admissionNumber"
                  label="Addmission Number"
                  name="admissionNumber"
                  value={studentData.admissionNumber}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  id="Q_Id"

                  label="QID"
                  name="Q_Id"
                  value={studentData.Q_Id}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex  gap-5  ">

                <FormSelect
                id="transportRequirement"
                  label="Transport"
                  name="transportRequirement"
                  value={studentData.transportRequirement}
                  onChange={handleInputChange}
                  options={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                  required={true}
                />
                <FormInput
                  id="dateOfBirth"
                  type="date"
                  label="Date Of Birth"
                  name="dateOfBirth"
                  value={studentData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
                    {/* Address Inputs */}
                    <div>
  <h2 className="font-medium underline">Permanent Address</h2>
  <div className="grid grid-cols-2 gap-4">
    <FormInput
      id="permanentStreet"
      label="Street"
      value={studentData?.permanentAddress?.street}
      name="street"
      onChange={(e) => handleAddressChange(e, "permanentAddress")}
    />
    <FormInput
      id="permanentCity"
      label="City"
      value={studentData?.permanentAddress?.city}
      name="city"
      onChange={(e) => handleAddressChange(e, "permanentAddress")}
    />
    <FormInput
      id="permanentState"
      label="State"
      value={studentData?.permanentAddress?.state}
      name="state"
      onChange={(e) => handleAddressChange(e, "permanentAddress")}
    />
    <FormInput
      id="permanentPostalCode"
      label="Postal Code"
      value={studentData?.permanentAddress?.postalCode}
      name="postalCode"
      onChange={(e) => handleAddressChange(e, "permanentAddress")}
    />
    <FormInput
      id="permanentCountry"
      label="Country"
      value={studentData?.permanentAddress?.country}
      name="country"
      onChange={(e) => handleAddressChange(e, "permanentAddress")}
    />
  </div>
</div>

<div>
  <h2 className="font-medium underline">Residential Address</h2>
  <div className="grid grid-cols-2 gap-4">
    <FormInput
      id="residentialStreet"
      label="Street"
      value={studentData?.residentialAddress?.street}
      name="street"
      onChange={(e) => handleAddressChange(e, "residentialAddress")}
    />
    <FormInput
      id="residentialCity"
      label="City"
      value={studentData?.residentialAddress?.city}
      name="city"
      onChange={(e) => handleAddressChange(e, "residentialAddress")}
    />
    <FormInput
      id="residentialState"
      label="State"
      value={studentData?.residentialAddress?.state}
      name="state"
      onChange={(e) => handleAddressChange(e, "residentialAddress")}
    />
    <FormInput
      id="residentialPostalCode"
      label="Postal Code"
      value={studentData?.residentialAddress?.postalCode}
      name="postalCode"
      onChange={(e) => handleAddressChange(e, "residentialAddress")}
    />
    <FormInput
      id="residentialCountry"
      label="Country"
      value={studentData?.residentialAddress?.country}
      name="country"
      onChange={(e) => handleAddressChange(e, "residentialAddress")}
    />
  </div>
</div>


          <div>
            <h2 className="font-medium underline">Residential Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                id="residentialStreet"
                label="Street"
                value={studentData?.residentialAddress?.street}
                name="street"
                onChange={handleAddressChange}
              />
              <FormInput
                id="residentialCity"
                label="City"
                value={studentData?.residentialAddress?.city}
                name="city"
                onChange={handleAddressChange}
              />
              <FormInput
                id="residentialState"
                label="State"
                value={studentData?.residentialAddress?.state}
                name="state"
                onChange={handleAddressChange}
              />
              <FormInput
                id="residentialPostalCode"
                label="Postal Code"
                value={studentData?.residentialAddress?.postalCode}
                name="postalCode"
                onChange={handleAddressChange}
              />
              <FormInput
                id="residentialCountry"
                label="Country"
                value={studentData?.residentialAddress?.country}
                name="country"
                onChange={handleAddressChange}
              />
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-10 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
    </div>

  );
};

export default UpdateStudent;
