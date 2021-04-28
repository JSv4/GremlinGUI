// @flow
import * as React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Select from 'react-select';
import {
  Accordion,
  Icon,
  Button,
  Popup,
  Form,
  Segment,
  TextArea,
  Checkbox,
  Message
} from 'semantic-ui-react';
import CardModal from './CardModal';
import { CardDefaultParameterInputs } from './defaults/defaultInputs';
import Add from './Add';
import Card from './Card';
import {
  checkForUnsupportedFeatures,
  generateElementComponentsFromSchemas,
  countElementsFromSchema,
  addCardObj,
  addSectionObj,
  onDragEnd,
} from './utils';


export default function Section({
  name,
  required,
  schema,
  uischema,
  onChange,
  onNameChange,
  onRequireToggle,
  onDependentsChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  path,
  definitionData,
  definitionUi,
  hideKey,
  reference,
  dependents,
  dependent,
  parent,
  neighborNames,
  addElem,
  cardOpen,
  setCardOpen,
  allFormInputs,
  mods,
  categoryHash,
}) {
  const unsupportedFeatures = checkForUnsupportedFeatures(
    schema || {},
    uischema || {},
    allFormInputs,
  );
  const schemaData = schema || {};
  const elementNum = countElementsFromSchema(schemaData);
  const defaultCollapseStates = [...Array(elementNum)].map(() => true);
  const [cardOpenArray, setCardOpenArray] = React.useState(
    defaultCollapseStates,
  );
  // keep name in state to avoid losing focus
  const [keyName, setKeyName] = React.useState(name);
  
  // keep requirements in state to avoid rapid updates
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleChange = (e, { name, value }) => this.setState({ [name]: value })

  return (
    <React.Fragment>
       <div style={{
          width:'100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        }}>
          <div style={{
            width:'100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Accordion fluid styled style={{
              marginTop:'1rem',
              martinBottom: '0'
            }}>
              <Accordion.Title
                active={cardOpen}
                index={0}
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
                      <span>{schemaData.title || keyName}</span>
                    </div>
                  </div>
                  <div style={{
                    textAlign:'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <div onClick={() => setCardOpen(!cardOpen)}>
                      <Icon name='dropdown' />
                    </div>
                  </div>  
                </div>
              </Accordion.Title>
              <Accordion.Content active={cardOpen} style={{paddingBottom:'.5rem'}}>
                <Segment secondary raised attached='top'>        
                  {reference ? (
                    <div className='section-entry section-reference'>
                      <h5>Reference Section</h5>
                      <Select
                        value={{
                          value: reference,
                          label: reference,
                        }}
                        placeholder='Reference'
                        options={Object.keys(definitionData).map((key) => ({
                          value: `#/definitions/${key}`,
                          label: `#/definitions/${key}`,
                        }))}
                        onChange={(val) => {
                          onChange(schema, uischema, val.value);
                        }}
                        className='section-select'
                      />
                    </div>
                  ) : (
                    ''
                  )}
                  <Form>
                    <Form.Group>
                      <Popup 
                        content={ mods &&
                          mods.tooltipDescriptions &&
                          mods.tooltipDescriptions &&
                          typeof mods.tooltipDescriptions.cardSectionObjectName ===
                            'string'
                            ? mods.tooltipDescriptions.cardSectionObjectName
                            : 'The key to the object that will represent this form section.'
                        }
                        trigger={
                          <Form.Input 
                            value={keyName || ''}
                            type='text'
                            label='Section Variable Name' 
                            placeholder='First Name' 
                            width={16}
                            onBlur={(ev) =>
                              onNameChange(ev.target.value)
                            }
                            className='card-text'
                            readOnly={hideKey}
                          />
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Popup 
                        content={
                          mods &&
                          mods.tooltipDescriptions &&
                          mods.tooltipDescriptions &&
                          typeof mods.tooltipDescriptions.cardSectionDisplayName ===
                            'string'
                            ? mods.tooltipDescriptions.cardSectionDisplayName
                            : 'The name of the form section that will be shown to users of the form.'
                        }
                        trigger={
                          <Form.Input
                            value={schemaData.title || ''}
                            type='text'
                            onChange={(ev) =>
                              onChange(
                                {
                                  ...schema,
                                  title: ev.target.value,
                                },
                                uischema,
                              )
                            }
                            label='Section Display Name'
                            placeholder='Middle Name'
                            width={16}
                          />
                        }
                      />
                    </Form.Group>
                    <Form.Group>
                      <Popup 
                        content={
                          mods &&
                          mods.tooltipDescriptions &&
                          mods.tooltipDescriptions &&
                          typeof mods.tooltipDescriptions.cardSectionDescription ===
                            'string'
                            ? mods.tooltipDescriptions.cardSectionDescription
                            : 'A description of the section which will be visible on the form.'
                        }
                        trigger={
                          <TextArea
                            rows={2}
                            label='Section Description' 
                            value={schemaData.description || ''}
                            placeholder='Description'
                            type='text'
                            onChange={(ev) =>
                              onChange(
                                {
                                  ...schema,
                                  description: ev.target.value,
                                },
                                uischema,
                              )
                            }
                          />
                        }
                      />
                    </Form.Group>
                  </Form>
                  {
                    unsupportedFeatures.length === 0 ? 
                      <></> : 
                      <Message warning>
                        <Message.Header>Unsupported Features:</Message.Header>
                        {unsupportedFeatures.map((message) => (
                          <li key={`${path}_${message}`}>{message}</li>
                        ))}
                      </Message>   
                  }
                </Segment>
                <Segment secondary raised attached='bottom'>
                  <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom:'0'
                  }}>
                    <div>
                      <Checkbox
                        toggle
                        label='Section Required'
                        onChange={() => onRequireToggle()}
                        checked={required}
                        id={`${path}_required`}
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
                <div className='section-body'>
                  <DragDropContext
                    onDragEnd={(result) =>
                      onDragEnd(result, {
                        schema,
                        uischema,
                        onChange,
                        definitionData,
                        definitionUi,
                        categoryHash,
                      })
                    }
                    className='section-body'
                  >
                    <Droppable droppableId='droppable'>
                      {(providedDroppable) => (
                        <div
                          ref={providedDroppable.innerRef}
                          {...providedDroppable.droppableProps}
                        >
                          {generateElementComponentsFromSchemas({
                            schemaData: schema,
                            uiSchemaData: uischema,
                            onChange,
                            path,
                            definitionData,
                            definitionUi,
                            cardOpenArray,
                            setCardOpenArray,
                            allFormInputs,
                            mods,
                            categoryHash,
                            Card,
                            Section,
                          }).map((element, index) => (
                            <Draggable
                              key={element.key}
                              draggableId={element.key}
                              index={index}
                            >
                              {(providedDraggable) => (
                                <div
                                  ref={providedDraggable.innerRef}
                                  {...providedDraggable.draggableProps}
                                  {...providedDraggable.dragHandleProps}
                                >
                                  {element}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {providedDroppable.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center'
                  }}>
                  <Add
                    name={`${keyName}_inner`}
                    addElem={(choice) => {
                      if (choice === 'card') {
                        addCardObj({
                          schema,
                          uischema,
                          onChange,
                          definitionData,
                          definitionUi,
                          categoryHash,
                        });
                      } else if (choice === 'section') {
                        addSectionObj({
                          schema,
                          uischema,
                          onChange,
                          definitionData,
                          definitionUi,
                          categoryHash,
                        });
                      }
                    }}
                    hidden={
                      schemaData.properties &&
                      Object.keys(schemaData.properties).length !== 0
                    }
                  />
                </div>
                <CardModal
                  componentProps={{
                    dependents,
                    neighborNames,
                    name: keyName,
                    schema,
                    type: 'object',
                  }}
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  onChange={(newComponentProps) => {
                    onDependentsChange(newComponentProps.dependents);
                  }}
                  TypeSpecificParameters={CardDefaultParameterInputs}
                />
              </Accordion.Content>
            </Accordion>
            {addElem ? (
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
              }}>
                <Add orientation='BOTTOM' name={keyName} addElem={(choice) => addElem(choice)} />
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      
      
    </React.Fragment>
  );
}
