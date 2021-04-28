// @flow
import React from 'react';
import {
  Modal, 
  Message,
  Label,
  Button,
  Tab,
  Container,
  Segment,
  Header,
  Grid
} from 'semantic-ui-react';

import { LabelledFieldTemplate } from './CustomInputFields';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

import Form from '@rjsf/semantic-ui';

import FormBuilder from './FormBuilder/FormBuilder';
import ErrorBoundary from './ErrorBoundary';

// Override the default Array Field rendering as it is confusing as all hell, particularly when you have multiple
// array entries and you have objects instead of simple primitive arrays. 
function ArrayFieldTemplate(props) {
  return (
    <>  
      <Segment.Group raised>
        <Segment inverted color='grey'>
          {props.title}
        </Segment>
        { props.items.map((element, index) => 
          <Segment attached>
            <div style={{
              display:'flex', 
              justifyContent:'center', 
              flexDirection:'column',
              width:'100%'
            }}>
              <div style={{
                display:'flex', 
                flexDirection:'row',
                justifyContent: 'space-between',
                width:'100%'
              }}>
                 <div style={{
                    display:'flex', 
                    justifyContent:'center', 
                    flexDirection:'column',
                    height:'100%',
                    width:'100%'
                  }}>
                    <div>
                      <Header as='h3'># {index+1})</Header>
                    </div>
                  </div>
                <div style={{
                  display:'flex', 
                  justifyContent:'center', 
                  flexDirection:'column',
                  height:'100%',
                  width:'100%'
                }}>
                  <div>
                    {element.hasRemove ? 
                        <Button
                          floated='right'
                          circular 
                          color='red'
                          icon='trash'
                          onClick={element.onDropIndexClick(element.index)}
                        />
                        :
                        <></>
                      }
                  </div>
                </div>
              </div>
              <div style={{
                display:'flex', 
                flexDirection:'row',
                justifyContent: 'space-between',
                width:'100%',
                paddingLeft:'2rem'
              }}>
                <div style={{width:'100%'}}>
                  {element.children}
                </div>
              </div>
            </div>  
          </Segment>)
        }
        {
          props.canAdd ? <Segment attached='bottom'>
                          <Button onClick={props.onAddClick}>Add {props.title}</Button>
                        </Segment> : <></>
        }
      </Segment.Group>
    </>
  );
}

class JsonSchemaFormEditor extends React.Component {
  constructor(props) {
    super(props);

    // assign initial values
    this.state = {
      formData: {},
      formToggle: true,
      outputToggle: false,
      schemaFormErrorFlag: '',
      validFormInput: false,
      editorWidth: 700,
      submissionData: {},
    };
  }

  // update state schema and indicate parsing errors
  updateSchema(text) {
    // update parent
    if (this.props.onChange) this.props.onChange(text, this.props.uischema);
  }

  // update state ui schema and indicate parsing errors
  updateUISchema(text) {
    // update parent
    if (this.props.onChange) this.props.onChange(this.props.schema, text);
  }

  // update the internal form data state
  updateFormData(formData) {
      this.setState({formData});
  }

  render() {

    const schemaError = '';
    const schemaUiError = '';

    const widgets = {
      DateTimeWidget: LabelledFieldTemplate,
      DateWidget: LabelledFieldTemplate
    };
    
    const panes = [
      {
        menuItem: 'Form Builder',
        render: () => <div
                        className='tab-pane'
                        style={{
                          height: this.props.height ? this.props.height : '500px',
                        }}
                      >
                        <ErrorBoundary onErr={() => {}}>
                          <FormBuilder
                            schema={this.props.schema}
                            uischema={this.props.uischema}
                            onChange={(newSchema, newUiSchema) => {
                              if (this.props.onChange)
                                this.props.onChange(newSchema, newUiSchema);
                            }}
                          />
                        </ErrorBoundary>
                      </div>
      },
      {
        menuItem: 'Preview Form',
        render: () => <div
                        className='tab-pane'
                        style={{
                          height: this.props.height ? this.props.height : '500px',
                        }}
                      >
                        <ErrorBoundary
                          onErr={(err) => {
                            this.setState({
                              schemaFormErrorFlag: err,
                            });
                          }}
                          errMessage='Error parsing JSON Schema'
                        >
                          <Form
                            ArrayFieldTemplate={ArrayFieldTemplate}
                            widgets={widgets}
                            schema={this.props.schema}
                            uischema={this.props.uischema}
                            onChange={(formData) =>
                              this.updateFormData(formData.formData)
                            }
                            formData={this.state.formData}
                          >
                            <></>
                          </Form>
                        </ErrorBoundary>
                        <Modal
                          open={this.state.outputToggle}>
                          <Modal.Header>Form output preview</Modal.Header>
                          <Modal.Content>
                            <div className='editor-container'>
                              <ErrorBoundary
                                onErr={() => {}}
                                errMessage={'Error parsing JSON Schema Form output'}
                              >
                                <h4>Output Data</h4>
                                <JSONInput
                                  id='a_unique_id'
                                  placeholder={this.state.submissionData}
                                  locale={locale}
                                  height='550px'
                                />
                              </ErrorBoundary>
                              <br />
                            </div>
                          </Modal.Content>
                          <Modal.Actions>
                            <Button
                              onClick={() => {
                                this.setState({
                                  outputToggle: false,
                                });
                              }}
                              color='secondary'
                            >
                              Close
                            </Button>
                          </Modal.Actions>
                        </Modal>
                      </div>,
      },
      {
        menuItem: 'Edit Schema',
        render: () => <div
                        className='tab-pane'
                        style={{
                          height: this.props.height ? this.props.height : '500px',
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                      >
                        <div
                          style={{ margin: '1em', width: '50em' }}
                          className='editor-container'
                        >
                          <ErrorBoundary
                            onErr={(err) => {
                              // if rendering initial value causes a crash
                              // eslint-disable-next-line no-console
                              console.error(err);
                              this.updateSchema('{}');
                            }}
                            errMessage={'Error parsing JSON Schema input'}
                          >
                            <h4>Data Schema</h4>
                            <JSONInput
                              id='data_schema'
                              placeholder={
                                this.props.schema ? this.props.schema : {}
                              }
                              locale={locale}
                              height='550px'
                              onChange={(data) => this.updateSchema(data.json)}
                            />
                          </ErrorBoundary>
                          <br />
                        </div>
                        <div
                          style={{ margin: '1em', width: '50em' }}
                          className='editor-container'
                        >
                          <ErrorBoundary
                            onErr={(err) => {
                              // if rendering initial value causes a crash
                              // eslint-disable-next-line no-console
                              console.error(err);
                              this.updateUISchema('{}');
                            }}
                            errMessage={'Error parsing JSON UI Schema input'}
                          >
                            <h4>UI Schema</h4>
                            <JSONInput
                              id='ui_schema'
                              placeholder={
                                this.props.uischema
                                  ? this.props.uischema
                                  : {}
                              }
                              locale={locale}
                              height='550px'
                              onChange={(data) => this.updateUISchema(data.json)}
                            />
                          </ErrorBoundary>
                        </div>
                      </div>
      },
    ]

    return (
      <Container>
        <Message 
          negative
          style={{
            display: schemaError === '' ? 'none' : 'block',
          }}
        >
          <h5>Schema:</h5> {schemaError}
        </Message>
        <Message 
          negative
          style={{
            display: schemaUiError === '' ? 'none' : 'block',
          }}
        >
          <h5>UI Schema:</h5> {schemaUiError}
        </Message>
        <Message 
          negative
          style={{
            display: this.state.schemaFormErrorFlag === '' ? 'none' : 'block',
          }}
        >
          <h5>Form:</h5> {this.state.schemaFormErrorFlag}
        </Message>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Container>
    );
  }
}

export default JsonSchemaFormEditor;
