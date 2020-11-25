import * as React from 'react';
import styled from '@emotion/styled';

export const Content = styled.div`
    flex-grow: 1;
    height: 100%;
`;

export const Container = styled.div`
    background: black;
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 5px;
`;

export class DemoWorkspaceWidget extends React.Component {
	render() {
		return (
			<Container>
				<Content>{this.props.children}</Content>
			</Container>
		);
	}
}