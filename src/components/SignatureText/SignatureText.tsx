import { Input, Radio, Typography } from 'antd';
import React, { useState } from 'react';

import styles from './styles.module.css';

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
}

export const TEXT_VALUES: ITextType[] = [
  {
    key: TEXT_TYPE.BRUSH,
    font: '250px Brush Script MT, cursive'
  },
  {
    key: TEXT_TYPE.PAPYRUS,
    font: '250px Papyrus, fantasy'
  },
  {
    key: TEXT_TYPE.COURIER,
    font: '250px Courier New, monospace'
  },
  {
    key: TEXT_TYPE.TIMES,
    font: '250px Times New Roman, serif'
  },
];

export const SignatureText: React.FC<Props> = ({ value, onChange, textType, onChangeTextType }) => {
  const changeTextType = (newType: TEXT_TYPE) => {
    const typeValue = TEXT_VALUES.find(type => type.key === newType);
    if (typeValue) {
      onChangeTextType(typeValue);
    }
  };
  console.log(textType.key, 'typeValue')


  return (
    <div className={styles.container}>
      <Input
        className={`${styles[textType.key]} ${styles.mainFontSize} ${styles.inputContainer}`}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <Radio.Group className={styles.groupContainer} value={textType.key}>
        {TEXT_VALUES.map((type) => (
          <div key={type.key} onClick={() => changeTextType(type.key)} className={styles.radioWrapper}>
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
