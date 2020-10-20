import FluidPage from "components/layout";
import { PageTitle } from "utils/index";

const NotFoundPage = () => {
  return (
    <FluidPage title={PageTitle.NOT_FOUND}>
      <h1>404 Page Not Found</h1>
    </FluidPage>
  );
};

export default NotFoundPage;
