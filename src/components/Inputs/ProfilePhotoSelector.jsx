import React, { useRef, useState, useEffect } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const InputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
    } else if (typeof image === "string") {
      setPreviewUrl(image);
    } else if (image instanceof File) {
      setPreviewUrl(URL.createObjectURL(image));
    }
  }, [image]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    InputRef.current.click();
  };
  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={InputRef}
        className="hidden"
      ></input>
      {!previewUrl ? (
        <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
          <LuUser className="text-4xl text-primary"></LuUser>
          <button type="button" className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer" onClick={onChooseFile}>
            <LuUpload></LuUpload>
          </button>
        </div>
      ) : (
        <div className="relative">
          <img src={previewUrl} alt="profilePic" className="w-20 h-20 rounded-full object-cover"></img>
          <button className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1" type="button" onClick={handleRemoveImage}>
            <LuTrash></LuTrash>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
