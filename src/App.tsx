import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { Signature } from './components/Signature/Signature';
import styles from './App.module.css';

function App() {
  const [isShowSign, setIsShowSign] = useState(false);
  const [signatureImage, setSignatureImage] = useState('');
  const onChangeVisibility = () => {
    setIsShowSign(!isShowSign);
  }

  const onSave = (img: string) => {
    console.log(img, 'img');
    setSignatureImage(img);
    onChangeVisibility();
  };
  return (
    <div className={styles.container}>
      <Modal
        centered
        width="80%"
        open={isShowSign}
        okText="Save"
        footer={null}
      >
        <Signature setIsShowSign={setIsShowSign} onSave={onSave} />
      </Modal>
      <div onClick={onChangeVisibility} className={styles.signatureContainer}>
        {signatureImage ? (
          <img style={{width: '100%', height: '100%'}} src={signatureImage} />
        ) : null}
      </div>
      <Button type="primary" onClick={() => setSignatureImage('')}>Clear</Button>
    </div>
  );
}

export default App;
