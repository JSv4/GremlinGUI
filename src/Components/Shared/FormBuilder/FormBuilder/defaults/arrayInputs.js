// @flow

import React from 'react';
import { 
  Form 
} from 'semantic-ui-react';
import {
  generateElementComponentsFromSchemas,
  generateCategoryHash,
} from '../utils';
import Card from '../Card';
import Section from '../Section';
import FBCheckbox from '../checkbox/FBCheckbox';
import shortAnswerInputs from './shortAnswerInputs';
import longAnswerInputs from './longAnswerInputs';
import numberInputs from './numberInputs';
import defaultInputs from './defaultInputs';

// specify the inputs required for a string type object
function CardArrayParameterInputs({
  parameters,
  onChange,
}) {
  return (
    <Form style={{marginBottom:'1rem'}}>
      <Form.Input
        value={parameters.minItems || ''}
        placeholder='ex: 2'
        label='Minimum Items'
        key='minimum'
        type='number'
        onChange={(ev) => {
          onChange({
            ...parameters,
            minItems: parseInt(ev.target.value, 10),
          });
        }}
        className='card-modal-number'
      />
      <Form.Input
        value={parameters.maxItems || ''}
        placeholder='ex: 2'
        label='Maximum Items'
        key='maximum'
        type='number'
        onChange={(ev) => {
          onChange({
            ...parameters,
            maxItems: parseInt(ev.target.value, 10),
          });
        }}
        className='card-modal-number'
      />
    </Form>
  );
}

function getInnerCardComponent({
  defaultFormInputs,
}) {
  return function InnerCard({
    parameters,
    onChange,
    mods,
  }) {
    const newDataProps = {};
    const newUiProps = {};
    const allFormInputs = {
      ...defaultFormInputs,
      ...(mods && mods.customFormInputs),
    };
    // parse components into data and ui relevant pieces
    Object.keys(parameters).forEach((propName) => {
      if (propName.startsWith('ui:*')) {
        newUiProps[propName.substring(4)] = parameters[propName];
      } else if (propName.startsWith('ui:')) {
        newUiProps[propName] = parameters[propName];
      } else if (!['name', 'required'].includes(propName)) {
        newDataProps[propName] = parameters[propName];
      }
    });

    const definitionData = parameters.definitionData
      ? parameters.definitionData
      : {};
    const definitionUi = parameters.definitionUi ? parameters.definitionUi : {};
    const [cardOpen, setCardOpen] = React.useState(false);
    if (parameters.type !== 'array') {
      return <h4>Not an array </h4>;
    }
    return (
      <div className='card-array'>
        <FBCheckbox
          onChangeValue={() => {
            if (newDataProps.items.type === 'object') {
              onChange({
                ...parameters,
                items: {
                  ...newDataProps.items,
                  type: 'string',
                },
              });
            } else {
              onChange({
                ...parameters,
                items: {
                  ...newDataProps.items,
                  type: 'object',
                },
              });
            }
          }}
          isChecked={newDataProps.items.type === 'object'}
          label='Section'
          id={`${
            typeof parameters.path === 'string' ? parameters.path : ''
          }_issection`}
        />
        {generateElementComponentsFromSchemas({
          schemaData: { properties: { Item: newDataProps.items } },
          uiSchemaData: { Item: newUiProps.items },
          onChange: (schema, uischema) => {
            onChange({
              ...parameters,
              items: schema.properties.Item,
              'ui:*items': uischema.Item || {},
            });
          },
          path: typeof parameters.path === 'string' ? parameters.path : 'array',
          definitionData:
            typeof definitionData === 'string' ? definitionData : {},
          definitionUi: typeof definitionUi === 'string' ? definitionUi : {},
          hideKey: true,
          cardOpenArray: [cardOpen],
          setCardOpenArray: (newArr) => setCardOpen(newArr[0]),
          allFormInputs,
          mods,
          categoryHash: generateCategoryHash(allFormInputs),
          Card,
          Section,
        })}
      </div>
    );
  };
}

const defaultFormInputs = ({
  ...defaultInputs,
  ...shortAnswerInputs,
  ...longAnswerInputs,
  ...numberInputs,
});
defaultFormInputs.array = {
  displayName: 'Array',
  matchIf: [
    {
      types: ['array'],
    },
  ],
  defaultDataSchema: {
    items: { type: 'string' },
  },
  defaultUiSchema: {},
  type: 'array',
  cardBody: getInnerCardComponent({ defaultFormInputs }),
  modalBody: CardArrayParameterInputs,
};

const ArrayInputs = {
  array: {
    displayName: 'Array',
    matchIf: [
      {
        types: ['array'],
      },
    ],
    defaultDataSchema: {
      items: { type: 'string' },
    },
    defaultUiSchema: {},
    type: 'array',
    cardBody: getInnerCardComponent({ defaultFormInputs }),
    modalBody: CardArrayParameterInputs,
  },
};

export default ArrayInputs;
