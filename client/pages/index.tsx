import FluidPage from "../components/layout";
import { menuKeys, PageTitle } from "../util";
import Landing from "../components/landing";

export const Home = (): JSX.Element => (
  <FluidPage title={PageTitle.HOME} selectedkey={menuKeys.home}>
    <Landing />
  </FluidPage>
);

export default Home;
