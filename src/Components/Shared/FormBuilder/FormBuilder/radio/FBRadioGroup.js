// @flow

import React from 'react';
import { Form } from 'semantic-ui-react';
import FBRadioButton from './FBRadioButton';


export default function FBRadioGroup(props) {
  const {
    options,
    defaultValue,
    onChange,
    horizontal,
    id,
    autoFocus,
    disabled,
  } = props;
  const name = Math.random().toString();
  
  return (
    <Form>
      {options.map((option, index) => (
        <FBRadioButton
          value={option.value}
          label={option.label}
          tooltip={option.tooltip}
          id={id}
          name={name}
          key={option.value}
          checked={option.value === defaultValue}
          autoFocus={autoFocus && index === 1}
          onChange={onChange}
          disabled={disabled}
        />
      ))}
    </Form>
  );
}
