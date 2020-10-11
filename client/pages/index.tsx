import FluidPage from "../components/layout";
import { menuKeys, pageTitles } from "../util";
import Landing from "../components/landing";

export const Home = (): JSX.Element => (
  <FluidPage title={pageTitles.home} selectedkey={menuKeys.home}>
    <Landing />
  </FluidPage>
);

export default Home;
