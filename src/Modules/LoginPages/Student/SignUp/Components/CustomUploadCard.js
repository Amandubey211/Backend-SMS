// import React, { useRef, useState, useEffect, useCallback } from "react";
// import { Modal, Button, message, Slider, Row, Col } from "antd";
// import ReactCrop from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";
// import { GrRotateRight, GrRotateLeft } from "react-icons/gr";
// import { PiCropLight, PiFlipHorizontalLight } from "react-icons/pi";

// const CustomUploadCard = ({
//   name,
//   label,
//   form,
//   recommendedSize = "300x400",
//   width = "w-full",
//   height = "h-48",
//   aspectRatio = 3 / 4,
//   enableCrop = true,
// }) => {
//   /* ---------------- state ---------------- */
//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [previewVisible, setPreviewVisible] = useState(false);

//   /* crop state */
//   const [crop, setCrop] = useState(null);
//   const [completedCrop, setCompletedCrop] = useState(null);
//   const [rotation, setRotation] = useState(0);
//   const [flipH, setFlipH] = useState(false);

//   /* ---------------- refs ---------------- */
//   const fileInputRef = useRef(null);
//   const imgRef = useRef(null);
//   const canvasRef = useRef(null);

//   /* ---------------- helpers ---------------- */
//   const openDialog = () => fileInputRef.current?.click();

//   const handleFileChange = useCallback(
//     (e) => {
//       const f = e.target.files?.[0];
//       if (!f?.type.startsWith("image/")) {
//         message.error("Please upload a valid image");
//         return;
//       }
//       const url = URL.createObjectURL(f);
//       setFile(f);
//       setPreviewUrl(url);
//       form.setFieldValue(name, f);

//       /* reset editor state */
//       setRotation(0);
//       setFlipH(false);
//     },
//     [form, name]
//   );

//   const clearFile = (e) => {
//     e?.stopPropagation();
//     if (previewUrl) URL.revokeObjectURL(previewUrl);
//     setFile(null);
//     setPreviewUrl(null);
//     form.setFieldValue(name, null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const openPreview = (e) => {
//     e?.stopPropagation();
//     if (!previewUrl) return;
//     if (enableCrop) {
//       setCrop({ unit: "%", width: 100, aspect: aspectRatio });
//     }
//     setPreviewVisible(true);
//   };

//   const saveCrop = () => {
//     if (!completedCrop || !canvasRef.current) {
//       return message.error("Please crop the image first");
//     }
//     canvasRef.current.toBlob(
//       (blob) => {
//         if (!blob) return message.error("Failed to crop image");
//         const newFile = new File([blob], file?.name || "image.jpg", {
//           type: "image/jpeg",
//         });
//         const newURL = URL.createObjectURL(blob);
//         setFile(newFile);
//         setPreviewUrl(newURL);
//         form.setFieldValue(name, newFile);
//         setPreviewVisible(false);
//       },
//       "image/jpeg",
//       0.9
//     );
//   };

//   /* ------------ live-preview painter ------------ */
//   useEffect(() => {
//     if (
//       !enableCrop ||
//       !imgRef.current ||
//       !canvasRef.current ||
//       !crop?.width ||
//       !crop?.height
//     )
//       return;

//     const canvas = canvasRef.current;
//     const image = imgRef.current;
//     const scaleX = image.naturalWidth / image.width;
//     const scaleY = image.naturalHeight / image.height;
//     const dpr = window.devicePixelRatio || 1;
//     const ctx = canvas.getContext("2d");

//     canvas.width = crop.width * dpr;
//     canvas.height = crop.height * dpr;
//     ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
//     ctx.imageSmoothingQuality = "high";

//     ctx.save();
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.translate(canvas.width / 2, canvas.height / 2);
//     ctx.rotate((rotation * Math.PI) / 180);
//     if (flipH) ctx.scale(-1, 1);
//     ctx.translate(-canvas.width / 2, -canvas.height / 2);
//     ctx.drawImage(
//       image,
//       crop.x * scaleX,
//       crop.y * scaleY,
//       crop.width * scaleX,
//       crop.height * scaleY,
//       0,
//       0,
//       crop.width,
//       crop.height
//     );
//     ctx.restore();
//   }, [crop, rotation, flipH, enableCrop]);

//   /* revoke object URLs on unmount */
//   useEffect(
//     () => () => previewUrl && URL.revokeObjectURL(previewUrl),
//     [previewUrl]
//   );

//   /* ---------------- render ---------------- */
//   return (
//     <>
//       {/* Upload thumbnail */}
//       <div
//         className={`relative flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-blue-500 transition-colors ${width} ${height}`}
//         onClick={openDialog}
//       >
//         {file ? (
//           <>
//             <img
//               src={previewUrl}
//               alt="Preview"
//               className="w-full h-full object-cover rounded-md"
//               onClick={openPreview}
//             />
//             <button
//               onClick={clearFile}
//               className="absolute top-2 right-2 bg-white border border-gray-300 rounded px-2 py-0.5 text-xs hover:bg-gray-50"
//             >
//               Clear
//             </button>
//             {enableCrop && (
//               <div
//                 className="absolute top-2 left-2 cursor-pointer"
//                 onClick={openPreview}
//               >
//                 <PiCropLight style={{ fontSize: 25, color: "#fff" }} />
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="text-center p-4">
//             <div className="text-xl">+</div>
//             <div>Upload Photo</div>
//             {recommendedSize && (
//               <div className="text-xs text-gray-400 mt-1">
//                 (Recommended: {recommendedSize})
//               </div>
//             )}
//           </div>
//         )}
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           hidden
//           onChange={handleFileChange}
//         />
//       </div>

//       {/* Modal */}
//       <Modal
//         open={previewVisible}
//         footer={null}
//         centered
//         title={enableCrop ? "Edit Image" : "Image Preview"}
//         onCancel={() => setPreviewVisible(false)}
//         width={enableCrop ? 1000 : 600}
//         destroyOnClose
//       >
//         {enableCrop ? (
//           /* ---------- Editor ---------- */
//           <Row gutter={[16, 16]}>
//             <Col xs={24} md={12}>
//               <h4 className="text-center mb-2">Crop</h4>
//               <ReactCrop
//                 crop={crop}
//                 onChange={(c) => setCrop(c)}
//                 onComplete={(c) => setCompletedCrop(c)}
//                 onImageLoaded={(img) => (imgRef.current = img)}
//                 aspect={aspectRatio}
//                 className="max-h-[50vh]"
//               >
//                 <img
//                   src={previewUrl}
//                   alt="Crop"
//                   style={{
//                     transform: `rotate(${rotation}deg) scaleX(${
//                       flipH ? -1 : 1
//                     })`,
//                     maxWidth: "100%",
//                     maxHeight: "50vh",
//                   }}
//                 />
//               </ReactCrop>

//               <div className="flex justify-between items-center my-4 px-5">
//                 <div className="flex space-x-2">
//                   <Button
//                     icon={<GrRotateLeft />}
//                     onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
//                   />
//                   <Button
//                     icon={<GrRotateRight />}
//                     onClick={() => setRotation((r) => (r + 90) % 360)}
//                   />
//                 </div>
//                 <Button
//                   icon={<PiFlipHorizontalLight />}
//                   onClick={() => setFlipH((f) => !f)}
//                 />
//               </div>

//               <div className="px-5">
//                 <Slider
//                   min={0}
//                   max={360}
//                   value={rotation}
//                   onChange={setRotation}
//                   marks={{ 0: "0°", 90: "90°", 180: "180°", 270: "270°" }}
//                 />
//               </div>
//             </Col>

//             <Col xs={24} md={12}>
//               <h4 className="text-center mb-2">Preview</h4>
//               <div className="border rounded-md p-2 flex justify-center items-center h-[30rem]">
//                 {crop?.width ? (
//                   <canvas
//                     ref={canvasRef}
//                     style={{ maxWidth: "100%", maxHeight: "100%" }}
//                   />
//                 ) : (
//                   <span className="text-gray-400">
//                     Crop area will appear here
//                   </span>
//                 )}
//               </div>
//               <Button
//                 type="primary"
//                 className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white mt-4"
//                 block
//                 onClick={saveCrop}
//               >
//                 Save Cropped Image
//               </Button>
//             </Col>
//           </Row>
//         ) : (
//           /* ---------- Viewer ---------- */
//           <img
//             src={previewUrl}
//             alt="Preview"
//             className="max-h-[80vh] w-full object-contain rounded-md"
//           />
//         )}
//       </Modal>
//     </>
//   );
// };

// export default CustomUploadCard;
/**
 * CustomUploadCard (simplified, view-only)
 * – Cropping / rotation / flip code has been commented out so you can re-enable later.
 * – Hovering the thumbnail shows an eye icon; clicking it opens a read-only modal preview.
 */

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Modal, Button, message } from "antd";
import { FaEye } from "react-icons/fa";
import { PiCropLight } from "react-icons/pi"; // ← kept for future use if needed

const CustomUploadCard = ({
  name,
  form,
  recommendedSize = "300x400",
  width = "w-full",
  height = "h-48",
}) => {
  /* ---------------- state ---------------- */
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  /* ---------------- refs ---------------- */
  const fileInputRef = useRef(null);

  /* ---------------- helpers ---------------- */
  const openDialog = () => fileInputRef.current?.click();

  const handleFileChange = useCallback(
    (e) => {
      const f = e.target.files?.[0];
      if (!f?.type.startsWith("image/")) {
        message.error("Please upload a valid image");
        return;
      }
      const url = URL.createObjectURL(f);
      setFile(f);
      setPreviewUrl(url);
      form.setFieldValue(name, f);
    },
    [form, name]
  );

  const clearFile = (e) => {
    e?.stopPropagation();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    form.setFieldValue(name, null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openPreview = (e) => {
    e?.stopPropagation();
    if (previewUrl) setPreviewVisible(true);
  };

  /* revoke object URL on unmount */
  useEffect(
    () => () => previewUrl && URL.revokeObjectURL(previewUrl),
    [previewUrl]
  );

  /* ---------------- render ---------------- */
  return (
    <>
      {/* Upload area / thumbnail */}
      <div
        className={`relative group flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-blue-500 transition-colors ${width} ${height}`}
        onClick={openDialog}
      >
        {file ? (
          <>
            {/* image thumbnail */}
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />

            {/* clear button */}
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 bg-white border border-gray-300 rounded px-2 py-0.5 text-xs hover:bg-gray-50"
            >
              Clear
            </button>

            {/* eye overlay (only on hover) */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
              onClick={openPreview}
            >
              <FaEye style={{ fontSize: 32, color: "#ffffff" }} />
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <div className="text-xl">+</div>
            <div>Upload Photo</div>
            {recommendedSize && (
              <div className="text-xs text-gray-400 mt-1">
                (Recommended: {recommendedSize})
              </div>
            )}
          </div>
        )}

        {/* file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div>

      {/* ---------------- Modal (view-only) ---------------- */}
      <Modal
        open={previewVisible}
        footer={null}
        centered
        title="Image Preview"
        onCancel={() => setPreviewVisible(false)}
        width={600}
        destroyOnClose
      >
        <img
          src={previewUrl}
          alt="Preview"
          className="max-h-[80vh] w-full object-contain rounded-md"
        />
      </Modal>
    </>
  );
};

export default CustomUploadCard;
