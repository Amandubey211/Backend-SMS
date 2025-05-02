import React, { useState, useRef, useEffect } from "react";
import { Modal, message, Button, Row, Col, Radio, Slider } from "antd";
import { useFormikContext, getIn } from "formik";
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
  const { setFieldValue, values } = useFormikContext();
  const fileInputRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const currentFile = getIn(values, name);

  useEffect(() => {
    if (currentFile && currentFile.preview) {
      setLocalPreview(currentFile.preview);
    } else {
      setLocalPreview(null);
    }
  }, [currentFile]);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    ctx.rotate((rotation * Math.PI) / 180);

    if (flipHorizontal) {
      ctx.scale(-1, 1);
    }

    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    ctx.restore();
  }, [completedCrop, rotation, flipHorizontal]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      message.error("Please select a valid image file.");
      return;
    }

    const fileURL = URL.createObjectURL(selectedFile);
    setFieldValue(name, {
      file: selectedFile,
      preview: fileURL,
    });
    setRotation(0);
    setFlipHorizontal(false);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFieldValue(name, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    if (currentFile && currentFile.preview) {
      setPreviewVisible(true);
      setCrop({
        unit: "%",
        width: 100,
        aspect: aspectRatio,
      });
    }
  };

  const handleCrop = () => {
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
        setFieldValue(name, {
          file: blob,
          preview: fileURL,
        });
        setPreviewVisible(false);
      },
      "image/jpeg",
      0.9
    );
  };

  const rotateImage = (degrees) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

  const toggleFlipHorizontal = () => {
    setFlipHorizontal((prev) => !prev);
  };

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
              className="absolute top-2 right-2 bg-white border border-gray-300 rounded px-2 py-0.5 text-xs cursor-pointer hover:bg-gray-50"
            >
              Clear
            </button>
            <div
              className="absolute top-2 left-2 cursor-pointer"
              onClick={handlePreview}
            >
              <PiCropLight style={{ fontSize: 25, color: "#ffff" }} />
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
          name={name}
        />
      </div>

      <Modal
        open={previewVisible}
        footer={null}
        centered
        title={previewTitle}
        onCancel={() => setPreviewVisible(false)}
        onOk={handleCrop}
        width={1000} // Adjust modal width for better view of the cropper and layout
      >
        <Row gutter={[16, 16]}>
          {/* Left Column (Image Cropping) */}
          <Col xs={24} md={12} className=" h-full  w-full  p-3">
            <h4 className="text-center mb-2">Crop Image</h4>
            <div className="my-8 flex flex-col justify-center  items-center">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                className="max-h-[50vh]"
              >
                <img
                  ref={imgRef}
                  src={localPreview}
                  alt="Crop preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "50vh",
                    transform: `rotate(${rotation}deg) scaleX(${
                      flipHorizontal ? -1 : 1
                    })`,
                  }}
                />
              </ReactCrop>
            </div>

            <div className="flex justify-between items-center mb-4  px-5 ">
              <div className="flex space-x-2">
                <Button
                  icon={<GrRotateLeft />}
                  onClick={() => rotateImage(-90)}
                />
                <Button
                  icon={<GrRotateRight />}
                  onClick={() => rotateImage(90)}
                />
              </div>
              <Button
                icon={<PiFlipHorizontalLight />}
                onClick={toggleFlipHorizontal}
              />
              {/* <Radio.Group
                value={aspectRatio}
                onChange={(e) =>
                  setCrop((prev) => ({ ...prev, aspect: e.target.value }))
                }
              >
                <Radio.Button value={1}>1:1</Radio.Button>
                <Radio.Button value={3 / 4}>3:4</Radio.Button>
                <Radio.Button value={16 / 9}>16:9</Radio.Button>
                <Radio.Button value={0}>Free</Radio.Button>
              </Radio.Group> */}
            </div>
            <div className="px-5">
              <Slider
                min={0}
                max={360}
                value={rotation}
                onChange={setRotation}
                marks={{
                  0: "0°",
                  90: "90°",
                  180: "180°",
                  270: "270°",
                  360: "360°",
                }}
              />
            </div>
          </Col>

          <Col xs={24} md={12} className="flex flex-col h-full p-3">
            {/* Preview Section */}
            <div className="flex-1 overflow-hidden">
              <h4 className="text-center mb-2">Preview</h4>
              <div
                className=" border rounded-md p-2 flex justify-center items-center h-[30rem] w-full"
                style={{ aspectRatio: `${aspectRatio}` }}
              >
                {completedCrop ? (
                  <canvas
                    ref={previewCanvasRef}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div className="text-gray-400 text-center p-4">
                    Crop area will appear here
                  </div>
                )}
              </div>
            </div>

            {/* Options Section */}
            <div className="flex-1 mt-4">
              <Button
                type="primary"
                className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white mt-4"
                onClick={handleCrop}
                block
              >
                Save Cropped Image
              </Button>
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ImageUploader;
