// @flow

import React from 'react';
import { 
  Input, 
  Checkbox, 
  Divider, 
  Popup,
  Form
} from 'semantic-ui-react';

// specify the inputs required for a number type object
function CardNumberParameterInputs({
  parameters,
  onChange: onChangeFunc,
}) {
  return (
    <Form style={{marginBottom:'1rem'}}>
      <Popup
        content='Require number to be a multiple of this number'
        target={
          <Form.Input
            label='Multiple of: '
            value={parameters.multipleOf ? parameters.multipleOf : ''}
            placeholder='ex: 2'
            key='multipleOf'
            type='number'
            onChange={(ev) => {
              let newVal = parseFloat(ev.target.value);
              if (Number.isNaN(newVal)) newVal = null;
              onChangeFunc({
                ...parameters,
                multipleOf: newVal,
              });
            }}
          />
        }
      />    
      <Form.Input
        label='Minimum'
        value={parameters.minimum || parameters.exclusiveMinimum || ''}
        placeholder='ex: 3'
        key='minimum'
        type='number'
        onChange={(ev) => {
          let newVal = parseFloat(ev.target.value);
          if (Number.isNaN(newVal)) newVal = null;
          // change either min or exclusiveMin depending on which one is active
          if (parameters.exclusiveMinimum) {
            onChangeFunc({
              ...parameters,
              exclusiveMinimum: newVal,
              minimum: null,
            });
          } else {
            onChangeFunc({
              ...parameters,
              minimum: newVal,
              exclusiveMinimum: null,
            });
          }
        }}
        className='card-modal-number'
      />  
      <Checkbox
        key='exclusiveMinimum'
        onChange={() => {
          const newMin = parameters.minimum || parameters.exclusiveMinimum;
          if (parameters.exclusiveMinimum) {
            onChangeFunc({
              ...parameters,
              exclusiveMinimum: null,
              minimum: newMin,
            });
          } else {
            onChangeFunc({
              ...parameters,
              exclusiveMinimum: newMin,
              minimum: null,
            });
          }
        }}
        checked={!!parameters.exclusiveMinimum}
        disabled={!parameters.minimum && !parameters.exclusiveMinimum}
        label='Exclusive Minimum (e.g. greater than value, not greater than or equal to)'
      />
      <Form.Input
        label="Maximum: "
        value={parameters.maximum || parameters.exclusiveMaximum || ''}
        placeholder='ex: 8'
        type='number'
        onChange={(ev) => {
          let newVal = parseFloat(ev.target.value);
          if (Number.isNaN(newVal)) newVal = null;
          // change either max or exclusiveMax depending on which one is active
          if (parameters.exclusiveMinimum) {
            onChangeFunc({
              ...parameters,
              exclusiveMaximum: newVal,
              maximum: null,
            });
          } else {
            onChangeFunc({
              ...parameters,
              maximum: newVal,
              exclusiveMaximum: null,
            });
          }
        }}
      />
      <Checkbox
        key='exclusiveMaximum'
        onChange={() => {
          const newMax = parameters.maximum || parameters.exclusiveMaximum;
          if (parameters.exclusiveMaximum) {
            onChangeFunc({
              ...parameters,
              exclusiveMaximum: null,
              maximum: newMax,
            });
          } else {
            onChangeFunc({
              ...parameters,
              exclusiveMaximum: newMax,
              maximum: null,
            });
          }
        }}
        checked={!!parameters.exclusiveMaximum}
        disabled={!parameters.maximum && !parameters.exclusiveMaximum}
        label='Exclusive Maximum (e.g. less than value, not less than or equal to)'
      />
    </Form>
  );
}

function NumberField({
  parameters,
  onChange: onChangeFunc,
}) {
  return (
    <>
      <Divider horizontal>Default Number:</Divider>
      <div style={{marginTop:'1rem'}}>
        <Input
          value={parameters.default}
          placeholder='Default'
          type='number'
          onChange={(ev) =>
            onChangeFunc({
              ...parameters,
              default: parseFloat(ev.target.value),
            })
          }
          className='card-number'
        />
      </div>
    </>
  );
}

const numberInputs = {
  integer: {
    displayName: 'Integer',
    matchIf: [
      {
        types: ['integer'],
      },
      {
        types: ['integer'],
        widget: 'number',
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {},
    type: 'integer',
    cardBody: NumberField,
    modalBody: CardNumberParameterInputs,
  },
  number: {
    displayName: 'Number',
    matchIf: [
      {
        types: ['number'],
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {},
    type: 'number',
    cardBody: NumberField,
    modalBody: CardNumberParameterInputs,
  },
};

export default numberInputs;
