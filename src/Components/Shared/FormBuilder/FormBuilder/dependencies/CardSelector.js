// @flow

import * as React from 'react';
import Select from 'react-select';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIcon from '../FontAwesomeIcon';

// a field that lets you choose adjacent blocks
export default function CardSelector({
  possibleChoices,
  chosenChoices,
  onChange,
  placeholder,
  path,
}) {
  return (
    <React.Fragment>
      <ul>
        {chosenChoices.map((chosenChoice, index) => (
          <li key={`${path}_neighbor_${index}`}>
            {chosenChoice}{' '}
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() =>
                onChange([
                  ...chosenChoices.slice(0, index),
                  ...chosenChoices.slice(index + 1),
                ])
              }
            />
          </li>
        ))}
      </ul>
      <Select
        value={{
          value: '',
          label: '',
        }}
        placeholder={placeholder}
        options={possibleChoices
          .filter((choice) => !chosenChoices.includes(choice))
          .map((choice) => ({
            value: choice,
            label: choice,
          }))}
        onChange={(val) => {
          onChange([...chosenChoices, val.value]);
        }}
        className='card-modal-select'
      />
    </React.Fragment>
  );
}