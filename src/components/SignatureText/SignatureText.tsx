import { Button, Input, Radio, Typography } from 'antd';
import React, { useState } from 'react';

import styles from './styles.module.scss';

const { Text } = Typography;

interface Props {
  value: string;
  onChange: (v: string) => void;
  onChangeTextType: (type: ITextType) => void;
  textType: ITextType;
}

export enum TEXT_TYPE {
  BRUSH= 'brush',
  PAPYRUS = 'papyrus',
  COURIER= 'courier',
  TIMES = 'times',
}

export interface ITextType {
  key: TEXT_TYPE,
  font: string;
  fontSize: string;
  fontFamily: string;
}

export const TEXT_VALUES: ITextType[] = [
  {
    key: TEXT_TYPE.BRUSH,
    font: '250px Brush Script MT, cursive',
    fontSize: '100px',
    fontFamily: "'Brush Script MT', cursive",
  },
  {
    key: TEXT_TYPE.PAPYRUS,
    font: '250px Copperplate, fantasy',
    fontSize: '100px',
    fontFamily: "'Copperplate', fantasy",
  },
  {
    key: TEXT_TYPE.COURIER,
    font: '250px Courier New, monospace',
    fontSize: '100px',
    fontFamily: "'Courier New', monospace",
  },
  {
    key: TEXT_TYPE.TIMES,
    font: '250px Times New Roman, serif',
    fontSize: '100px',
    fontFamily: "'Times New Roman', serif",
  },
];

export const SignatureText: React.FC<Props> = ({ value, onChange, textType, onChangeTextType }) => {
  const changeTextType = (newType: TEXT_TYPE) => {
    const typeValue = TEXT_VALUES.find(type => type.key === newType);
    if (typeValue) {
      onChangeTextType(typeValue);
    }
  };

  const clearSignature = () => {
    onChange('');
  }
  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <Input
          className={`${styles[textType.key]} ${styles.mainFontSize} ${styles.inputContainer}`}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      <div className={styles.clearSIgnWrapper}>
        <Button className={styles.clearSignBtn} type="text" onClick={clearSignature}>Clear Signature</Button>
      </div>
      <Radio.Group className={styles.groupContainer} value={textType.key}>
        {TEXT_VALUES.map((type, index) => (
          <div
            key={type.key}
            onClick={() => changeTextType(type.key)}
            className={styles.radioWrapper}
          >
            <Radio value={type.key}>
              <Text className={`${styles[type.key]} ${styles.mainFontSize}`}>{value || 'Signature'}</Text>
            </Radio>
          </div>
        ))}
      </Radio.Group>
      <div>
      </div>
    </div>
  );
};
