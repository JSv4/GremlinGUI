// @flow

import * as React from 'react';
import {
  Modal,
  Button 
} from 'semantic-ui-react';
import DependencyField from './dependencies/DependencyField';

export default function CardModal({
  componentProps,
  onChange,
  isOpen,
  onClose,
  TypeSpecificParameters,
}) {
 
  // assign state values for parameters that should only change on hitting "Save"
  const [componentPropsState, setComponentProps] = React.useState(
    componentProps,
  );

  React.useEffect(() => {
    setComponentProps(componentProps);
  }, [componentProps]);

  return ( 
    <Modal
      closeIcon
      open={isOpen}
      data-test='card-modal' 
      onClose={() => {
        onClose();
      }}
    >
      <Modal.Header>Additional Settings</Modal.Header>
      <Modal.Content>
        <TypeSpecificParameters
          parameters={componentPropsState}
          onChange={(newState) => {
            setComponentProps({
              ...componentPropsState,
              ...newState,
            });
          }}
        />
        <DependencyField
          parameters={(componentPropsState)}
          onChange={(newState) => {
            setComponentProps({
              ...componentPropsState,
              ...newState,
            });
          }}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => {
            onClose();
            onChange(componentPropsState);
          }}
          color='primary'
        >
          Save
        </Button>
        <Button
          onClick={() => {
            onClose();
          }}
          color='secondary'
        >
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
