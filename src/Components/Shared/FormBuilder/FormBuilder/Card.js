// @flow

import * as React from 'react';
import { 
  Accordion,
  Button, 
  Icon,
  Popup, 
  Checkbox,
  Segment 
} from 'semantic-ui-react';
import CardModal from './CardModal';
import CardGeneralParameterInputs from './CardGeneralParameterInputs';
import Add from './Add';


export default function Card({
  componentProps,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  TypeSpecificParameters,
  addElem,
  cardOpen,
  setCardOpen,
  allFormInputs,
  mods,
}) {

  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <React.Fragment>
      <div style={{
        width:'100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
      }}>
        <div style={{
          width:'80%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <Accordion 
            fluid
            styled 
            style={{
              marginTop:'1rem',
              martinBottom: '0'
            }}
          >
            <Accordion.Title
              active={cardOpen}
              index={0}
              style={{padding:'.5rem'}}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <div>
                    <Popup 
                      content='Move form element up'
                      position='top center'
                      trigger={
                        <div onClick={() => (onMoveUp ? onMoveUp() : {})}>
                          <Icon name='chevron up'/>
                        </div>
                      }/>
                    <Popup 
                      content='Move form element down'
                      position='top center'
                      trigger={
                        <div onClick={() => (onMoveDown ? onMoveDown() : {})}>
                          <Icon name='chevron down'/>
                        </div>
                      }
                    />
                </div>
                <div style={{
                  textAlign:'center',
                  flex:1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div>
                    <span>{componentProps.title || componentProps.name}{' '}</span>
                    {
                      componentProps.parent ? 
                        <Popup
                          trigger={
                            <Icon name='asterisk' color='blue'/>
                          }
                          content={`Depends on ${(componentProps.parent)}`}
                        />
                      : ('')
                    }
                  </div>
                </div>
                <div style={{
                  textAlign:'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div onClick={() => setCardOpen(!cardOpen)}>
                    <Icon size='huge' name='dropdown' />
                  </div>
                </div>
              </div>
            </Accordion.Title>
            <Accordion.Content active={cardOpen} style={{paddingBottom:'.5rem'}}>
              <Segment>
                  <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <Checkbox
                        toggle
                        label='Required'
                        onChange={() =>
                          onChange({
                            ...componentProps,
                            required: !componentProps.required,
                          })
                        }
                        checked={!!componentProps.required}
                        id={`${
                          typeof componentProps.path === 'string'
                            ? componentProps.path
                            : 'card'
                        }_required`}
                      />
                    </div>
                  <div>
                  <Popup 
                    content='Additional configurations for this form element'
                    trigger={
                      <Button size='mini' circular icon='edit' onClick={() => setModalOpen(true)}/>
                    }
                  />
                  <Popup 
                    content='Delete form element'
                    trigger={
                      <Button size='mini' circular color='red' icon='trash' onClick={() => (onDelete ? onDelete() : {})}/>
                    }
                  />
                </div>
              </div>
              </Segment>
              <div>
                <CardGeneralParameterInputs
                  parameters={(componentProps)}
                  onChange={onChange}
                  allFormInputs={allFormInputs}
                  mods={mods}
                />
              </div>
              <CardModal
                componentProps={componentProps}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onChange={(newComponentProps) => {
                  onChange(newComponentProps);
                }}
                TypeSpecificParameters={TypeSpecificParameters}
              />
            </Accordion.Content>
          </Accordion>
          {addElem ? (
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              <Add
                name={`${componentProps.path}`}
                addElem={(choice) => addElem(choice)}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
     
    </React.Fragment>
  );
}
