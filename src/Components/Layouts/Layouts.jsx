import React from 'react';
import { 
    Tab,
    Segment,
    Grid,
    Container,
    Dimmer,
    Loader,
    Icon,
    Header } from 'semantic-ui-react';

export const CenteredIconDiv = (props) => {
    const {
        subheader,
        header,
        icon,
        size,
        color,
    } = props;

    return (
        <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <div style={{marginBottom:'1vh'}}>
                <Icon name={icon} color={color} size={size}/>
            </div>
            <div>
                <Header as='h1' textAlign='center'>
                    {header}
                    <Header.Subheader>
                    {subheader}
                    </Header.Subheader>
                </Header>
            </div>
        </div>
    );
}

export const InputResultTabs = (props) => {
    const {
        panelOneLabel,
        panelOne, 
        panelTwoLabel, 
        panelTwo
    } = props;
    
    const panes = [
        {
          menuItem: `${panelOneLabel}`,
          render: () => <Tab.Pane attached={false}>{panelOne}</Tab.Pane>,
        },
        {
          menuItem: `${panelTwoLabel}`,
          render: () => <Tab.Pane attached={false}>{panelTwo}</Tab.Pane>,
        },
      ];

    return (
        <Segment>
            <Tab menu={{ pointing: true }} panes={panes} />
        </Segment>);
}

export const SplitHeaderContainer = (props) => {
    const { left, right, header } = props;

    return (
        <Grid celled>
            <Grid.Row>
                <Grid.Column width={16}>{header}</Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={3}>{left}</Grid.Column>
                <Grid.Column width={10}>{right}</Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export const HeaderContainer = (props) => {
    const { body, header, loading, loadingText } = props;

    return (
        <Grid style={{marginTop:'0', height: '100%'}}>
            {
                loading ?  <Dimmer active inverted>
                                <Loader inverted>{ loadingText ? loadingText : "Loading..." }</Loader>
                            </Dimmer> :
                            <></>
            }
             <Grid.Row style={{paddingBottom:'0px'}}>
                <Grid.Column width={16}>{header}</Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16} style={{height:'100%'}}>
                    <Container fluid style={{height:'100%'}}>
                        {body}
                    </Container>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export const SwitchableContainerWithHeader = (props) => {
    
    const { 
        showSecondView, 
        viewOne,
        viewTwo,
        header,
        loading,
        loadingText 
    } = props;
    
    return (
        <Grid style={{marginTop:'0', height: '100%'}}>
            {
                loading ?  <Dimmer active inverted>
                                <Loader inverted>{ loadingText ? loadingText : "Loading..." }</Loader>
                            </Dimmer> :
                            <></>
            }
            <Grid.Row style={{paddingBottom:'0px'}}>
                <Grid.Column width={16}>{header}</Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16} style={{height:'100%'}}>
                    <Container fluid style={{height:'100%'}}>
                        {showSecondView ? viewTwo : viewOne}
                    </Container>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
    
};

