// @flow

import React from 'react';
import Select from 'react-select';
import { 
  TextArea,
  Divider,
  Checkbox,
  Form,
  Popup
} from 'semantic-ui-react';

const formatDictionary = {
  '': 'None',
  'date-time': 'Date-Time',
  email: 'Email',
  hostname: 'Hostname',
  time: 'Time',
  uri: 'URI',
  regex: 'Regular Expression',
};

// specify the inputs required for a string type object
function CardLongAnswerParameterInputs({
  parameters,
  onChange,
}) {
  return (
      <Form style={{marginBottom:'1rem'}}>
        <Form.Input
          label='Minimum Length'
          value={parameters.minLength ? parameters.minLength : ''}
          placeholder='Minimum Length'
          key='minLength'
          type='number'
          onChange={(ev) => {
            onChange({
              ...parameters,
              minLength: parseInt(ev.target.value, 10),
            });
          }}
          className='card-modal-number'
        />
        <Form.Input
          label='Maximum Length'
          value={parameters.maxLength ? parameters.maxLength : ''}
          placeholder='Maximum Length'
          key='maxLength'
          type='number'
          onChange={(ev) => {
            onChange({
              ...parameters,
              maxLength: parseInt(ev.target.value, 10),
            });
          }}
          className='card-modal-number'
        />
        <Popup
          content={<a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions'>Regular Expression Pattern</a>}
          target={  
          <Form.Input
            label='Regular Expression Pattern'
            value={parameters.pattern ? parameters.pattern : ''}
            placeholder='Regular Expression Pattern'
            key='pattern'
            type='text'
            onChange={(ev) => {
              onChange({
                ...parameters,
                pattern: ev.target.value,
              });
            }}
            className='card-modal-text'
          />
        }/>
        <Popup 
          content='Require string input to match a certain common format'
          target={
            <div>
              <h5>Format:{' '}</h5>
              <Select
                value={{
                  value: parameters.format
                    ? formatDictionary[
                        typeof parameters.format === 'string' ? parameters.format : ''
                      ]
                    : '',
                  label: parameters.format
                    ? formatDictionary[
                        typeof parameters.format === 'string' ? parameters.format : ''
                      ]
                    : 'None',
                }}
                placeholder='Format'
                key='format'
                options={Object.keys(formatDictionary).map((key) => ({
                  value: key,
                  label: formatDictionary[key],
                }))}
                onChange={(val) => {
                  onChange({
                    ...parameters,
                    format: val.value,
                  });
                }}
                className='card-modal-select'
              />
            </div>}
        />
        <div className='card-modal-boolean'>
          <Checkbox
            onChange={() => {
              onChange({
                ...parameters,
                'ui:autofocus': parameters['ui:autofocus']
                  ? parameters['ui:autofocus'] !== true
                  : true,
              });
            }}
            checked={
              parameters['ui:autofocus']
                ? parameters['ui:autofocus'] === true
                : false
            }
            label='Auto Focus'
          />
        </div>
    </Form>
  );
}

function LongAnswer({
  parameters,
  onChange,
}) {
  return (
    <>
      <Divider horizontal>Default Answer:</Divider>
      <Form.Field
        fluid
        style={{width:'100%'}}
        control={TextArea}
        placeholder='Default answer...'
        value={parameters.default}
        onChange={(ev) =>
          onChange({ ...parameters, default: ev.target.value })
        }
      />
    </>
  );
}

const longAnswerInput = {
  longAnswer: {
    displayName: 'Long Answer',
    matchIf: [
      {
        types: ['string'],
        widget: 'textarea',
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {
      'ui:widget': 'textarea',
    },
    type: 'string',
    cardBody: LongAnswer,
    modalBody: CardLongAnswerParameterInputs,
  },
};

export default longAnswerInput;
