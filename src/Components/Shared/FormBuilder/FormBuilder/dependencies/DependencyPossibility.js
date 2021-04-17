// @flow

import * as React from 'react';
import { Popup, Segment, Button } from 'semantic-ui-react';
import CardSelector from './CardSelector';
import ValueSelector from './ValueSelector';

// a possible dependency
export default function DependencyPossibility({
  possibility,
  neighborNames,
  path,
  onChange,
  onDelete,
  parentEnums,
  parentType,
  parentName,
  parentSchema,
}) {
  return (
    <Segment>
      <Popup
        content='Choose the other form elements that depend on this one'
        trigger={
          <h5 style={{marginTop:'1rem'}}>
            Display the following:{' '}
          </h5>
        }
      />
      <CardSelector
        possibleChoices={
          neighborNames.filter((name) => name !== parentName) || []
        }
        chosenChoices={possibility.children}
        onChange={(chosenChoices) =>
          onChange({ ...possibility, children: [...chosenChoices] })
        }
        placeholder='Choose a dependent...'
        path={path}
      />
      <h5 style={{marginTop:'1rem'}}>
        If "{parentName}" has {possibility.value ? 'the value:' : 'a value.'}
      </h5>
      <div style={{ display: possibility.value ? 'block' : 'none' }}>
        <ValueSelector
          possibility={possibility}
          onChange={(newPossibility) => onChange(newPossibility)}
          parentEnums={parentEnums}
          parentType={parentType}
          parentName={parentName}
          parentSchema={parentSchema}
          path={path}
        />
      </div>
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
      }}>
        <div>
          <Button 
            circular
            icon='trash'
            labelPosition='left'
            color='red'
            size='mini'
            content='Remove Dependency' 
            onClick={() => onDelete()}
          />
        </div>
      </div>
    </Segment>
  );
}
