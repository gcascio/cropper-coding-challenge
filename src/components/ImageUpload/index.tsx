import React, { useEffect, useState } from 'react';

import { getCroppedImg } from "../../helper/image";

import { ImageUpload } from "./ImageUpload";

import './ImageUpload.css';

interface ImageUploadContainerProps {
  name: string;
  image?: string;
  onCrop?: (data: Blob) => void;
}

interface ImageUploadContainerState {
  file: string;
  croppedFile: string;
  x: number;
  y: number;
  height: number;
  width: number;
}

const preventDefault = (e: any) => {
  e.preventDefault();
};

const ImageUploadContainer: React.FC<ImageUploadContainerProps> = ({
  name,
  image,
  onCrop,
}: ImageUploadContainerProps) => {
  const [state, setState] = useState<ImageUploadContainerState>({
    file: "",
    croppedFile: "",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    window.addEventListener('drop', preventDefault);
    window.addEventListener('dragover', preventDefault);

    return () => {
      window.removeEventListener('drop', preventDefault);
      window.removeEventListener('dragover', preventDefault);
    };
  }, []);

  const crop = () => {
    const { file, ...dimensions } = state;
    getCroppedImg(file, dimensions).then((data: Blob) => {
      onCrop ? onCrop(data) : displayCrop(data)
    });
  }

  const displayCrop = (image: Blob) => {
    const url = URL.createObjectURL(image);
    setState((state: ImageUploadContainerState) => ({
      ...state,
      croppedFile: url,
    }));
  }

  const pickImage = (file: any) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      setState((state: ImageUploadContainerState) => ({
        ...state,
        file: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  };

  const onDrop = (e: any) => {
    pickImage(e.dataTransfer.files[0]);
    e.target.value = '';
  };

  const onChange = (e: any) => {
    pickImage(e.target.files[0]);
    e.target.value = '';
  };

  const onDragStop = (e: any, data: any) => {
    const { x, y } = data;

    setState((state: ImageUploadContainerState) => ({
      ...state,
      x,
      y,
    }));
  }

  const onResizeStop = (e: any, direction: any, ref: any, delta: any, position: any) => {
    setState((state: ImageUploadContainerState) => ({
      ...state,
      ...position,
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10),
    }));
  };

  return (
    <>
      <ImageUpload
        size={{ width: state.width, height: state.height }}
        position={{ x: state.x, y: state.y }}
        key={state.file}
        file={state.file}
        onChange={onChange}
        onDrop={onDrop}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
      />
      {state.file && (
        <button
          onClick={crop}
        >
          Crop
        </button>
      )}
      {state.croppedFile && (
        <img
          className="image-preview"
          src={state.croppedFile}
          alt="cropped result"
        />
      )}
    </>
    );
};

export default ImageUploadContainer;
