import React from 'react';
import { Upload, Icon } from 'antd';
import { message } from 'suid';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  // if (!isJpgOrPng) {
  //   message.error('You can only upload JPG/PNG file!');
  // }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return false;
}

class ExtUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imageUrl: props.value,
    };
  }

  handleChange = info => {
    getBase64(info.file, imageUrl =>
      this.setState(
        {
          imageUrl,
          loading: false,
        },
        () => {
          const { onChange } = this.props;
          if (onChange) {
            onChange(imageUrl);
          }
        },
      ),
    );
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;

    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}

export default ExtUpload;
