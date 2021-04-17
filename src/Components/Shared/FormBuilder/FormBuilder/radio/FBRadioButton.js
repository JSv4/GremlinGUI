// @flow

import React, { useState } from 'react';
import {Form, Popup, Radio} from 'semantic-ui-react';


export default function FBRadioButton(props) {
  const {
    label,
    tooltip,
    value,
    checked,
    name,
    onChange,
    required,
    disabled,
    autoFocus,
  } = props;
  const [id] = useState(`radio-${Math.floor(Math.random() * 1000000)}`);
  return (
    <Form.Field>
      { tooltip ? 
        <Popup 
          trigger={<Radio
            label={label}
            id={id}
            name={name}
            value={value}
            checked={checked}
            required={required}
            disabled={disabled}
            autoFocus={autoFocus}
            onChange={() => onChange(value)}
          />}
          content={tooltip}
        /> :
        <Radio
          label={label}
          id={id}
          name={name}
          value={value}
          checked={checked}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={() => onChange(value)}
        />
      }
    </Form.Field>
  );
}
