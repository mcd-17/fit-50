import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useEffect, useState } from 'react';

const ImageTrim = ({ setImageFile, images = [], max = 1 }) => {
    const [fileList, setFileList] = useState([]);
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        setImageFile(pre => pre = [...newFileList])
    };
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    useEffect(() => {
        if (images?.length > 0) {
            setFileList(images)
        }
    }, [images])

    return (
        <ImgCrop rotationSlider aspect={3 / 2} aspectSlider>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
            >
                {fileList?.length < max && 'Upload'}
            </Upload>
        </ImgCrop>
    );
};
export default ImageTrim;