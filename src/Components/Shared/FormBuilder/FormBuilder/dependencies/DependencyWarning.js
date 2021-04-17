// @flow

import * as React from 'react';
import { Popup } from 'semantic-ui-react';

// warning message if not all possibilities specified
export default function DependencyWarning({
  parameters,
}) {
  if (
    parameters.enum &&
    parameters.dependents &&
    parameters.dependents.length &&
    parameters.dependents[0].value
  ) {
    // get the set of defined enum values
    const definedVals = new Set([]);
    parameters.dependents.forEach((possibility) => {
      if (possibility.value && possibility.value.enum)
        possibility.value.enum.forEach((val) => definedVals.add(val));
    });
    const undefinedVals = [];
    if (Array.isArray(parameters.enum))
      parameters.enum.forEach((val) => {
        if (!definedVals.has(val)) undefinedVals.push(val);
      });
    if (undefinedVals.length === 0) return null;
    return (
        <Popup
          content='Each possible value for a value-based dependency must be defined to work properly'
          trigger={
            <div>
              <p>
                Warning! The following values do not have associated dependency
                values:{' '}
              </p>
              <ul>
                {undefinedVals.map((val, index) => (
                  <li key={index}>{val}</li>
                ))}
              </ul>
            </div>
          }/>
    );
  }

  return null;
}
