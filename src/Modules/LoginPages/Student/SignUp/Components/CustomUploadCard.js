import React, { useRef, useState, useEffect } from "react";
import { Modal, Button, message, Slider, Row, Col } from "antd";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { GrRotateRight, GrRotateLeft } from "react-icons/gr";
import { PiCropLight, PiFlipHorizontalLight } from "react-icons/pi";

const CustomUploadCard = ({
  name,
  label,
  form,
  recommendedSize = "500x500",
  width = "w-full",
  height = "h-52",
  aspectRatio = 1,
}) => {
  const [currentFile, setCurrentFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);

  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const openFileDialog = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      message.error("Please upload a valid image.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setCurrentFile(file);
    setLocalPreview(previewUrl);
    setRotation(0);
    setFlipHorizontal(false);
    form.setFieldsValue({ [name]: file });
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setCurrentFile(null);
    setLocalPreview(null);
    form.setFieldsValue({ [name]: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    if (localPreview) {
      setPreviewVisible(true);
      setCrop({
        unit: "%",
        width: 100,
        aspect: aspectRatio,
      });
    }
  };

  const handleImageLoaded = (img) => {
    imgRef.current = img;
    return false; // suppress built-in crop auto-set
  };

  const handleCropSave = () => {
    if (
      !completedCrop ||
      !completedCrop.width ||
      !completedCrop.height ||
      !previewCanvasRef.current
    ) {
      message.error("Please crop the image.");
      return;
    }

    previewCanvasRef.current.toBlob(
      (blob) => {
        if (!blob) {
          message.error("Failed to crop image.");
          return;
        }

        const fileURL = URL.createObjectURL(blob);
        setLocalPreview(fileURL);
        setCurrentFile(blob);
        form.setFieldsValue({ [name]: blob });
        setPreviewVisible(false);
      },
      "image/jpeg",
      0.95
    );
  };

  const rotateImage = (deg) => setRotation((prev) => (prev + deg) % 360);
  const toggleFlip = () => setFlipHorizontal((prev) => !prev);

  useEffect(() => {
    if (
      !completedCrop ||
      !completedCrop.width ||
      !completedCrop.height ||
      !previewCanvasRef.current ||
      !imgRef.current
    )
      return;

    const canvas = previewCanvasRef.current;
    const image = imgRef.current;
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
              className="absolute top-2 right-2 bg-white border px-2 py-0.5 text-xs rounded hover:bg-gray-100"
            >
              Clear
            </button>
            <div
              className="absolute top-2 left-2 cursor-pointer"
              onClick={handlePreview}
            >
              <PiCropLight style={{ fontSize: 24, color: "#fff" }} />
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
          ref={fileInputRef}
          accept="image/*"
          name={name}
          onChange={handleFileChange}
          hidden
        />
      </div>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        title="Edit Image"
        width={1000}
      >
        <Row gutter={24}>
          <Col md={12}>
            <h4>Crop Image</h4>
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              onImageLoaded={handleImageLoaded}
              aspect={aspectRatio}
            >
              <img
                ref={imgRef}
                src={localPreview}
                alt="Crop Source"
                style={{
                  maxWidth: "100%",
                  transform: `rotate(${rotation}deg) scaleX(${
                    flipHorizontal ? -1 : 1
                  })`,
                }}
              />
            </ReactCrop>

            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-2">
                <Button icon={<GrRotateLeft />} onClick={() => rotateImage(-90)} />
                <Button icon={<GrRotateRight />} onClick={() => rotateImage(90)} />
              </div>
              <Button icon={<PiFlipHorizontalLight />} onClick={toggleFlip} />
            </div>

            <Slider
              min={0}
              max={360}
              value={rotation}
              onChange={setRotation}
              marks={{ 0: "0°", 90: "90°", 180: "180°", 270: "270°" }}
              className="mt-4"
            />
          </Col>

          <Col md={12}>
            <h4>Preview</h4>
            <div className="border p-2 rounded-md flex items-center justify-center min-h-[200px]">
              {completedCrop ? (
                <canvas ref={previewCanvasRef} style={{ maxWidth: "100%" }} />
              ) : (
                <div className="text-gray-400">Crop area will appear here</div>
              )}
            </div>
            <Button
              type="primary"
              className="mt-4 w-full"
              onClick={handleCropSave}
            >
              Save Cropped Image
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default CustomUploadCard;
