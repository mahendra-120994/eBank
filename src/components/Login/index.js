import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {userId: '', pin: '', errorMsg: '', showSubmitError: false}

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    console.log(errorMsg)
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
//     const userDetails = {userId, pin}
    const userDetails = {
      user_id: userId,
      pin: userPin,
    }
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  userIdInput = event => {
    this.setState({userId: event.target.value})
  }

  userPinInput = event => {
    this.setState({pin: event.target.value})
  }

  render() {
    const token = Cookies.get('jwt_token')
    if (token === undefined) {
      return <Redirect to="/" />
    }
    const {userId, pin, errorMsg, showSubmitError} = this.state

    return (
      <div className="login-bg">
        <div className="login-img-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="login-img"
          />
        </div>
        <div className="form-container">
          <form className="form" onSubmit={this.submitForm}>
            <h1 className="form-heading">Welcome Back</h1>
            <label className="label" htmlFor="userId">
              User ID
            </label>
            <input
              className="input"
              type="text"
              id="userId"
              onChange={this.userIdInput}
              value={userId}
              placeholder="Enter User ID"
            />
            <label className="label" htmlFor="password">
              PIN
            </label>
            <input
              className="input"
              type="password"
              id="password"
              onChange={this.userPinInput}
              value={pin}
              placeholder="Enter PIN"
            />
            <button className="login-btn" type="submit">
              Login
            </button>
            {showSubmitError && <p className="error">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}
export default Login
