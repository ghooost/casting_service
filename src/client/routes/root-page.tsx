import { Login } from "@components/Login";
import { Page } from "@components/Page";

export const RootPage = () => (
  <Page>
    <header>Title</header>
    <section>Comething about sevice</section>
    <section>Promo</section>
    <section>
      <Login />
    </section>
  </Page>
);
