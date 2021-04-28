// @flow
import React from 'react';
import {
  Button,
  Segment,
  Header,
} from 'semantic-ui-react';

// Override the default Array Field rendering as it is confusing as all hell, particularly when you have multiple
// array entries and you have objects instead of simple primitive arrays. 
export function ArrayFieldTemplate(props) {
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