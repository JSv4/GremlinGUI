// @flow

import React, { useState } from 'react';
import {
  Popup,
  Button,
  Icon,
  Message,
} from 'semantic-ui-react';

export default function Add({
  name,
  addElem,
  hidden,
}) {

  if (hidden) return <></>;

  return (
    <Popup
      style={{padding:'.5rem'}} 
      position='top center'
      trigger={
        <Message 
          style={{
            width:'100%', 
            marginTop:'1rem'}}
          color='green'
        >
         <div style={{width:'100%', display: 'flex', flexDirection:'row', justifyContent: 'center'}}>
            <div>
              <Icon name='plus' />  
            </div>
          </div>
        </Message>
        } 
        hoverable>
      <>
        <div className='action-buttons'>
          <Button.Group>
            <Button 
              labelPosition='left'
              icon='list alternate outline'
              content='Section'
              onClick={() => {
                addElem('section');
              }}
            />
            <Button.Or />
            <Button 
              labelPosition='right'
              icon='list'
              content='Field'
              onClick={() => {
                addElem('card');
              }}
            />
          </Button.Group>
        </div>
      </>
    </Popup>
  );
}
