import React, { useState, useRef, useEffect } from "react";
import { Modal, message, Button, Row, Col, Slider } from "antd";
import { useFormInstance, useWatch, Form } from "antd/lib/form/Form";
import { PiCropLight, PiFlipHorizontalLight } from "react-icons/pi";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { GrRotateRight, GrRotateLeft } from "react-icons/gr";

const ImageUploader = ({
  name,
  previewTitle = "Image Preview",
  recommendedSize = "300x400px",
  aspectRatio = 3 / 4,
  width = "w-full",
  height = "h-32",
}) => {
  const form = useFormInstance();
  const fileInputRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  // watch the form field for changes
  const currentFile = useWatch(name, form);

  useEffect(() => {
    if (currentFile?.preview) {
      setLocalPreview(currentFile.preview);
    } else {
      setLocalPreview(null);
    }
  }, [currentFile]);

  // draw cropped image whenever crop, rotation, or flip changes
  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) return;
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = completedCrop.width * pixelRatio;
    canvas.height = completedCrop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    if (flipHorizontal) ctx.scale(-1, 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    ctx.restore();
  }, [completedCrop, rotation, flipHorizontal]);

  const openFileDialog = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      message.error("Please select a valid image file.");
      return;
    }
    const fileURL = URL.createObjectURL(selectedFile);
    form.setFieldsValue({ [name]: { file: selectedFile, preview: fileURL } });
    setRotation(0);
    setFlipHorizontal(false);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    form.setFieldsValue({ [name]: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    if (currentFile?.preview) {
      setPreviewVisible(true);
      setCrop({ unit: "%", width: 100, aspect: aspectRatio });
    }
  };

  const handleCropSave = () => {
    if (!completedCrop || !previewCanvasRef.current) {
      message.error("Please crop the image first");
      return;
    }
    previewCanvasRef.current.toBlob(
      (blob) => {
        if (!blob) {
          message.error("Failed to crop image");
          return;
        }
        const fileURL = URL.createObjectURL(blob);
        form.setFieldsValue({ [name]: { file: blob, preview: fileURL } });
        setPreviewVisible(false);
      },
      "image/jpeg",
      0.9
    );
  };

  const rotateImage = (deg) => setRotation((r) => (r + deg) % 360);
  const toggleFlip = () => setFlipHorizontal((f) => !f);

  return (
    <>
      <div
        className={`relative flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-blue-500 transition-colors ${width} ${height}`}
        onClick={openFileDialog}
      >
        {currentFile ? (
          <>
            <img
              src={localPreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
              onClick={handlePreview}
            />
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 bg-white border border-gray-300 rounded px-2 py-0.5 text-xs hover:bg-gray-50"
            >
              Clear
            </button>
            <div
              className="absolute top-2 left-2 cursor-pointer text-white"
              onClick={handlePreview}
            >
              <PiCropLight size={24} />
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <div className="text-xl">+</div>
            <div>Upload Photo</div>
            {recommendedSize && (
              <div className="text-xs text-gray-400 mt-1">
                (Recommended size: {recommendedSize})
              </div>
            )}
          </div>
        )}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <Modal
        open={previewVisible}
        title={previewTitle}
        onCancel={() => setPreviewVisible(false)}
        onOk={handleCropSave}
        footer={[
          <Button key="cancel" onClick={() => setPreviewVisible(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleCropSave}>
            Save Cropped Image
          </Button>,
        ]}
        width={1000}
        centered
      >
        <Row gutter={16}>
          <Col span={12}>
            <h4 className="text-center mb-2">Crop Image</h4>
            <div className="flex justify-center items-center mb-4">
              <ReactCrop
                crop={crop}
                onChange={setCrop}
                onComplete={setCompletedCrop}
                aspect={aspectRatio}
              >
                <img
                  ref={imgRef}
                  src={localPreview}
                  alt="To crop"
                  style={{
                    maxWidth: "100%",
                    transform: `rotate(${rotation}deg) scaleX(${
                      flipHorizontal ? -1 : 1
                    })`,
                  }}
                />
              </ReactCrop>
            </div>
            <div className="flex justify-between mb-4">
              <Button
                icon={<GrRotateLeft />}
                onClick={() => rotateImage(-90)}
              />
              <Slider
                min={0}
                max={360}
                value={rotation}
                onChange={rotateImage}
                marks={{
                  0: "0°",
                  90: "90°",
                  180: "180°",
                  270: "270°",
                  360: "360°",
                }}
              />
              <Button
                icon={<GrRotateRight />}
                onClick={() => rotateImage(90)}
              />
              <Button icon={<PiFlipHorizontalLight />} onClick={toggleFlip} />
            </div>
          </Col>
          <Col span={12}>
            <h4 className="text-center mb-2">Preview</h4>
            <div
              className="border rounded-md p-2 flex justify-center items-center"
              style={{ aspectRatio: `${aspectRatio}`, height: "30rem" }}
            >
              {completedCrop ? (
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div className="text-gray-400">Crop area will appear here</div>
              )}
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ImageUploader;
