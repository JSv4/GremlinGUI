// @flow

import React from 'react';
import Select from 'react-select';
import GeneralParameterInputs from './GeneralParameterInputs';
import {
  defaultUiProps,
  defaultDataProps,
  categoryToNameMap,
  categoryType,
} from './utils';
import {
  Segment, 
  Form,
  Popup,
  TextArea,
  Divider
} from 'semantic-ui-react';

// specify the inputs required for any type of object
export default function CardGeneralParameterInputs({
  parameters,
  onChange,
  allFormInputs,
  mods,
}) {
  const [keyState, setKeyState] = React.useState(parameters.name);
  const [titleState, setTitleState] = React.useState(parameters.title);
  const [descriptionState, setDescriptionState] = React.useState(
    parameters.description,
  );
  const categoryMap = categoryToNameMap(parameters.category, allFormInputs);

  const fetchLabel = (labelName, defaultLabel) => {
    return mods && mods.labels && typeof mods.labels[labelName] === 'string'
      ? mods.labels[labelName]
      : defaultLabel;
  };

  const objectNameLabel = fetchLabel('objectNameLabel', 'Variable Name');
  const displayNameLabel = fetchLabel('displayNameLabel', 'Display Name');
  const descriptionLabel = fetchLabel('descriptionLabel', 'Description');
  const inputTypeLabel = fetchLabel('inputTypeLabel', 'Input Type');

  return (
    <Segment secondary raised attached='top'>        
      <Divider horizontal>Details:</Divider>
      <Form>
        <Popup 
          content={  
            mods &&
            mods.tooltipDescriptions &&
            typeof mods.tooltipDescriptions.cardObjectName === 'string'
              ? mods.tooltipDescriptions.cardObjectName
              : 'The back-end name of the object'
          }
          trigger={
            <Form.Input 
              value={keyState || ''}
              type='text'
              label={`${objectNameLabel} `}
              placeholder='Key' 
              width={16}
              onChange={(ev) =>
                setKeyState(ev.target.value.replace(/\W/g, '_'))
              }
              onBlur={(ev) =>
                onChange({
                  ...parameters,
                  name: ev.target.value,
                })
              }
            />
          }
        />
        <Popup 
          content={
            mods &&
            mods.tooltipDescriptions &&
            typeof mods.tooltipDescriptions.cardDisplayName === 'string'
              ? mods.tooltipDescriptions.cardDisplayName
              : 'The user-facing name of this object'
          }
          trigger={
            <Form.Input 
              value={titleState || ''}
              type='text'
              label={`${displayNameLabel} `}
              placeholder='Title'
              width={16}
              onChange={(ev) =>
                setTitleState(ev.target.value)
              }
              onBlur={(ev) => {
                onChange({ ...parameters, title: ev.target.value });
              }}
            />
          }
        />
        <Popup 
          content={
            mods &&
            mods.tooltipDescriptions &&
            typeof mods.tooltipDescriptions.cardDescription === 'string'
              ? mods.tooltipDescriptions.cardDescription
              : 'This will appear as help text on the form'
          }
          trigger={
            <Form.Field
                control={TextArea}
                label={`${descriptionLabel} `}
                placeholder='Description'
                value={descriptionState || ''}
                onChange={(ev) =>
                  setDescriptionState(ev.target.value)
                }
                onBlur={(ev) => {
                  onChange({ ...parameters, description: ev.target.value });
                }}
              />
          }/>
          <Popup 
            content={
              mods &&
              mods.tooltipDescriptions &&
              typeof mods.tooltipDescriptions.cardInputType === 'string'
                ? mods.tooltipDescriptions.cardInputType
                : 'The type of form input displayed on the form'
            }
            trigger={
              <div>
                <Divider horizontal>{`${inputTypeLabel} `}:</Divider>
                <Select
                  value={{
                    value: parameters.category,
                    label: categoryMap[parameters.category],
                  }}
                  placeholder='Category'
                  options={Object.keys(categoryMap)
                    .filter(
                      (key) =>
                        key !== 'ref' ||
                        (parameters.definitionData &&
                          Object.keys(parameters.definitionData).length !== 0),
                    )
                    .map((key) => ({
                      value: key,
                      label: categoryMap[key],
                    }))}
                  onChange={(val) => {
                    // figure out the new 'type'
                    const newCategory = val.value;

                    const newProps = {
                      ...defaultUiProps(newCategory, allFormInputs),
                      ...defaultDataProps(newCategory, allFormInputs),
                      name: parameters.name,
                      required: parameters.required,
                    };
                    if (newProps.$ref !== undefined && !newProps.$ref) {
                      // assign an initial reference
                      const firstDefinition = Object.keys(parameters.definitionData)[0];
                      newProps.$ref = `#/definitions/${firstDefinition || 'empty'}`;
                    }
                    onChange({
                      ...newProps,
                      title: newProps.title || parameters.title,
                      default: newProps.default || '',
                      type: newProps.type || categoryType(newCategory, allFormInputs),
                      category: newProps.category || newCategory,
                    });
                  }}
                  className='card-select'
                />
              </div>
            }  
          />
      </Form>
      <GeneralParameterInputs
        category={parameters.category}
        parameters={parameters}
        onChange={onChange}
        mods={mods}
        allFormInputs={allFormInputs}
      />
    </Segment>
  );
}
