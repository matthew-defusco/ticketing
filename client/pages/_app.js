import 'bootstrap/dist/css/bootstrap.css';

const AppComponent = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

// AppComponent.getInitialProps = async (appContext) => {
//   const client = buildClient(appContext.ctx);
//   const { data } = await client.get('/api/users/currentuser');
//   console.log(data);
//   return data;
// };

export default AppComponent;
