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
import { useSession, signOut, signIn } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ColsWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 20px;
  margin: 40px 0;
  p {
    margin: 5px;
  }
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 40px;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const WishedProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 5px;
`;

const AccountSection = styled.div`
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const MyButton = styled.button`
  width: 100%;
`;

const LoginForm = styled.div`
  margin-bottom: 30px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
`;

const RegisterForm = styled.div`
  margin-bottom: 30px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
`;

export default function AccountPage() {
    const { data: session } = useSession();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [country, setCountry] = useState("");
    const [addressLoaded, setAddressLoaded] = useState(true);
    const [wishListLoaded, setWishListLoaded] = useState(true);
    const [wishedProducts, setWishedProducts] = useState([]);
    const [activeTab, setActiveTab] = useState("Lista życzeń");
    const [orders, setOrders] = useState([]);
    const [orderLoaded, setOrderLoaded] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [loggingIn, setLoggingIn] = useState(true);
    const [loginError, setLoginError] = useState("");
    const [registrationError, setRegistrationError] = useState("");

    async function logout() {
        // Clear cart items on logout
        await signOut({
            callbackUrl: process.env.NEXT_PUBLIC_URL,
        });
    }

    async function login() {
        await signIn("google");
    }

    function saveAddress() {
        const data = { name, email, city, streetAddress, postalCode, country };
        axios.put("/api/address", data);
    }

    async function handleLoginWithEmailAndPassword() {
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            if (!result.error) {
                window.location.href = process.env.NEXT_PUBLIC_URL;
            } else {
                setLoginError("Podano niepoprawny email lub hasło.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setLoginError("Podano niepoprawny email lub hasło.");
        }
    }

    async function handleRegister() {
        try {
            const errors = {};
            // Walidacja pól formularza
            if (!email) {
                errors.email = "Proszę podać adres email.";
            } else if (!isValidEmail(email)) {
                errors.email = "Podany email jest niepoprawny.";
            }
            if (!password) {
                errors.password = "Proszę podać hasło.";
            } else if (!isValidPassword(password)) {
                errors.password =
                    "Hasło musi mieć minimum 8 znaków, zawierać co najmniej 1 dużą literę, 1 małą literę, 1 cyfrę i 1 znak specjalny.";
            }

            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                return;
            }

            const response = await axios.post("/api/register", {
                name,
                email,
                password,
            });

            console.log("Registration successful:", response.data);

            // Przełącz na stronę logowania po poprawnej rejestracji
            await signIn("credentials", {
                email,
                password,
                callbackUrl: process.env.NEXT_PUBLIC_URL,
            });

        } catch (error) {
            if (error.response && error.response.status === 409) {
                setRegistrationError("Podany adres email jest już w użyciu.");
            } else {
                setRegistrationError("Wystąpił błąd podczas rejestracji.");
                console.error("Registration error:", error);
            }
        }
    }


    useEffect(() => {
        if (!session) {
            return;
        }
        setWishListLoaded(false);
        setOrderLoaded(false);
        axios.get("/api/address").then((response) => {
            setName(response.data?.name);
            setEmail(response.data?.email);
            setCity(response.data?.city);
            setPostalCode(response.data?.postalCode);
            setStreetAddress(response.data?.streetAddress);
            setCountry(response.data?.country);
            setAddressLoaded(true);
        });
        axios.get("/api/wishlist").then((response) => {
            setWishedProducts(response.data.map((wp) => wp.product));
            setWishListLoaded(true);
        });
        axios.get("/api/orders").then((response) => {
            setOrders(response.data);
            setOrderLoaded(true);
        });
    }, [session]);

    function productRemovedFromWishList(idToRemove) {
        setWishedProducts((products) =>
            products.filter((p) => p._id.toString() !== idToRemove)
        );
    }

    function isValidEmail(email) {
        // Basic email validation
        return /\S+@\S+\.\S+/.test(email);
    }

    function isValidPassword(password) {
        // Password validation with regex
        const passwordRegex =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?!.*\s).{8,}$/;
        return passwordRegex.test(password);
    }

    return (
        <>
            <Header />
            <Center>
                <ColsWrapper>
                    <div>
                        <RevealWrapper delay={0}>
                            <WhiteBox>
                                <Tabs
                                    tabs={["Zamówienia", "Lista życzeń"]}
                                    active={activeTab}
                                    onChange={setActiveTab}
                                />
                                {activeTab === "Lista życzeń" && (
                                    <>
                                        {!wishListLoaded && <Spinner fullWidth={true}></Spinner>}
                                        {wishListLoaded && (
                                            <>
                                                <WishedProductGrid>
                                                    {wishedProducts.length > 0 &&
                                                        wishedProducts.map((wp) => (
                                                            <ProductBox
                                                                key={wp._id}
                                                                {...wp}
                                                                wished={true}
                                                                onRemoveFromWishList={
                                                                    productRemovedFromWishList
                                                                }
                                                            ></ProductBox>
                                                        ))}
                                                </WishedProductGrid>
                                                {wishedProducts.length === 0 && (
                                                    <>
                                                        {session && (
                                                            <p>Twoja lista życzeń jest pusta</p>
                                                        )}
                                                        {!session && (
                                                            <p>
                                                                Zaloguj się, aby dodać produkty do swojej
                                                                listy życzeń
                                                            </p>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                                {activeTab === "Zamówienia" && (
                                    <>
                                        {!orderLoaded && <Spinner fullWidth={true}></Spinner>}
                                        {orderLoaded && (
                                            <div>
                                                {orders.length === 0 ? (
                                                    <p>
                                                        Zaloguj się, aby zobaczyć swoje zamówienia lub nie
                                                        masz jeszcze zamówień
                                                    </p>
                                                ) : (
                                                    orders.map((o) => (
                                                        <SingleOrder key={o._id} {...o}></SingleOrder>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                    <div>
                        <RevealWrapper delay={100}>
                            <WhiteBox>
                                <AccountSection>
                                    <SectionTitle>
                                        {session ? "Dane dla wysyłki" : "Konto"}
                                    </SectionTitle>
                                    {!addressLoaded && <Spinner fullWidth={true}></Spinner>}
                                    {addressLoaded && session && (
                                        <FormSection>
                                            <Input
                                                type="text"
                                                placeholder="Imie i nazwisko"
                                                value={name}
                                                name="name"
                                                onChange={(ev) => setName(ev.target.value)}
                                                error={formErrors.name}
                                            />
                                            <Input
                                                type="text"
                                                placeholder="Email"
                                                value={email}
                                                name="email"
                                                onChange={(ev) => setEmail(ev.target.value)}
                                                error={formErrors.email}
                                            />
                                            {formErrors.email && (
                                                <ErrorMessage>{formErrors.email}</ErrorMessage>
                                            )}
                                            <CityHolder>
                                                <Input
                                                    type="text"
                                                    placeholder="Miasto"
                                                    value={city}
                                                    name="city"
                                                    onChange={(ev) => setCity(ev.target.value)}
                                                    error={formErrors.city}
                                                />
                                                <Input
                                                    type="text"
                                                    placeholder="Kod pocztowy"
                                                    value={postalCode}
                                                    name="postalCode"
                                                    onChange={(ev) =>
                                                        setPostalCode(ev.target.value)
                                                    }
                                                    error={formErrors.postalCode}
                                                />
                                            </CityHolder>
                                            <Input
                                                type="text"
                                                placeholder="Nazwa ulicy"
                                                value={streetAddress}
                                                name="streetAddress"
                                                onChange={(ev) =>
                                                    setStreetAddress(ev.target.value)
                                                }
                                                error={formErrors.streetAddress}
                                            />
                                            <Input
                                                type="text"
                                                placeholder="Kraj"
                                                value={country}
                                                name="country"
                                                onChange={(ev) => setCountry(ev.target.value)}
                                                error={formErrors.country}
                                            />
                                            <Button black block onClick={saveAddress}>
                                                Zapisz zmiany
                                            </Button>
                                            <hr />
                                        </FormSection>
                                    )}
                                    {!session && (
                                        <>
                                            {loggingIn && (
                                            <LoginForm>
                                                <SectionTitle>Logowanie</SectionTitle>
                                                <Input
                                                    type="email"
                                                    placeholder="Email"
                                                    value={email}
                                                    name="email"
                                                    onChange={(ev) => setEmail(ev.target.value)}
                                                    error={formErrors.email}
                                                />
                                                {formErrors.email && (
                                                    <ErrorMessage>{formErrors.email}</ErrorMessage>
                                                )}
                                                <Input
                                                    type="password"
                                                    placeholder="Hasło"
                                                    value={password}
                                                    name="password"
                                                    onChange={(ev) =>
                                                        setPassword(ev.target.value)
                                                    }
                                                    error={formErrors.password}
                                                />
                                                {formErrors.password && (
                                                    <ErrorMessage>
                                                        {formErrors.password}
                                                    </ErrorMessage>
                                                )}
                                                {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
                                                <ActionButtons>
                                                    <MyButton
                                                        primary
                                                        block
                                                        onClick={handleLoginWithEmailAndPassword}
                                                    >
                                                        Zaloguj się
                                                    </MyButton>
                                                    <Button onClick={() => setLoggingIn(false)}>
                                                        Nie masz konta?
                                                    </Button>
                                                </ActionButtons>
                                            </LoginForm>
                                            )}
                                            {!loggingIn && (
                                                <RegisterForm>
                                                    <SectionTitle>Zarejestruj się</SectionTitle>
                                                    <Input
                                                        type="email"
                                                        placeholder="Email"
                                                        value={email}
                                                        name="email"
                                                        onChange={(ev) => setEmail(ev.target.value)}
                                                        error={formErrors?.email || registrationError}
                                                    />
                                                    {formErrors?.email && (
                                                        <ErrorMessage>{formErrors.email}</ErrorMessage>
                                                    )}
                                                    {registrationError && (
                                                        <ErrorMessage>{registrationError}</ErrorMessage>
                                                    )}
                                                    <Input
                                                        type="password"
                                                        placeholder="Hasło"
                                                        value={password}
                                                        name="password"
                                                        onChange={(ev) => setPassword(ev.target.value)}
                                                        error={formErrors?.password}
                                                    />
                                                    {formErrors?.password && (
                                                        <ErrorMessage>{formErrors.password}</ErrorMessage>
                                                    )}
                                                    <ActionButtons>
                                                        <Button black block onClick={handleRegister}>
                                                            Zarejestruj się
                                                        </Button>
                                                        <Button onClick={() => setLoggingIn(true)}>
                                                            Anuluj
                                                        </Button>
                                                    </ActionButtons>
                                                </RegisterForm>
                                            )}

                                        </>
                                    )}
                                    {session && (
                                        <Button primary onClick={logout}>
                                            Wyloguj
                                        </Button>
                                    )}
                                    {!session && (
                                        <Button primary onClick={login}>
                                            Zaloguj się za pomocą Google
                                        </Button>
                                    )}
                                </AccountSection>
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                </ColsWrapper>
            </Center>
        </>
    );
}
