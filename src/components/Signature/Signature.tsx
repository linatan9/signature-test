import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import SignaturePad from '../../signature_pad';

import styles from './styles.module.css';


export const Signature = memo(() => {
  const canvasRef: any = useRef<HTMLCanvasElement>(null);
  const [signaturePad, setSignaturePad] = useState<any>();
  const resizeCanvas = useCallback(() => {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
    canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
    canvasRef.current.getContext("2d").scale(ratio, ratio);
    signaturePad?.clear();
  }, [canvasRef.current, signaturePad]);
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
  return (
    <div id="signature-pad" className={styles.signaturePad}>
      <div className={styles.signaturePadBody}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  )
})
