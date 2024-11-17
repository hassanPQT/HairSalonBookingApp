/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UploadImage = ({ previewImage, onChange }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState(previewImage);
    const [fileList, setFileList] = useState([]);
  
    useEffect(() => {
      if (previewImage && previewImage.length > 0) {
        setFileList(previewImage.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url: url,
        })));
      }
    }, [previewImage]);
  
    const handlePreview = async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImageUrl(file.url || file.preview);
      setPreviewOpen(true);
    };
  
    const handleChange = ({ fileList: newFileList }) => {
      setFileList(newFileList);
      if (typeof onChange === 'function') {
        onChange(newFileList);
      }
    };
  

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Image
        style={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
        }}
        src={previewImageUrl}
      />
    </>
  );
};

export default UploadImage;