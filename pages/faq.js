import Header from "@/components/Header";
import Center from "@/components/Center";
import styled from "styled-components";

const FAQComponent = styled.div`
  padding: 15px 0;
`

const FAQName = styled.div`
  font-size: 20px;
`

const FAQDescription = styled.div`
  font-size: 14px;
`

export default function FAQPage(){
    return (
        <>
            <Header></Header>
            <Center>
                <FAQComponent>
                    <h1>Najczęściej zadawane pytania</h1>
                    <FAQComponent>
                        <FAQName>1. Jak mogę złożyć zamówienie?</FAQName>
                        <FAQDescription>Aby złożyć zamówienie, wybierz interesujące Cię produkty i dodaj je do koszyka. Następnie przejdź do koszyka, klikając ikonę w prawym górnym rogu strony, i postępuj zgodnie z instrukcjami, aby sfinalizować zakup.</FAQDescription>
                    </FAQComponent>
                    <FAQComponent>
                        <FAQName>2. Jakie formy płatności są akceptowane?</FAQName>
                        <FAQDescription>Akceptujemy płatności kartami kredytowymi</FAQDescription>
                    </FAQComponent>
                    <FAQComponent>
                        <FAQName>3. Czy moje dane osobowe są bezpieczne?</FAQName>
                        <FAQDescription>Tak, dbamy o bezpieczeństwo Twoich danych osobowych i stosujemy odpowiednie środki ochrony zgodnie z obowiązującymi przepisami o ochronie danych.</FAQDescription>
                    </FAQComponent>
                    <FAQComponent>
                        <FAQName>4. Jakie są koszty wysyłki?</FAQName>
                        <FAQDescription>Koszt wysyłki stanowi 25zł</FAQDescription>
                    </FAQComponent>
                    <FAQComponent>
                        <FAQName>5. Czy oferujecie międzynarodową wysyłkę?</FAQName>
                        <FAQDescription>Tak, oferujemy wysyłkę międzynarodową do wszystkich krajów.</FAQDescription>
                    </FAQComponent>
                    <FAQComponent>
                        <FAQName>6. Jak mogę założyć konto w sklepie?</FAQName>
                        <FAQDescription>Aby założyć konto, kliknij "konto" zostaniesz przekierowany na stronę z swoim kontem, gdzie zmożesz zalogować się albo założyć konto</FAQDescription>
                    </FAQComponent>
                    <FAQComponent>
                        <FAQName>7. Czy mogę dodać komentarz produktu?</FAQName>
                        <FAQDescription>Tak, możesz dodać komentarz i ocenić produkt kiedy wejdziesz na stronę konkretnego produktu</FAQDescription>
                    </FAQComponent>
                </FAQComponent>
            </Center>
        </>
    )
}