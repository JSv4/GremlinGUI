// @flow

import * as React from 'react';
import { Button, Popup, Divider } from 'semantic-ui-react';
import { createUseStyles } from 'react-jss';
import FBRadioGroup from '../radio/FBRadioGroup';
import DependencyWarning from './DependencyWarning';
import DependencyPossibility from './DependencyPossibility';

const useStyles = createUseStyles({
  dependencyField: {
    '& .fa': { cursor: 'pointer' },
    '& .plus': { marginLeft: '1em' },
    '& h4': { marginBottom: '.5em' },
    '& h5': { fontSize: '1em' },
    '& .form-dependency-select': { fontSize: '0.75em', marginBottom: '1em' },
    '& .form-dependency-conditions': {
      textAlign: 'left',
      '& .form-dependency-condition': {
        padding: '1em',
        border: '1px solid gray',
        borderRadius: '4px',
        margin: '1em',
        '& *': { textAlign: 'initial' },
      },
    },
    '& p': { fontSize: '0.75em' },
    '& .fb-radio-button': {
      display: 'block',
    },
  },
});

// checks whether an array corresponds to oneOf dependencies
function checkIfValueBasedDependency(
  dependents
) {
  let valueBased = true;
  if (dependents && Array.isArray(dependents) && dependents.length > 0) {
    dependents.forEach((possibility) => {
      if (!possibility.value || !possibility.value.enum) {
        valueBased = false;
      }
    });
  } else {
    valueBased = false;
  }

  return valueBased;
}

export default function DependencyField({
  parameters,
  onChange,
}) {
  const classes = useStyles();
  const valueBased = checkIfValueBasedDependency(parameters.dependents || []);
  return (
    <div>
      <Popup
        content='Control whether other form elements show based on this one'
        trigger={<Divider horizontal>Dependencies:</Divider>}
      />
      {!!parameters.dependents && parameters.dependents.length > 0 && (
        <div style={{marginBottom:'1rem'}}>
          <FBRadioGroup
            defaultValue={valueBased ? 'value' : 'definition'}
            horizontal={false}
            options={[
              {
                value: 'definition',
                label: 'Any value dependency',
              },
              {
                value: 'value',
                label: 'Specific value dependency ',
                tooltip: "Specify whether these elements should show based on this element's value"
              },
            ]}
            onChange={(selection) => {
              if (parameters.dependents) {
                const newDependents = [...parameters.dependents];
                if (selection === 'definition') {
                  parameters.dependents.forEach((possibility, index) => {
                    newDependents[index] = {
                      ...possibility,
                      value: undefined,
                    };
                  });
                } else {
                  parameters.dependents.forEach((possibility, index) => {
                    newDependents[index] = {
                      ...possibility,
                      value: { enum: [] },
                    };
                  });
                }
                onChange({
                  ...parameters,
                  dependents: newDependents,
                });
              }
            }}
          />
        </div>
      )}
      <DependencyWarning parameters={parameters} />
      <div className='form-dependency-conditions'>
        {parameters.dependents
          ? parameters.dependents.map((possibility, index) => (
              <DependencyPossibility
                possibility={possibility}
                neighborNames={parameters.neighborNames || []}
                parentEnums={parameters.enum}
                parentType={parameters.type}
                parentName={parameters.name}
                parentSchema={parameters.schema}
                path={parameters.path}
                key={`${parameters.path}_possibility${index}`}
                onChange={(newPossibility) => {
                  const newDependents = parameters.dependents
                    ? [...parameters.dependents]
                    : [];
                  newDependents[index] = newPossibility;
                  onChange({
                    ...parameters,
                    dependents: newDependents,
                  });
                }}
                onDelete={() => {
                  const newDependents = parameters.dependents
                    ? [...parameters.dependents]
                    : [];
                  onChange({
                    ...parameters,
                    dependents: [
                      ...newDependents.slice(0, index),
                      ...newDependents.slice(index + 1),
                    ],
                  });
                }}
              />
            ))
          : ''}
        <div 
          style={{
            width:'100%', 
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
        }}>
          <div>
            <Popup
              content='Add another dependency relation linking this element and other form elements'
              trigger={
                <Button
                  labelPosition='left'
                  content='Add Dependency'
                  size='mini'
                  icon='plus'
                  circular
                  color='green'
                  onClick={() => {
                    const newDependents = parameters.dependents
                      ? [...parameters.dependents]
                      : [];
                    newDependents.push({
                      children: [],
                      value: valueBased ? { enum: [] } : undefined,
                    });
                    onChange({
                      ...parameters,
                      dependents: newDependents,
                    });
                  }}
                />    
              }/>
          </div>
        </div>
      </div>
    </div>
  );
}
