import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import { RevealWrapper } from "next-reveal";
import { useSession } from "next-auth/react";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
  margin-bottom: 40px;
  table thead tr th:nth-child(3),
  table tbody tr td:nth-child(3),
  table tbody tr.subtotal td:nth-child(2)
  {
    text-align: right;
  }
  table tr.subtotal td{
    padding: 15px 0;
  }
  table tbody tr.subtotal td:nth-child(2){
    font-size: 1.4rem;
  }

  tr.total td{
    font-weight: bold;
  }
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img{
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 20px;
`;

export default function CartPage() {
  const {cartProducts, addProduct, removeProduct, clearCart} = useContext(CartContext);
  const {data: session} = useSession();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [shippingFee, setShippingFee] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', {ids: cartProducts})
          .then(response => {
            setProducts(response.data);
          })
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
    axios.get('/api/settings?name=shippingFee').then(res => {
      setShippingFee(res.data.value);
    })
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }
    axios.get('/api/address').then(response => {
      setName(response.data?.name);
      setEmail(response.data?.email);
      setCity(response.data?.city);
      setPostalCode(response.data?.postalCode);
      setStreetAddress(response.data?.streetAddress);
      setCountry(response.data?.country);
    });
  }, [session]);

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  async function goToPayment() {
    const newErrors = {};
    if (!name) newErrors.name = "Proszę podać imię i nazwisko.";
    if (!email) {
      newErrors.email = "Proszę podać adres e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Proszę podać prawidłowy adres e-mail.";
    }
    if (!city) newErrors.city = "Proszę podać miasto.";
    if (!postalCode) newErrors.postalCode = "Proszę podać kod pocztowy.";
    if (!streetAddress) newErrors.streetAddress = "Proszę podać nazwę ulicy.";
    if (!country) newErrors.country = "Proszę podać kraj.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const response = await axios.post('/api/checkout', {
      name, email, city, postalCode, streetAddress, country,
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  let productsTotal = 0;
  for (const productId of cartProducts) {
    const price = products.find(p => p._id === productId)?.price || 0;
    productsTotal += price;
  }

  if (isSuccess) {
    return (
        <>
          <Header />
          <Center>
            <ColumnsWrapper>
              <Box>
                <h1>Dziękujemy za zamówienie!</h1>
                <p>Po wysłaniu zamówienia wyślemy Ci wiadomość e-mail.</p>
              </Box>
            </ColumnsWrapper>
          </Center>
        </>
    );
  }

  return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <RevealWrapper delay={0}>
              <Box>
                <h2>Koszyk</h2>
                {!cartProducts?.length && (
                    <div>Twój koszyk jest pusty</div>
                )}
                {products?.length > 0 && (
                    <Table>
                      <thead>
                      <tr>
                        <th>Produkt</th>
                        <th>Ilość</th>
                        <th>Cena</th>
                      </tr>
                      </thead>
                      <tbody>
                      {products.map(product => (
                          <tr key={product._id}>
                            <ProductInfoCell>
                              <ProductImageBox>
                                <img src={product.images[0]} alt=""/>
                              </ProductImageBox>
                              {product.title}
                            </ProductInfoCell>
                            <td>
                              <Button
                                  onClick={() => lessOfThisProduct(product._id)}>-</Button>
                              <QuantityLabel>
                                {cartProducts.filter(id => id === product._id).length}
                              </QuantityLabel>
                              <Button
                                  onClick={() => moreOfThisProduct(product._id)}>+</Button>
                            </td>
                            <td>
                              PLN {cartProducts.filter(id => id === product._id).length * product.price}
                            </td>
                          </tr>
                      ))}
                      <tr className="subtotal">
                        <td colSpan={2}>Produkty</td>
                        <td>PLN {productsTotal}</td>
                      </tr>
                      <tr className="subtotal">
                        <td colSpan={2}>Wysyłka</td>
                        <td>PLN {shippingFee}</td>
                      </tr>
                      <tr className="subtotal total">
                        <td colSpan={2}>Całkowity koszt</td>
                        <td>PLN {productsTotal + parseInt(shippingFee) || 0}</td>
                      </tr>
                      </tbody>
                    </Table>
                )}
              </Box>
            </RevealWrapper>
            {!!cartProducts?.length && (
                <RevealWrapper delay={100}>
                  <Box>
                    <h2>Informacje o zamówieniu</h2>
                    {Object.keys(errors).length > 0 && (
                        <ErrorMessage>
                          {Object.values(errors).map(error => (
                              <div key={error}>{error}</div>
                          ))}
                        </ErrorMessage>
                    )}
                    <Input type="text"
                           placeholder="Imię i nazwisko"
                           value={name}
                           name="name"
                           onChange={ev => setName(ev.target.value)} />
                    <Input type="text"
                           placeholder="Email"
                           value={email}
                           name="email"
                           onChange={ev => setEmail(ev.target.value)} />
                    <CityHolder>
                      <Input type="text"
                             placeholder="Miasto"
                             value={city}
                             name="city"
                             onChange={ev => setCity(ev.target.value)} />
                      <Input type="text"
                             placeholder="Kod pocztowy"
                             value={postalCode}
                             name="postalCode"
                             onChange={ev => setPostalCode(ev.target.value)} />
                    </CityHolder>
                    <Input type="text"
                           placeholder="Nazwa ulicy"
                           value={streetAddress}
                           name="streetAddress"
                           onChange={ev => setStreetAddress(ev.target.value)} />
                    <Input type="text"
                           placeholder="Kraj"
                           value={country}
                           name="country"
                           onChange={ev => setCountry(ev.target.value)} />
                    <Button black block
                            onClick={goToPayment}>
                      Kontynuuj płatność
                    </Button>
                  </Box>
                </RevealWrapper>
            )}
          </ColumnsWrapper>
        </Center>
      </>
  );
}
