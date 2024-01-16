import { Button, Tabs, TabsProps, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SignaturePad from '../../signature_pad';
import { ITextType, SignatureText, TEXT_VALUES } from '../SignatureText/SignatureText';
import styles from './styles.module.scss';

const { Title, Text } = Typography;

enum SIGNATURE_TYPE {
  DRAW = '1',
  TEXT = '2'
}

interface Props {
  setIsShowSign: (v: boolean) => void;
  onSave: (img: string) => void;
  defaultSignature?: string;
}

export const Signature: React.FC<Props> = ({ setIsShowSign, onSave, defaultSignature }) => {
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
  const [isDirtyCanvas, setIsDirtyCanvas] = useState(false);
  const [signatureText, setSignatureText] = useState(defaultSignature ?? 'Signature');
  const [textType, setTextType] = useState<ITextType>(TEXT_VALUES[0]);
  const resizeCanvas = useCallback(() => {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvasRef.current.width = canvasRef.current.offsetWidth < 2000 && canvasRef.current.offsetWidth * ratio;
    canvasRef.current.height = 500;
    canvasRef.current.getContext("2d").scale(ratio, ratio);
    signaturePad?.clear();
  }, [canvasRef.current, signaturePad]);

  useEffect(() => {
    if (canvasRef.current) {
      const onCanvasChange = () => {
        setIsDirtyCanvas(true);
      };
      canvasRef.current.addEventListener('mouseup', onCanvasChange);
      const signaturePadNew = new SignaturePad(canvasRef.current);
      setSignaturePad(signaturePadNew);
      window.onresize = resizeCanvas;
      resizeCanvas();
      return () => canvasRef.current.removeEventListener('mouseup', onCanvasChange);
    }
  }, [canvasRef.current]);

  useEffect(() => {
    if (activeTab === SIGNATURE_TYPE.DRAW) {
      clearCanvas();
      resizeCanvas();
    }
  }, [activeTab]);

  const clearCanvas = () => {
    signaturePad?.clear();
    setIsDirtyCanvas(false);
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
      setSignatureText('');
      setIsShowSign(false);
      return;
    }
    if (SIGNATURE_TYPE.DRAW && isDirtyCanvas) {
      const dataURL = signaturePad.toDataURL();
      onSave(dataURL);
    }
    setIsShowSign(false);
    clearCanvas();
    setSignatureText('');
  }

  const determineFontHeight = (fontStyle: ITextType, text: string) => {
    const body = document.getElementsByTagName("body")[0];
    const dummy = document.createElement("div");
    const dummyText = document.createTextNode(text);
    dummy.appendChild(dummyText);
    dummy.style.fontFamily = fontStyle.fontFamily;
    dummy.style.fontSize = fontStyle.fontSize;
    body.appendChild(dummy);
    const result = dummy.offsetHeight;
    body.removeChild(dummy);
    return result;
  };

  const textToCanvas = (text: string) => {
    const result = determineFontHeight(textType, text);
    // @ts-ignore
    const cloneCanvas: HTMLCanvasElement = document.createElement('canvas');
    if (cloneCanvas) {
      ctx.font = textType.font;
      const measureText = ctx.measureText(text);
      const textHeight = result;
      cloneCanvas.width = measureText.width + 30;
      cloneCanvas.height = textHeight;
      const cloneCtx = cloneCanvas.getContext("2d");
      if (cloneCtx) {
        cloneCtx.font = textType.font;
        cloneCtx.textBaseline="top";
        cloneCtx.fillText(text, 20, -10);
        onSave(cloneCanvas.toDataURL());
        cloneCanvas.remove();
      }
    }
  }

  const isDisabledSave = useMemo(() => {
    return activeTab === SIGNATURE_TYPE.DRAW && !isDirtyCanvas || activeTab === SIGNATURE_TYPE.TEXT && !signatureText;
  }, [activeTab, signatureText, isDirtyCanvas]);

  return (
    <div>
      <div className={styles.titleContainer}>
        <Title
          level={3}
        >
          Add Signature
        </Title>
      </div>
      <Tabs
        size="large"
        items={items}
        onChange={(a) => setActiveTab(a as SIGNATURE_TYPE)}
      />
      <div className={styles.container}>
        {activeTab === SIGNATURE_TYPE.TEXT ? (
          <SignatureText
            value={signatureText}
            textType={textType}
            onChange={setSignatureText}
            onChangeTextType={setTextType}
          />
        ) : null}
        <div className={activeTab === SIGNATURE_TYPE.DRAW ? styles.signaturePadBody : styles.signaturePadBodyHide}>
          <canvas id="mainCanvas" style={{width :'100%', height: '100%'}} ref={canvasRef}></canvas>
        </div>
        {activeTab === SIGNATURE_TYPE.DRAW ? (
          <div className={styles.clearWrapper}>
            {!isDirtyCanvas ? (
              <Text className={styles.signText}>Sign Here</Text>
            ) : (
              <Button className={styles.clearSignBtn} type="text" onClick={clearCanvas}>Clear Signature</Button>
            )}
          </div>
        ) : null}
      </div>
      <div className={styles.bottomActions}>
        <Button onClick={() => setIsShowSign(false)}>Close</Button>
        <Button disabled={isDisabledSave} onClick={saveImage} type="primary">Save</Button>
      </div>
    </div>
  )
}
