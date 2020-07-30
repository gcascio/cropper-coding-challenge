import React from 'react';
import { Rnd } from "react-rnd";

import './ImageUpload.css';

interface ImageUploadProps {
  onChange: (e: any) => void;
  onDrop: (e: any) => void;
  onDragStop: (e: any, data: any) => void;
  onResizeStop: (e: any, direction: any, ref: any, delta: any, position: any) => void;
  file: string;
  size: {
    height: number;
    width: number;
  };
  position:{
    x: number;
    y: number;
  };
}

const preventDefault = (e: any) => {
  e.preventDefault();
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  file,
  size,
  position,
  onChange,
  onDrop,
  onDragStop,
  onResizeStop,
}: ImageUploadProps) => {

  return (
    <>
      <div
        className="image-upload"
        onDrop={onDrop}
        onDragOver={preventDefault}
        style={{
          backgroundImage: `url(${file})`,
        }}
      >
        {file && (
          <Rnd
            size={size}
            position={position}
            className="crop-selector"
            bounds="parent"
            onDragStop={onDragStop}
            onResizeStop={onResizeStop}
          />
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
      />
    </>
  );
};
