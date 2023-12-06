import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import SingleOrder from "@/components/SingleOrder";
import ProductBox from "@/components/ProductBox";
import Spinner from "@/components/Spinner";
import Tabs from "@/components/Tabs";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";
import {useSession, signOut, signIn} from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ColsWrapper = styled.div`
    display: flex;
    flex-direction: column-reverse;
    gap: 20px;
    margin: 40px 0;
    p{
        margin: 5px;
    }
    @media screen and (min-width: 768px){
        display: grid;
        grid-template-columns: 1.2fr .8fr;
        gap: 40px;
    }  
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;

const WishedProductGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
`;

export default function AccountPage(){
    const {data:session} = useSession();
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [city,setCity] = useState('');
    const [postalCode,setPostalCode] = useState('');
    const [streetAddress,setStreetAddress] = useState('');
    const [country,setCountry] = useState('');
    const [addressLoaded,setAddressLoaded] = useState(true);
    const [wishListLoaded,setWishListLoaded] = useState(true);
    const [wishedProducts, setWishedProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('Zamówienia');
    const [orders, setOrders] = useState([]);
    const [orderLoaded, setOrderLoaded] = useState(true);
    async function logout(){
        await signOut({
            callbackUrl: process.env.NEXT_PUBLIC_URL,
        });
    }
    async function login(){
        await signIn('google');
    }

    function saveAdress(){
        const data = {name, email, city, streetAddress, postalCode, country};
        axios.put('/api/address', data);
    }

    useEffect(() => {
        if(!session) {

            return;
        }
        setWishListLoaded(false);
        setWishListLoaded(false);
        setOrderLoaded(false);
        axios.get('/api/address').then(response => {
        setName(response.data.name);
        setEmail(response.data.email);
        setCity(response.data.city);
        setPostalCode(response.data.postalCode);
        setStreetAddress(response.data.streetAddress);
        setCountry(response.data.country);
        setAddressLoaded(true);
        });
        axios.get('/api/wishlist').then(response => {
            setWishedProducts(response.data.map(wp => wp.product));
            setWishListLoaded(true);
        });
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
            setOrderLoaded(true);
        })
    }, [session]);
    
    function productRemovedFromWishList(idToRemove){
        setWishedProducts(products => {
            return [...products.filter(p => p._id.toString() !== idToRemove)]
        })
    }

    return (
        <>
            <Header></Header>
            <Center>
                <ColsWrapper>
                    <div>
                        <RevealWrapper delay={0}>
                            <WhiteBox>
                                <Tabs 
                                    tabs={['Zamówienia','Lista życzeń']} 
                                    active={activeTab} 
                                    onChange={setActiveTab}>
                                </Tabs>
                                {activeTab === 'Zamówienia' && (
                                    <>
                                        {!orderLoaded && (
                                            <Spinner fullWidth={true}></Spinner>
                                        )}
                                        {orderLoaded && (
                                            <div>
                                                {orders.length === 0 && (
                                                    <p>Login to see your orders</p>
                                                )}
                                                {orders.length > 0 && orders.map(o => (
                                                    <SingleOrder key={o._id} {...o}></SingleOrder>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                                {activeTab === 'Lista życzeń' && (
                                    <>
                                        {!wishListLoaded && (
                                            <Spinner fullWidth={true}></Spinner>
                                        )}
                                        {wishListLoaded && (
                                            <>
                                            <WishedProductGrid>
                                                {wishedProducts.length > 0 && wishedProducts.map(wp => (
                                                    <ProductBox key={wp._id} {...wp} wished={true} 
                                                                onRemoveFromWishList={productRemovedFromWishList}>
                                                    </ProductBox>
                                                ))}     
                                            </WishedProductGrid>
                                            {wishedProducts.length === 0 && (
                                                    <>
                                                        {session && (
                                                            <p>Twoja lista życzeń jest pusta</p>
                                                        )}
                                                        {!session && (
                                                            <p>Zaloguj się, aby dodać produkty do swojej listy życzeń</p>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                    <div>
                        <RevealWrapper delay={100}>
                            <WhiteBox>
                                <h2>{session ? 'Szczegóły Konta' : 'Zaloguj sie'}</h2>
                                {!addressLoaded && (
                                    <Spinner fullWidth={true}></Spinner>
                                )}
                                {addressLoaded && session && (
                                    <>
                                        <Input type="text"
                                        placeholder="Nazwa"
                                        value={name}
                                        name="name"
                                        onChange={ev => setName(ev.target.value)} />
                                    <Input type="text"
                                        placeholder="Email"
                                        value={email}
                                        name="email"
                                        onChange={ev => setEmail(ev.target.value)}/>
                                    <CityHolder>
                                    <Input type="text"
                                            placeholder="Miasto"
                                            value={city}
                                            name="city"
                                            onChange={ev => setCity(ev.target.value)}/>
                                    <Input type="text"
                                            placeholder="Kod pocztowy"
                                            value={postalCode}
                                            name="postalCode"
                                            onChange={ev => setPostalCode(ev.target.value)}/>
                                    </CityHolder>
                                    <Input type="text"
                                        placeholder="Nazwa ulicy"
                                        value={streetAddress}
                                        name="streetAddress"
                                        onChange={ev => setStreetAddress(ev.target.value)}/>
                                    <Input type="text"
                                        placeholder="Kraj"
                                        value={country}
                                        name="country"
                                        onChange={ev => setCountry(ev.target.value)}/>
                                    <Button black block
                                            onClick={saveAdress}>
                                    Zatwierdź
                                    </Button>
                                    <hr></hr>
                                    </>
                                )}  
                                {session && (
                                    <Button primary onClick={logout}>Wyloguj</Button>
                                )}
                                {!session && (
                                    <Button primary onClick={login}>Zaloguj się za pomocą Google</Button>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                </ColsWrapper>
            </Center>

        </>
    )
}