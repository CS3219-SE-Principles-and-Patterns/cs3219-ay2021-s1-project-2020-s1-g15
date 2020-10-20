import FluidPage from "components/layout";
import { PageTitle } from "util/index";

const ErrorPage = () => {
  return (
    <FluidPage title={PageTitle.NOT_FOUND}>
      <h1>404 Page Not Found</h1>
    </FluidPage>
  );
};

export default ErrorPage;
