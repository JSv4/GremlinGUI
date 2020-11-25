import * as React from 'react';
import styled from '@emotion/styled';

export const Container = styled.div`
        height: 100vh;
        weight: 100vw;
		background-color: ${(p) => p.background};
		background-size: 50px 50px;
		display: flex;
		> * {
			height: 100%;
			min-height: 100%;
			width: 100%;
		}
		background-image: linear-gradient(
				0deg,
				transparent 24%,
				${(p) => p.color} 25%,
				${(p) => p.color} 26%,
				transparent 27%,
				transparent 74%,
				${(p) => p.color} 75%,
				${(p) => p.color} 76%,
				transparent 77%,
				transparent
			),
			linear-gradient(
				90deg,
				transparent 24%,
				${(p) => p.color} 25%,
				${(p) => p.color} 26%,
				transparent 27%,
				transparent 74%,
				${(p) => p.color} 75%,
				${(p) => p.color} 76%,
				transparent 77%,
				transparent
			);
	`;

export class CustomCanvasWidget extends React.Component {
	render() {
		return (
			<Container
				background={this.props.background || 'rgb(31, 40, 57)'}
				color={this.props.color || 'rgba(255,255,255, 0.05)'}>
				{this.props.children}
			</Container>
		);
	}
}