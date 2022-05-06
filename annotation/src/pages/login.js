import React from 'react';
import { login } from '../components/auth';
import Header from '../components/header';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {first_name: '', last_name: '', email: '', password: '', form_type: 'Sign In'};

    this.actionFocus = this.actionFocus.bind(this);
    this.actionBlur = this.actionBlur.bind(this);
    this.fnameChange = this.fnameChange.bind(this);
    this.lnameChange = this.lnameChange.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.passChange = this.passChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFunction = this.setFunction.bind(this); 
  }
  actionFocus(e) {
    var ele = document.getElementById(e.target.ariaLabel);
    ele.classList.add('is-focused');
  }
  actionBlur(e) {
    var ele = document.getElementById(e.target.ariaLabel);
    if (e.target.value === '') {
      ele.classList.remove('is-focused');
    }
  }
  fnameChange(e) { this.setState({first_name:e.target.value}) }
  lnameChange(e) { this.setState({last_name:e.target.value}) }
  emailChange(e) { this.setState({email:e.target.value}) }
  passChange(e) { this.setState({password:e.target.value}) }
  handleSubmit() {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if(this.state.form_type === 'Sign In') {
      if(!emailPattern.test(this.state.email) | this.state.password === '') {
        toast.error("Both of the email and password should be filled properly", {position: "top-left"});
      } else {
        fetch('/api/user/login', {
          method: 'post',
          body: JSON.stringify({'email': this.state.email, 'password': this.state.password})
        }).then(r => r.json()
        ).then(ret => {
          if(ret.status === 200) {
            toast.success(ret.msg, {position: "top-left"});
            login(ret.token);
            window.location.href = '/';
          } else {
            toast.error(ret.msg, {position: "top-left"});
          }
        });
      }
    } else if(this.state.form_type === 'Sign Up') {
      if(!emailPattern.test(this.state.email) | this.state.password === '' | this.state.first_name === '' | this.state.last_name === '') {
        toast.error("Please fill all the fields before submitting the form", {position: "top-left"});
      } else {
        fetch('/api/user/register', {
          method: 'post',
          body: JSON.stringify({'email': this.state.email, 'password': this.state.password, 
                'first_name': this.state.first_name, 'last_name': this.state.last_name})
        }).then(r => r.json()
        ).then(ret => {
          if(ret.status === 200) { 
            toast.success(ret.msg, {position: "top-left"});
            this.setState({form_type:'Sign In'})
          } else {
            toast.error(ret.msg, {position: "top-left"});
          }
        });
      }
    } else if(this.state.form_type === 'Forgot Password') {
      if(!emailPattern.test(this.state.email) | this.state.password === '') {
        toast.error("Both of the email and password should be filled properly", {position: "top-left"});
      } else {
        fetch('/api/user/forgot', {
          method: 'post',
          body: JSON.stringify({'email': this.state.email, 'password': this.state.password})
        }).then(r => r.json()
        ).then(ret => {
          if(ret.status === 200) {
            toast.success(ret.msg, {position: "top-left"});
            this.setState({form_type:'Sign In'})
          } else {
            toast.error(ret.msg, {position: "top-left"});
          }
        });
      }
    }
  }
  setFunction(e) { this.setState({form_type:e.target.ariaLabel}) }
  render() {
    return(
      <>
        <Header />

        <main className="main-content  mt-0">
          <section>
            <div className="page-header min-vh-100">
              <div className="container">
                <div className="row">
                  <div className="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
                    <div className="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center bg-signup-image" ></div>
                  </div>
                  <div className="col-xl-4 col-lg-5 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5">
                    <div className="card card-plain">
                      <div className="card-header">
                        <h4 className="font-weight-bolder">{ this.state.form_type }</h4>
                        <p className="mb-0">Enter the following details to proceed further</p>
                      </div>
                      <div className="card-body">
                        <form>
                          { this.state.form_type === 'Sign Up' && <>
                              <div className="input-group input-group-outline mb-3" id='first-name'>
                                <label className="form-label">First Name</label>
                                <input type="text" className="form-control" aria-label='first-name' 
                                  onFocus={ this.actionFocus } onBlur={ this.actionBlur } 
                                  value={ this.state.first_name } onChange={ this.fnameChange } />
                              </div>
                              <div className="input-group input-group-outline mb-3" id='last-name'>
                                <label className="form-label">Last Name</label>
                                <input type="text" className="form-control" aria-label='last-name' 
                                  onFocus={ this.actionFocus } onBlur={ this.actionBlur } 
                                  value={ this.state.last_name } onChange={ this.lnameChange } />
                              </div>
                            </>
                          }
                          <div className="input-group input-group-outline mb-3" id='email'>
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" aria-label='email' 
                              onFocus={ this.actionFocus } onBlur={ this.actionBlur } 
                              value={ this.state.email } onChange={ this.emailChange } />
                          </div>
                          <div className="input-group input-group-outline mb-3" id='password'>
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" aria-label='password' 
                              onFocus={ this.actionFocus } onBlur={ this.actionBlur } 
                              value={ this.state.password } onChange={ this.passChange } />
                          </div>
                          <div className="text-center">
                            <button type="button" className="btn btn-lg bg-gradient-primary btn-lg w-100 mt-4 mb-0" onClick={ this.handleSubmit }>{ this.state.form_type }</button>
                          </div>
                        </form>
                      </div>
                      <div className="card-footer text-center pt-0 px-lg-2 px-1">
                        {
                          this.state.form_type === 'Sign Up' &&  <p className="mb-2 text-sm mx-auto">
                            Already have an account?
                            <span className="text-primary text-gradient font-weight-bold" style={{cursor:"pointer"}} 
                              onClick={ this.setFunction } aria-label='Sign In'> Sign In</span>
                          </p>
                        }
                        {
                          this.state.form_type === 'Sign In' &&  <p className="mb-2 text-sm mx-auto">
                            Don't have an account?
                            <span className="text-primary text-gradient font-weight-bold" style={{cursor:"pointer"}} 
                              onClick={ this.setFunction } aria-label='Sign Up'> Sign Up</span>
                            <br />Or Forgot your password?
                            <span className="text-primary text-gradient font-weight-bold" style={{cursor:"pointer"}} 
                              onClick={ this.setFunction } aria-label='Forgot Password'> Change it here</span>
                          </p>
                        }
                        {
                          this.state.form_type === 'Forgot Password' &&  <p className="mb-2 text-sm mx-auto">
                            <span className="text-primary text-gradient font-weight-bold" style={{cursor:"pointer"}} 
                              onClick={ this.setFunction } aria-label='Sign Up'>Sign Up </span>
                            Or
                            <span className="text-primary text-gradient font-weight-bold" style={{cursor:"pointer"}} 
                              onClick={ this.setFunction } aria-label='Sign In'> Sign In</span>
                          </p>
                        }

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }
}


export default Login;