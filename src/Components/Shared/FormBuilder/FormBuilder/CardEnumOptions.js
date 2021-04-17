// @flow

import * as React from 'react';
import { Button, Form } from 'semantic-ui-react';

// Input field corresponding to an array of values, add and remove
export default function CardEnumOptions({
  initialValues,
  names,
  showNames,
  onChange,
  type,
}) {

  const possibleValues = [];
  for (let index = 0; index < initialValues.length; index += 1) {
    const value = initialValues[index];
    let name = `${value}`;
    if (names && index < names.length) name = names[index];
    possibleValues.push(
      <Form.Group>
        <Form.Input
          value={value === undefined || value === null ? '' : value}
          placeholder='Possible Value'
          key={`val-${index}`}
          type={type === 'string' ? 'text' : 'number'}
          onChange={(ev) => {
            let newVal;
            switch (type) {
              case 'string':
                newVal = ev.target.value;
                break;
              case 'number':
              case 'integer':
                newVal = parseFloat(ev.target.value);
                if (Number.isInteger(newVal))
                  newVal = parseInt(ev.target.value, 10);
                if (Number.isNaN(newVal)) newVal = type === 'string' ? '' : 0;
                break;
              default:
                throw new Error(`Enum called with unknown type ${type}`);
            }
            onChange(
              [
                ...initialValues.slice(0, index),
                newVal,
                ...initialValues.slice(index + 1),
              ],
              names,
            );
          }}
        />
        {
          showNames ? <Form.Input
            value={name || ''}
            placeholder='Label'
            key={`name-${index}`}
            type='text'
            onChange={(ev) => {
              if (names)
                onChange(initialValues, [
                  ...names.slice(0, index),
                  ev.target.value,
                  ...names.slice(index + 1),
                ]);
            }}
            style={{ display: showNames ? 'initial' : 'none' }}
          /> : <></>
        }
        <div style={{
          display: 'flex',
          flex: 1,  
          flexDirection: 'column',
          justifyContent: 'center'
        }}> 
          <div>
            <Form.Button
              size='mini'
              circular
              icon='trash'
              color='red'
              onClick={() => {
                  // remove this value
                  onChange(
                    [
                      ...initialValues.slice(0, index),
                      ...initialValues.slice(index + 1),
                    ],
                    names
                      ? [...names.slice(0, index), ...names.slice(index + 1)]
                      : undefined,
                  );
              }}/>
          </div>
        </div>
      </Form.Group>,
    );
  }

  return (
    <React.Fragment>
      <Form fluid>
        {possibleValues}
      </Form>
      <div style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center'
      }}> 
        <div>
          <Button
            labelPosition='left'
            content='Add Choice'
            size='mini'
            icon='plus'
            circular
            color='green'
            onClick={() => {
              // add a new dropdown option
              onChange(
                [...initialValues, type === 'string' ? '' : 0],
                names ? [...names, ''] : undefined,
              );
            }} 
          />
        </div>
      </div>
    </React.Fragment>
  );
}
