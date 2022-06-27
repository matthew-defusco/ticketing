import Header from './Header';
const Layout = ({ children, currentUser }) => {
  return (
    <div className="container">
      <Header currentUser={currentUser}></Header>
      <div className="mx-3">{children}</div>
    </div>
  );
};

export default Layout;
