import React from 'react';
import { useAuth, logout } from './auth';

const Logout = () => {
  const [auth] = useAuth();
  return auth ? <button className='btn btn-sm mb-0 me-1 bg-gradient-dark' onClick={logout}>Logout</button> : ''
}

class Header extends React.Component {
  render() {
    return(
      <div className="container position-sticky z-index-sticky top-0">
        <div className="row">
          <div className="col-12">
            <nav className="navbar navbar-expand-lg blur border-radius-lg top-0 z-index-3 shadow position-absolute mt-4 py-2 start-0 end-0 mx-4">
              <div className="container-fluid ps-2 pe-0">
                <a className="navbar-brand font-weight-bolder ms-lg-0 ms-3" href="/">
                  Annotation Dashboard
                </a>
                <Logout />
              </div>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;