import styled from 'styled-components';

export const ShadowBoxDiv = styled.div`
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

export const VerticallyCenteredDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
`;

export const HorizontallyCenteredDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    height:100%;
    width:100%;
`;

export const HorizontallyJustifiedDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height:100%;
    width:100%;
`;

export const FullWidthHorizontallyCenteredDiv = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: center;
`;

export const CustomCanvas = styled.div`
    position: relative;
    background-size: 10px 10px;
    background-color: #4f6791;
    background-image:
        linear-gradient(90deg,hsla(0,0%,100%,.1) 1px,transparent 0),
        linear-gradient(180deg,hsla(0,0%,100%,.1) 1px,transparent 0);
    width: 100%;
    height: 100%;
    cursor: not-allowed;
`;