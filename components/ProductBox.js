import { styled } from "styled-components"
import Link from "next/link";
import FlyingButton from "./FlyingButton";
import HeartOutlineIcon from "./icons/HeartOtline";
import HeartSolidIcon from "./icons/HeartSolidIcon";
import { useState } from "react";
import axios from "axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

const ProductWrapper = styled.div`
    button{
        width: 100%;
        text-align: center;
        justify-content: center;
    }
`;

const WhiteBox = styled(Link)`
    background-color: #fff;    
    padding: 20px;]
    height: 120px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    position: relative;
    img{
        max-width: 100%;
        max-height: 80px;
    }
`;

const Title = styled(Link)`
    font-weight: normal;
    font-size: .9rem;
    margin: 0;
    color: inherit;
    text-decoration: none;
`;

const ProductInfoBox = styled.div`
    margin-top: 5px;
`;

const PriceRow = styled.div`
    display: block;
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
    @media screen and (min-width: 768px){
        display: flex;
        gap: 5px;
    }
`;

const Price = styled.div`
    font-size: 0.7rem;
    font-weight: 400;
    text-align: right;
    @media screen and (min-width: 768px){
        font-size: 1rem;
        font-weight: 600;
        text-align: left;
    }
`;

const WishlistButton = styled.button`
    border: 0;
    width: 40px !important;
    height: 30px;
    position: absolute;
    padding: 10px;
    top: 0;
    right: 0;
    background: transparent;
    cursor: pointer;
    ${props => props.wished ? `
        color: red;
    ` : `
        color: black;
    `}
    svg{
        width: 16px;
    }
`;

export default function ProductBox({_id,title,decription,price,images, wished=false, 
    onRemoveFromWishList=()=>{},    
}){
    const uri = '/product/'+_id;

    const [isWished, setIsWished] = useState(wished);

    const session = useSession()

    const router = useRouter()


    function addToWishList(ev){
        ev.preventDefault();
        const nextValue = !isWished;
        if(!session.data?.user){
            router.push('/account')
            return
        }
        if(nextValue === false){
            onRemoveFromWishList(_id);
        }
        axios.post('/api/wishlist', {
            product: _id,
        }).then(() => {});
        setIsWished(nextValue);
    }

    return (
        <ProductWrapper>
            <WhiteBox href={uri}>
                <div>
                    <WishlistButton wished={isWished} onClick={addToWishList}>
                        {isWished ? <HeartSolidIcon></HeartSolidIcon> : <HeartOutlineIcon></HeartOutlineIcon>}
                    </WishlistButton>
                    <img src={images?.[0]}></img>
                </div>
            </WhiteBox>
            <ProductInfoBox>
                <Title href={uri}>{title}</Title>
                <PriceRow>
                    <Price>
                        PLN {price}
                    </Price>
                    <FlyingButton _id={_id} src={images?.[0]}>Dodaj do koszyka</FlyingButton>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>   
    )
}