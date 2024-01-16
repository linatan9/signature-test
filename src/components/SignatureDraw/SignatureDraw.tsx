import { Button } from 'antd';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import SignaturePad from '../../signature_pad';

import styles from './styles.module.scss';

interface Props {
  onSave: (image: string) => void
}
export const SignatureDraw: React.FC<Props> = memo(({ onSave }) => {
  const canvasRef: any = useRef<HTMLCanvasElement>(null);
  const [signaturePad, setSignaturePad] = useState<any>();
  const resizeCanvas = useCallback(() => {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
    canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
    canvasRef.current.getContext("2d").scale(ratio, ratio);
    signaturePad?.clear();
  }, [canvasRef.current, signaturePad]);

  const download = () => {
    const dataURL = signaturePad.toDataURL();
    const blob = dataURLToBlob(dataURL);
    console.log(blob, 'BLOCB========', dataURL);
    // var url = window.URL.createObjectURL(blob);
    // var a = document.createElement("a");
    // a.style = "display: none";
    // a.href = url;
    // a.download = filename;
    // document.body.appendChild(a);
    // a.click();
    // window.URL.revokeObjectURL(url);
  }

  const textToCanvas = () => {
    const UserName = 'user name';
    const ctx =  canvasRef.current.getContext("2d");
    const dashLen = 0;
    let dashOffset = dashLen;
    const speed = 1000;
    const txt = UserName;
    let x = 0;
    let i = 0;
    ctx.font = "16px Comic Sans MS, cursive, TSCu_Comic, sans-serif";
    ctx.lineWidth = 1; ctx.lineJoin = "round"; ctx.globalAlpha = 2/3;
    ctx.strokeStyle = ctx.fillStyle = "#1f2f90";
    loop();
    function loop() {
      ctx.clearRect(x, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]);
      dashOffset -= speed;
      ctx.strokeText(txt, x, 25);
      ctx.strokeText(txt, x, 25);

    //   if (dashOffset > 0) requestAnimationFrame(loop);
    // else {
    //   console.log(txt[i], 'txt[i]');
    //     ctx.fillText (txt[i], x, 25);
    //     dashOffset = dashLen;
    //     x += ctx.measureText(txt[i++]).width + ctx.lineWidth * Math.random();
    //     ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random());
    //     ctx.rotate(Math.random() * 0.005);
    //     if (i < txt.length) requestAnimationFrame(loop);
    //   }
    }
  }

  const dataURLToBlob  = (dataURL: string) => {
    // Code taken from https://github.com/ebidel/filer.js
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }
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
      <div>
        <Button onClick={textToCanvas}>
          Save
        </Button>
      </div>
    </div>
  );
});
