// @flow
import * as React from 'react';
import { Input } from 'semantic-ui-react';
import Select from 'react-select';
import { createUseStyles } from 'react-jss';
import { Checkbox as SemanticCheckbox, Divider } from 'semantic-ui-react';
import CardEnumOptions from '../CardEnumOptions';

const useStyles = createUseStyles({
  hidden: {
    display: 'none',
  },
});

// specify the inputs required for a string type object
export function CardDefaultParameterInputs() {
  return <div />;
}

function TimeField({
  parameters,
  onChange,
}) {
  return (
    <>
      <Divider horizontal>Default Value:</Divider>
      <div style={{marginTop:'1rem'}}>
        <Input
          value={parameters.default || ''}
          label='Default time'
          placeholder='Default'
          type='datetime-local'
          onChange={(ev) =>
            onChange({ ...parameters, default: ev.target.value })
          }
        />
      </div> 
    </>
  );
}

function Checkbox({
  parameters,
  onChange,
}) {
  return (
    <>
      <Divider horizontal>Default Value:</Divider>
      <div className='card-boolean' style={{marginTop:'1rem'}}>
        <SemanticCheckbox
          label='Default'
          onChange={() => {
            onChange({
              ...parameters,
              default: parameters.default ? parameters.default !== true : true,
            });
          }}
          checked={parameters.default ? parameters.default === true : false}
        />
      </div>
    </>
  );
}

function MultipleChoice({
  parameters,
  onChange,
}) {
  const classes = useStyles();
  const enumArray = Array.isArray(parameters.enum) ? parameters.enum : [];
  // eslint-disable-next-line no-restricted-globals
  const containsUnparsableString = enumArray.some((val) => isNaN(val));
  const containsString =
    containsUnparsableString ||
    enumArray.some((val) => typeof val === 'string');
  const [isNumber, setIsNumber] = React.useState(
    !!enumArray.length && !containsString,
  );
  return (
    <>
      <Divider horizontal>Dropdown Choices:</Divider>
      <div className='card-enum' style={{marginTop:'1rem'}}>
        <SemanticCheckbox
          label='Display label is different from value'
          onChange={() => {
            if (Array.isArray(parameters.enumNames)) {
              // remove the enumNames
              onChange({
                ...parameters,
                enumNames: null,
              });
            } else {
              // create enumNames as a copy of enum values
              onChange({
                ...parameters,
                enumNames: enumArray.map((val) => `${val}`),
              });
            }
          }}
          checked={Array.isArray(parameters.enumNames)}
          id={`${parameters.path}_different`}
        />
        <div
          className={
            containsUnparsableString || !enumArray.length ? classes.hidden : ''
          }
          style={{marginBottom:'1rem'}}
        >
          <SemanticCheckbox
            label='Force number'
            onChange={() => {
              if (containsString || !isNumber) {
                // attempt converting enum values into numbers
                try {
                  const newEnum = enumArray.map((val) => {
                    let newNum = 0;
                    if (val) newNum = parseFloat(val) || 0;
                    if (Number.isNaN(newNum))
                      throw new Error(`Could not convert ${val}`);
                    return newNum;
                  });
                  setIsNumber(true);
                  onChange({
                    ...parameters,
                    enum: newEnum,
                  });
                } catch (error) {
                  // eslint-disable-next-line no-console
                  console.error(error);
                }
              } else {
                // convert enum values back into strings
                const newEnum = enumArray.map((val) => `${val || 0}`);
                setIsNumber(false);
                onChange({
                  ...parameters,
                  enum: newEnum,
                });
              }
            }}
            checked={isNumber}
            id={`${
              typeof parameters.path === 'string' ? parameters.path : ''
            }_forceNumber`}
            disabled={containsUnparsableString}
          />
        </div>
        <CardEnumOptions
          initialValues={enumArray}
          names={
            Array.isArray(parameters.enumNames)
              ? parameters.enumNames.map((val) => `${val}`)
              : undefined
          }
          showNames={Array.isArray(parameters.enumNames)}
          onChange={(newEnum, newEnumNames) =>
            onChange({
              ...parameters,
              enum: newEnum,
              enumNames: newEnumNames,
            })
          }
          type={isNumber ? 'number' : 'string'}
        />
      </div>
    </>
  );
}

function RefChoice({
  parameters,
  onChange,
}) {
  return (
    <>
      <Divider horizontal>Dropdown Choices:</Divider>
      <div className='card-select' style={{marginTop:'1rem'}}>
        <Select
          value={{
            value: parameters.$ref,
            label: parameters.$ref,
          }}
          placeholder='Reference'
          options={Object.keys(parameters.definitionData || {}).map((key) => ({
            value: `#/definitions/${key}`,
            label: `#/definitions/${key}`,
          }))}
          onChange={(val) => {
            onChange({ ...parameters, $ref: val.value });
          }}
          className='card-select'
        />
      </div>
    </>
  );
}

const defaultInputs = {
  time: {
    displayName: 'Time',
    matchIf: [
      {
        types: ['string'],
        format: 'date-time',
      },
    ],
    defaultDataSchema: {
      format: 'date-time',
    },
    defaultUiSchema: {},
    type: 'string',
    cardBody: TimeField,
    modalBody: CardDefaultParameterInputs,
  },
  checkbox: {
    displayName: 'Checkbox',
    matchIf: [
      {
        types: ['boolean'],
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {},
    type: 'boolean',
    cardBody: Checkbox,
    modalBody: CardDefaultParameterInputs,
  },
  ref: {
    displayName: 'Reference',
    matchIf: [
      {
        types: [null],
        $ref: true,
      },
    ],
    defaultDataSchema: {
      $ref: '',
      title: '',
      description: '',
    },
    defaultUiSchema: {},
    type: null,
    cardBody: RefChoice,
    modalBody: CardDefaultParameterInputs,
  },
  radio: {
    displayName: 'Radio',
    matchIf: [
      {
        types: ['string', 'number', 'integer', 'array', 'boolean', null],
        widget: 'radio',
        enum: true,
      },
    ],
    defaultDataSchema: { enum: [] },
    defaultUiSchema: {
      'ui:widget': 'radio',
    },
    type: 'string',
    cardBody: MultipleChoice,
    modalBody: CardDefaultParameterInputs,
  },
  dropdown: {
    displayName: 'Dropdown',
    matchIf: [
      {
        types: ['string', 'number', 'integer', 'array', 'boolean', null],
        enum: true,
      },
    ],
    defaultDataSchema: { enum: [] },
    defaultUiSchema: {},
    type: 'string',
    cardBody: MultipleChoice,
    modalBody: CardDefaultParameterInputs,
  },
};

export default defaultInputs;
