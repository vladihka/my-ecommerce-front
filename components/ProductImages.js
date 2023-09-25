import { useState } from "react";
import styled from "styled-components"

const Image = styled.img`
max-width: 100%;
max-height: 100%;
`;

const ImageButtons = styled.div`
display: flex;
gap: 10px;
flex-grow: 0;
margin-top: 10px;
`;

const BigImage = styled.img`
    max-width: 100%;
    max-height: 200px;
`;

const BigImageWrapper = styled.div`
    text-align: center;
`;

const ImageButton = styled.div`
    ${props => props.active ? `
        border-color: #ccc; 
    ` : `
        border-color: transparent;    
    `}
    border: 2px solid #ccc;
    height: 60px;
    padding: 5px;
    cursor: pointer;
    border-radius: 5px;
`;

export default function ProductImages({images}){
    const [activeImage, setActiveImage] = useState(images?.[0]);
    return (
        <>
            <BigImageWrapper>
                <BigImage src={activeImage}></BigImage>
            </BigImageWrapper>
            <ImageButtons>
                {images.map(image => (
                    <ImageButton key={image} active={image === activeImage} onClick={() => setActiveImage(image)}>
                        <Image src={image}></Image>
                    </ImageButton>
                ))}
            </ImageButtons>
        </>
    )
}