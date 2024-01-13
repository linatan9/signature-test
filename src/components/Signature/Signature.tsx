import { Tabs, TabsProps, Button } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import SignaturePad from '../../signature_pad';
import styles from './styles.module.css';
import { ITextType, SignatureText, TEXT_VALUES } from '../SignatureText/SignatureText';

enum SIGNATURE_TYPE {
  DRAW = '1',
  TEXT = '2'
}

interface Props {
  setIsShowSign: (v: boolean) => void;
  onSave: (img: string) => void;
}

export const Signature: React.FC<Props> = ({ setIsShowSign, onSave }) => {
  const [activeTab, setActiveTab] = useState<SIGNATURE_TYPE>(SIGNATURE_TYPE.DRAW)
  const items: TabsProps['items'] = [
    {
      key: SIGNATURE_TYPE.DRAW,
      label: 'Draw',
      children: null,
    },
    {
      key: SIGNATURE_TYPE.TEXT,
      label: 'Text',
      children: null,
    },
  ];
  const canvasRef: any = useRef<HTMLCanvasElement>(null);
  const ctx = canvasRef.current?.getContext("2d");
  const [signaturePad, setSignaturePad] = useState<any>();
  const [signatureText, setSignatureText] = useState('Signature');
  const [textType, setTextType] = useState<ITextType>(TEXT_VALUES[0]);
  const resizeCanvas = useCallback(() => {
    console.log(canvasRef.current.offsetHeight, 'canvasRef.current.offsetHeight');
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
    canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
    canvasRef.current.getContext("2d").scale(ratio, ratio);
    signaturePad?.clear();
  }, [canvasRef.current, signaturePad]);

  useEffect(() => {
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (activeTab === SIGNATURE_TYPE.DRAW && signatureText && ctx) {
      textToCanvas(signatureText);
    }
  }, [activeTab, signatureText, textType, ctx]);

  useEffect(() => {
    if (canvasRef.current) {
      const signaturePadNew = new SignaturePad(canvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)'
      });
      setSignaturePad(signaturePadNew);
      window.onresize = resizeCanvas;
      resizeCanvas();
    }
  }, [canvasRef.current]);

  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const saveImage = () => {
    if (signatureText) {
      textToCanvas(signatureText);
    }
    const dataURL = signaturePad.toDataURL();
    onSave(dataURL);
    clearCanvas();
    setSignatureText('');
  }

  const textToCanvas = (text: string) => {
    const textWidth = ctx.measureText(text).width
    ctx.font = textType.font;
    clearCanvas();
    ctx.fillText(text, canvasRef.current.width / 4 - (textWidth * 1.5), canvasRef.current.height / 4 + 12);
  }

  return (
    <div>
      <Tabs items={items} onChange={(a) => setActiveTab(a as SIGNATURE_TYPE)} />
      <Button onClick={clearCanvas} type="primary">Clear</Button>
      {activeTab === SIGNATURE_TYPE.TEXT ? (
        <SignatureText
          value={signatureText}
          textType={textType}
          onChange={setSignatureText}
          onChangeTextType={setTextType}
        />
      ) : null}
      <div className={styles.signaturePadBody}>
        <canvas height={400} ref={canvasRef}></canvas>
      </div>
      <div className={styles.bottomActions}>
        <Button onClick={() => setIsShowSign(false)}>Close</Button>
        <Button onClick={saveImage} type="primary">Save</Button>
      </div>
    </div>
  )
}
