import  '../Styles/login.css'
import axios from 'axios'
import React, { useContext } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { appContext } from '../AuthContext/AuthContextProvider'

let initialstate = {
    email: "",
    password: ""
}

const reducer = (state = initialstate, { type, payload }) => {
    switch (type) {
        case 'email': {
            return {
                ...state,
                email: payload
            }
        }
        case 'pass': {
            return {
                ...state,
                password: payload
            }
        }
        case 'reset': {
            return {
                ...initialstate
            }
        }
        default: {
            throw new Error('Error')
        }
    }
}


function Login() {

    const { isAuth, handleAuth, handleRole } = useContext(appContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [state, dispatch] = React.useReducer(reducer, initialstate);

    const handleloginsubmit = (e) => {
        e.preventDefault()
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_BASE_URL}/user/login`,
            data: state
        }).then((res) => {
            console.log(res.data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            handleAuth();
            handleRole();
            navigate(location.state, { replace: true });
        }).catch((err) => {
            console.log(err)
        })
    }

    const { email, password } = state;

    return (
        <>
            {
                isAuth ? < Navigate to={'/'} /> :
                    < form onSubmit={handleloginsubmit} className="loginpageform">
                        <h3>Login Here</h3>
                        <input id="userlogindata1" type="text" placeholder='email' value={email} onChange={(e) => dispatch({ type: 'email', payload: e.target.value })} />
                        <input id="userlogindata2" type="password" placeholder='password' value={password} onChange={(e) => dispatch({ type: 'pass', payload: e.target.value })} />
                        <button type='submit'>Login</button>
                    </form >
            }
        </>
    )
}

export default Login
