import FluidPage from "../components/layout";
import { NavMenuKey, PageTitle } from "../utils";
import Landing from "../components/landing";

export const Home = (): JSX.Element => (
  <FluidPage title={PageTitle.HOME} selectedkey={NavMenuKey.HOME}>
    <Landing />
  </FluidPage>
);

export default Home;
