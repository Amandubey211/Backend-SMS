// import React, { useState } from "react";
// import TextInput from "./TextInput"; // Reusable TextInput component
// import { useTranslation } from "react-i18next";

// const AddressInfo = ({ studentInfo, handleInputChange, errors, inputRefs }) => {
//   const { t } = useTranslation("admAdmission");
//   const [sameAddress, setSameAddress] = useState(false);

//   const handleSameAddressChange = (e) => {
//     setSameAddress(e.target.checked);
//     if (e.target.checked) {
//       handleInputChange({
//         target: {
//           name: "residentialAddress",
//           value: { ...studentInfo.permanentAddress },
//         },
//       });
//     } else {
//       handleInputChange({
//         target: {
//           name: "residentialAddress",
//           value: {
//             street: "",
//             city: "",
//             state: "",
//             postalCode: "",
//             country: "",
//           },
//         },
//       });
//     }
//   };

//   return (
//     <div className="mt-6">
//       {/* Contact Information */}
//       <h2 className="text-xl font-semibold mb-2">{t("Contact Info")}</h2>
//       <div className="grid grid-cols-2 gap-4">
//         <TextInput
//           ref={(el) => (inputRefs["contactNumber"] = { current: el })}
//           label={t("Contact Number")}
//           name="contactNumber"
//           value={studentInfo.contactNumber || ""}
//           onChange={handleInputChange}
//           placeholder={t("0000-0000")}
//           error={errors.contactNumber}
//           //ref={inputRefs.contactNumber}
//         />
//         <TextInput
//           label={t("Emergency Number")}
//           name="emergencyNumber"
//           value={studentInfo.emergencyNumber || ""}
//           onChange={handleInputChange}
//           placeholder={t("0000-0000")}
//           error={errors.emergencyNumber}
//           ref={inputRefs.emergencyNumber}
//         />
//       </div>
//       <TextInput
//         label={t("Email")}
//         name="email"
//         value={studentInfo.email || ""}
//         onChange={handleInputChange}
//         placeholder={t("studentdiwan@gmail.com")}
//         error={errors.email}
//         ref={inputRefs.email}
//       />

//       {/* Permanent Address */}
//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-2">{t("Permanent Address")}</h3>
//         <TextInput
//           label={t("Street")}
//           name="permanentAddress.street"
//           value={studentInfo.permanentAddress.street || ""}
//           onChange={handleInputChange}
//           placeholder={t("Enter street")}
//           error={errors["permanentAddress.street"]}
//           ref={inputRefs.permanentAddressStreet}
//         />
//         <div className="grid grid-cols-2 gap-4 my-4">
//           <TextInput
//             label={t("City")}
//             name="permanentAddress.city"
//             value={studentInfo.permanentAddress.city || ""}
//             onChange={handleInputChange}
//             placeholder={t("Enter city")}
//             error={errors["permanentAddress.city"]}
//             ref={inputRefs.permanentAddressCity}
//           />
//           <TextInput
//             label={t("State")}
//             name="permanentAddress.state"
//             value={studentInfo.permanentAddress.state || ""}
//             onChange={handleInputChange}
//             placeholder={t("Enter state")}
//             error={errors["permanentAddress.state"]}
//             ref={inputRefs.permanentAddressState}
//           />
//         </div>
//         <div className="grid grid-cols-2 gap-4 my-4">
//           <TextInput
//             label={t("Postal Code")}
//             name="permanentAddress.postalCode"
//             value={studentInfo.permanentAddress.postalCode || ""}
//             onChange={handleInputChange}
//             placeholder={t("Enter postal code")}
//             error={errors["permanentAddress.postalCode"]}
//             ref={inputRefs.permanentAddressPostalCode}
//           />
//           <TextInput
//             label={t("Country")}
//             name="permanentAddress.country"
//             value={studentInfo.permanentAddress.country || ""}
//             onChange={handleInputChange}
//             placeholder={t("Enter country")}
//             error={errors["permanentAddress.country"]}
//             ref={inputRefs.permanentAddressCountry}
//           />
//         </div>
//       </div>

//       {/* Checkbox for Same Address */}
//       <div className="mb-2 mt-2">
//         <input
//           type="checkbox"
//           checked={sameAddress}
//           onChange={handleSameAddressChange}
//           className="mr-2"
//         />
//         <label className="text-sm">
//           {t("Residential Address is the same as Permanent Address")}
//         </label>
//       </div>

//       {/* Residential Address */}
//       {!sameAddress && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-2">
//             {t("Residential Address")}
//           </h3>
//           <TextInput
//             label={t("Street")}
//             name="residentialAddress.street"
//             value={studentInfo.residentialAddress.street || ""}
//             onChange={handleInputChange}
//             placeholder={t("Enter street")}
//             error={errors["residentialAddress.street"]}
//             ref={inputRefs.residentialAddressStreet}
//           />
//           <div className="grid grid-cols-2 gap-4 my-4">
//             <TextInput
//               label={t("City")}
//               name="residentialAddress.city"
//               value={studentInfo.residentialAddress.city || ""}
//               onChange={handleInputChange}
//               placeholder={t("Enter city")}
//               error={errors["residentialAddress.city"]}
//               ref={inputRefs.residentialAddressCity}
//             />
//             <TextInput
//               label={t("State")}
//               name="residentialAddress.state"
//               value={studentInfo.residentialAddress.state || ""}
//               onChange={handleInputChange}
//               placeholder={t("Enter state")}
//               error={errors["residentialAddress.state"]}
//               ref={inputRefs.residentialAddressState}
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-4 my-4">
//             <TextInput
//               label={t("Postal Code")}
//               name="residentialAddress.postalCode"
//               value={studentInfo.residentialAddress.postalCode || ""}
//               onChange={handleInputChange}
//               placeholder={t("Enter postal code")}
//               error={errors["residentialAddress.postalCode"]}
//               ref={inputRefs.residentialAddressPostalCode}
//             />
//             <TextInput
//               label={t("Country")}
//               name="residentialAddress.country"
//               value={studentInfo.residentialAddress.country || ""}
//               onChange={handleInputChange}
//               placeholder={t("Enter country")}
//               error={errors["residentialAddress.country"]}
//               ref={inputRefs.residentialAddressCountry}
//             />
//           </div>
//         </div>
//       )}

//       {/* Additional Fields */}
//       <div className="grid grid-cols-2 gap-4 mt-4">
//         <TextInput
//           label={t("Place of Birth")}
//           name="placeOfBirth"
//           value={studentInfo.placeOfBirth || ""}
//           onChange={handleInputChange}
//           placeholder={t("Place")}
//           error={errors.placeOfBirth}
//           ref={inputRefs.placeOfBirth}
//         />
//         <TextInput
//           label={t("QID Number")}
//           name="Q_Id"
//           value={studentInfo.Q_Id || ""}
//           onChange={handleInputChange}
//           placeholder={t("11 digit")}
//           error={errors.Q_Id}
//           ref={inputRefs.Q_Id}
//         />
//       </div>
//     </div>
//   );
// };

// export default AddressInfo;
