// @flow

import React from 'react';
import Select from 'react-select';
import { 
  Input,
  Form,
  Divider,
  Popup,
  Checkbox
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

const autoDictionary = {
  '': 'None',
  email: 'Email',
  username: 'User Name',
  password: 'Password',
  'street-address': 'Street Address',
  country: 'Country',
};

// specify the inputs required for a string type object
function CardShortAnswerParameterInputs({
  parameters,
  onChange,
}) {
  return (
    <Form fluid style={{marginBottom:'1rem'}}>
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
        content={
          <div>
            Regular expression pattern the input must satisfy. See regex guide <a
              href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions'
              target='_blank'
              rel='noopener noreferrer'
            >here</a>
          </div>
        }
        target={
          <Form.Input
            label='Regex Validator'
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
        }
      />
      <Popup
        content='Require string input to match a certain common format'
        trigger={
          <div>
            <h5>Format</h5>
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
          </div>
        }
      />
      <Popup
        content={
          <div>
            <a
              href='https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete'
              target='_blank'
              rel='noopener noreferrer'
            >
              Suggest entries based on the user's browser history
            </a>
          </div>
        }
        target={
          <div>
            <h5>Auto Complete Category{' '}</h5>
            <Select
              value={{
                value: parameters['ui:autocomplete']
                  ? autoDictionary[
                      typeof parameters['ui:autocomplete'] === 'string'
                        ? parameters['ui:autocomplete']
                        : ''
                    ]
                  : '',
                label: parameters['ui:autocomplete']
                  ? autoDictionary[
                      typeof parameters['ui:autocomplete'] === 'string'
                        ? parameters['ui:autocomplete']
                        : ''
                    ]
                  : 'None',
              }}
              placeholder='Auto Complete'
              key='ui:autocomplete'
              options={Object.keys(autoDictionary).map((key) => ({
                value: key,
                label: autoDictionary[key],
              }))}
              onChange={(val) => {
                onChange({
                  ...parameters,
                  'ui:autocomplete': val.value,
                });
              }}
              className='card-modal-select'
            />
          </div>
        }
      />
      <div style={{marginTop:'1rem'}}>
        <Checkbox
            toggle
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

function ShortAnswerField({
  parameters,
  onChange,
}) {
  return (
    <>
      <Divider horizontal>Default Value:</Divider>
      <div style={{marginTop: '1rem'}}>
        <Input
          fluid
          value={parameters.default}
          placeholder='Default'
          type='text'
          onChange={(ev) =>
            onChange({ ...parameters, default: ev.target.value })
          }
        />
      </div>
    </>
  );
}

function Password({
  parameters,
  onChange,
}) {
  return (
    <>
      <Divider horizontal>Default Password:</Divider>
      <div style={{marginTop:'1rem'}}>
        <Input
          value={parameters.default}
          placeholder='Default'
          type='password'
          onChange={(ev) =>
            onChange({ ...parameters, default: ev.target.value })
          }
        />
      </div>
    </>
  );
}

const shortAnswerInput = {
  shortAnswer: {
    displayName: 'Short Answer',
    matchIf: [
      {
        types: ['string'],
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {},
    type: 'string',
    cardBody: ShortAnswerField,
    modalBody: CardShortAnswerParameterInputs,
  },
  password: {
    displayName: 'Password',
    matchIf: [
      {
        types: ['string'],
        widget: 'password',
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {
      'ui:widget': 'password',
    },
    type: 'string',
    cardBody: Password,
    modalBody: CardShortAnswerParameterInputs,
  },
};

export default shortAnswerInput;
