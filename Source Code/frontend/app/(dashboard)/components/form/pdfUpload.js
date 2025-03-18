import React from "react";
import { Upload, Button, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UploadFileComponent = ({ max = 1, name = "file", label = "Upload PDF" }) => {
  const props = {
    name: name,
    accept: ".pdf",
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        // Notify the user about the restriction
        alert("Only PDF files are allowed!");
      }
      return isPDF || Upload.LIST_IGNORE; // Prevent non-PDF files from being added
    },
    multiple: max > 1,
    maxCount: max, // Restricts the number of files uploaded
  };

  return (
    <Form.Item label={label} name={name}>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </Form.Item>
  );
};

export default UploadFileComponent;
