import buildClient from '../api/build-client';
import Layout from '../components/Layout';

const HomePage = ({ currentUser }) => {
  return (
    <Layout currentUser={currentUser}>
      {currentUser ? (
        <h1>You are signed in!</h1>
      ) : (
        <h1>You are not signed in!</h1>
      )}
    </Layout>
  );
};

export default HomePage;

export const getServerSideProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return { props: { currentUser: data.currentUser } };
};
