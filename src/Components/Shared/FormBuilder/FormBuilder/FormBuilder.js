// @flow
import * as React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './Card';
import Section from './Section';
import Add from './Add';
import {
  checkForUnsupportedFeatures,
  generateElementComponentsFromSchemas,
  addCardObj,
  addSectionObj,
  onDragEnd,
  countElementsFromSchema,
  generateCategoryHash,
} from './utils';
import {
  Segment,
  Form, 
  Icon,
  Header,
  Accordion, 
  TextArea, 
  Message
} from 'semantic-ui-react';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';
import { PortalAwareDragItem } from './dragcomponents/PortalAwareDragItem';

const portal = document.createElement('div');

if (!document.body) {
  throw new Error('body not ready for portal creation!');
}

document.body.appendChild(portal);

export default function FormBuilder({
  schema,
  uischema,
  onChange,
  mods,
}) {
  const schemaData = schema? schema : {};
  schemaData.type = 'object';
  const uiSchemaData = uischema ? uischema : {};
  const allFormInputs = {
    ...DEFAULT_FORM_INPUTS,
    ...(mods && mods.customFormInputs),
  };
  const unsupportedFeatures = checkForUnsupportedFeatures(
    schemaData,
    uiSchemaData,
    allFormInputs,
  );

  const elementNum = countElementsFromSchema(schemaData);
  const defaultCollapseStates = [...Array(elementNum)].map(() => false);
  const [cardOpenArray, setCardOpenArray] = React.useState(
    defaultCollapseStates,
  );
  const categoryHash = generateCategoryHash(allFormInputs);
  const [titleEditOpen, setTitleEditOpen] = React.useState(false);

  return (
    <div>
      {
        unsupportedFeatures.length === 0 ? <></> : 
        <Message warning>
          <Message.Header>Unsupported Features:</Message.Header>
          {unsupportedFeatures.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </Message>
      }
      {(!mods || mods.showFormHead !== false) && (
          <Segment
            attached='top' 
            style={{
              marginBottom:'0',
              background: '#f9fafb'
            }}>
              <Header as='h2'>
                <Icon name='edit outline' />
                <Header.Content>
                  Form to Edit: {schemaData.title || ''}
                  <Header.Subheader><u>Description</u>: {schemaData.description || ''}</Header.Subheader>
                </Header.Content>
              </Header>

          </Segment>
      )}
      <Accordion fluid styled>
        <Accordion.Title
          active={titleEditOpen}
          onClick={() => setTitleEditOpen(!titleEditOpen)}
        >
          <Icon name='dropdown' />
          Title and Description
        </Accordion.Title>
        <Accordion.Content active={titleEditOpen}>
          <Form>
            <Form.Input 
              fluid
              value={schemaData.title || ''}
              label={mods &&
                mods.labels &&
                typeof mods.labels.formNameLabel === 'string'
                  ? mods.labels.formNameLabel
                  : 'Form Name'}
              placeholder='Title'
              onChange={(ev) => {
                onChange(
                  {
                    ...schemaData,
                    title: ev.target.value,
                  },
                  uischema,
                );
              }}
            />
            <Form.Field
              control={TextArea}
              label={mods &&
                mods.labels &&
                typeof mods.labels.formDescriptionLabel === 'string'
                  ? mods.labels.formDescriptionLabel
                  : 'Form Description'}
              placeholder='Describe your form for users...'
              value={schemaData.description || ''}
              onChange={(ev) =>
                onChange(
                  {
                    ...schemaData,
                    description: ev.target.value,
                  },
                  uischema,
                )
              }
            />
          </Form>
        </Accordion.Content>
      </Accordion> 
      <Segment attached='bottom' style={{
        marginTop:'0',
        paddingTop:'0',
        overflowY: 'scroll'
      }}>
        <div>
          <DragDropContext
            onDragEnd={(result) =>
              onDragEnd(result, {
                schema: schemaData,
                uischema: uiSchemaData,
                onChange: (newSchema, newUiSchema) =>
                  onChange(newSchema, newUiSchema),
                definitionData: schemaData.definitions,
                definitionUi: uiSchemaData.definitions,
                categoryHash,
              })
            }
          >
            <Droppable droppableId='droppable'>
              {(providedDroppable) => (
                <div
                  ref={providedDroppable.innerRef}
                  {...providedDroppable.droppableProps}
                >
                  {generateElementComponentsFromSchemas({
                    schemaData,
                    uiSchemaData,
                    onChange: (newSchema, newUiSchema) =>
                      onChange(newSchema, newUiSchema),
                    definitionData: schemaData.definitions,
                    definitionUi: uiSchemaData.definitions,
                    path: 'root',
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
                    {(
                      draggableProvided,
                      draggableSnapshot,
                    ) => (
                      <PortalAwareDragItem
                        provided={draggableProvided}
                        snapshot={draggableSnapshot}
                        portal={portal}
                      >
                          {element}
                      </PortalAwareDragItem>
                    )}
                  </Draggable>
                  ))}
                  {providedDroppable.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div 
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
          <Add
            name='form-builder'
            addElem={(choice) => {
              if (choice === 'card') {
                addCardObj({
                  schema: schemaData,
                  uischema: uiSchemaData,
                  onChange: (newSchema, newUiSchema) =>
                    onChange(newSchema, newUiSchema),
                  definitionData: schemaData.definitions,
                  definitionUi: uiSchemaData.definitions,
                  categoryHash,
                });
              } else if (choice === 'section') {
                addSectionObj({
                  schema: schemaData,
                  uischema: uiSchemaData,
                  onChange: (newSchema, newUiSchema) =>
                    onChange(newSchema, newUiSchema),
                  definitionData: schemaData.definitions,
                  definitionUi: uiSchemaData.definitions,
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
      </Segment>
    </div>
  );
}
