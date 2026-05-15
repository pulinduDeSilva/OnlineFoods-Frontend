import { Outlet } from 'react-router';
import Nav from '../nav/nav';

function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

export default Layout;
