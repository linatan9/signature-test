import { Button, Tabs, TabsProps } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import SignaturePad from '../../signature_pad';
import { ITextType, SignatureText, TEXT_VALUES } from '../SignatureText/SignatureText';
import styles from './styles.module.css';

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
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
    const canvasHeight = canvasRef.current.offsetHeight * ratio;
    canvasRef.current.height = canvasHeight === 0 ? 300 : canvasHeight;
    canvasRef.current.getContext("2d").scale(ratio, ratio);
    signaturePad?.clear();
  }, [canvasRef.current, signaturePad]);

  useEffect(() => {
    if (canvasRef.current) {
      const signaturePadNew = new SignaturePad(canvasRef.current);
      setSignaturePad(signaturePadNew);
      window.onresize = resizeCanvas;
      resizeCanvas();
    }
  }, [canvasRef.current]);

  const clearCanvas = () => {
    signaturePad.clear();
  };

  // const getTopBottomPoints = () => {
  //   const points = signaturePad.getPointsData().flat(1);
  //   let topLeftX;
  //   let topLeftY;
  //   let bottomRightX;
  //   let bottomRightY;
  //   if (points.length > 2) {
  //     topLeftX = points[0].x;
  //     topLeftY = points[0].y;
  //     bottomRightX = points[1].x;
  //     bottomRightY = points[1].y;
  //     for (let i = 2; i < points.length - 1; i++) {
  //       if (points[i].x < topLeftX) {
  //         topLeftX = points[i].x;
  //       }
  //       if (points[i].y < topLeftY) {
  //         topLeftY = points[i].y;
  //       }
  //       if (points[i].x > bottomRightX) {
  //         bottomRightX = points[i].x;
  //       }
  //       if (points[i].y > bottomRightY) {
  //         bottomRightY = points[i].x;
  //       }
  //     }
  //   }
  //   return { topLeft: { x: topLeftX, y: topLeftY }, bottomRight: { x: bottomRightX, y: bottomRightY } };
  // }

  const saveImage = () => {
    if (signatureText && activeTab === SIGNATURE_TYPE.TEXT) {
      textToCanvas(signatureText);
      return;
    }
    const dataURL = signaturePad.toDataURL();
    onSave(dataURL);
    clearCanvas();
    setSignatureText('');
  }

  const textToCanvas = (text: string) => {
    // @ts-ignore
    const cloneCanvas: HTMLCanvasElement = document.getElementById('mainCanvas')?.cloneNode();
    if (cloneCanvas) {
      ctx.font = textType.font;
      const measureText = ctx.measureText(text);
      const textHeight = measureText.actualBoundingBoxAscent + measureText.actualBoundingBoxDescent;
      cloneCanvas.width = measureText.width + 40;
      cloneCanvas.height = textHeight + 50;
      const cloneCtx = cloneCanvas.getContext("2d");
      if (cloneCtx) {
        cloneCtx.font = textType.font;
        cloneCtx.textBaseline="top";
        cloneCtx.fillText(text, 20, 0);
        onSave(cloneCanvas.toDataURL());
        cloneCanvas.remove();
      }
    }
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
        <canvas id="mainCanvas" height={400} ref={canvasRef}></canvas>
      </div>
      <div className={styles.bottomActions}>
        <Button onClick={() => setIsShowSign(false)}>Close</Button>
        <Button onClick={saveImage} type="primary">Save</Button>
      </div>
    </div>
  )
}
