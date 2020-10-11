import FluidPage from "../../components/layout";
import { useRouter } from "next/router";

const User = (): JSX.Element => {
  const router = useRouter();
  const { uid } = router.query;
  return (
    <FluidPage title="AnswerLeh - User">
      {<p>I am a single user page :{uid}</p>}
    </FluidPage>
  );
};

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  //const res = await fetch(`${process.env.localhost}questions/`)
  //const data = await res.json()
  const data = {};
  // Pass data to the page via props
  return { props: { data } };
}

export default User;
