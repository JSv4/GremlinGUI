import React, { PureComponent } from 'react'
import { 
    Header, 
    Dimmer, 
    Loader, 
    Segment, 
    Icon, 
    Image
} from 'semantic-ui-react'

export default class AdminHomeTab extends PureComponent {

    componentDidMount() {
        this.props.handleRefreshSystemStats();
    }

    render() {

        const {system} = this.props;

        return (
        <div style={{
            height:'100%',
            width:'100%',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center'
        }}>
            { system.loading ? <Dimmer active>
                    <Loader>Updating System Stats...</Loader>
                </Dimmer> : <></>}
            <div style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:'1vh'}}>
                <div>
                    <Header size='huge' icon style={{fontSize:'2em'}}>
                        <Icon name='dashboard'/>
                        System Dashboard
                        <Header.Subheader>
                        Current Gremlin usage, user count and system status at-a-glance.
                        </Header.Subheader>
                    </Header>
                </div>
            </div>
            <div style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'center', alignItems: 'center'}}>
                <Segment style={{width: '30vw', height:'30vh', margin:'1vh'}} raised>
                    <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <div style={{marginBottom:'1vh'}}>
                            <Icon name='fire' color='red' size='massive'/>
                        </div>
                        <div>
                            <Header as='h1' textAlign='center'>
                                {system.error_job_count}
                                <Header.Subheader>
                                FAILED JOBS
                                </Header.Subheader>
                            </Header>
                        </div>
                    </div>
                </Segment>
                <Segment style={{width: '30vw', height:'30vh', margin:'1vh'}} raised>
                    <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <div style={{marginBottom:'1vh'}}>
                            <Icon name='play' color='green' size='massive'/>
                        </div>
                        <div>
                            <Header as='h1' textAlign='center'>
                                {system.running_job_count}
                                <Header.Subheader>
                                RUNNING JOBS
                                </Header.Subheader>
                            </Header>
                        </div>
                    </div>
                </Segment>
                <Segment style={{width: '30vw', height:'30vh', margin:'1vh'}} raised>
                    <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <div style={{marginBottom:'1vh'}}>
                            <Icon name='ordered list'color='blue' size='massive'/>
                        </div>
                        <div>
                            <Header as='h1' textAlign='center'>
                                {system.queued_job_count}
                                <Header.Subheader>
                                QUEUED JOBS
                                </Header.Subheader>
                            </Header>
                        </div>
                    </div>
                </Segment>
            </div>
            <div style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'center', alignItems: 'center'}}>
                <Segment style={{width: '18vw', height: '18vh', textAlign:'center', verticalAlign:'middle', margin:'1vh'}} raised>
                    <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <div style={{marginBottom:'1vh'}}>
                            <Icon name='users' size='huge'/>
                        </div>
                        <div>
                            <Header as='h1' textAlign='center'>
                                {system.user_count}
                                <Header.Subheader>
                                TOTAL USERS
                                </Header.Subheader>
                            </Header>
                        </div>
                    </div> 
                </Segment>
                <Segment style={{width: '18vw', height: '18vh', textAlign:'center', verticalAlign:'middle', margin:'1vh'}} raised>
                    <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <div style={{marginBottom:'1vh'}}>
                            <Icon name='shuffle' size='huge'/>
                        </div>
                        <div>
                            <Header as='h1' textAlign='center'>
                                {system.pipeline_count}
                                <Header.Subheader>
                                PIPELINES
                                </Header.Subheader>
                            </Header>
                        </div>
                    </div>
                </Segment>
                <Segment style={{width: '18vw', height: '18vh', textAlign:'center', verticalAlign:'middle', margin:'1vh'}} raised>
                    <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <div style={{marginBottom:'1vh'}}>
                            <Icon name='code' size='huge'/>
                        </div>
                        <div>
                            <Header as='h1' textAlign='center'> 
                                {system.script_count}
                                <Header.Subheader>
                                SCRIPTS
                                </Header.Subheader>
                            </Header>
                        </div>
                    </div> 
                </Segment>
                <Segment style={{width: '18vw', height: '18vh', textAlign:'center', verticalAlign:'middle', margin:'1vh'}} raised>
                    <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <div style={{marginBottom:'1vh'}}>
                            <Icon name='file text outline' size='huge'/>
                        </div>
                        <div>
                            <Header as='h1' textAlign='center'>
                                {system.doc_count}
                                <Header.Subheader>
                                DOCUMENTS
                                </Header.Subheader>
                            </Header>
                        </div>
                    </div>
                </Segment>
                <Segment style={{width: '18vw', height: '18vh', textAlign:'center', verticalAlign:'middle', margin:'1vh'}} raised>
                    <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <div style={{marginBottom:'1vh'}}>
                            <Icon name='file text' size='huge'/>
                        </div>
                        <div>
                            <Header as='h1' textAlign='center'>
                                {system.parsed_doc_count}
                                <Header.Subheader>
                                OCRed DOCUMENTS
                                </Header.Subheader>
                            </Header>
                        </div>
                    </div>
                </Segment>
            </div>
            <div style={{
                    zIndex: 100,
                    position: 'absolute',
                    bottom: '1vh',
                    right: '1vw'

                }}>
                <Image style={{height:'6vh'}} src='/gordium_128_name_left.png'/>
            </div>
        </div>);
    }
}
