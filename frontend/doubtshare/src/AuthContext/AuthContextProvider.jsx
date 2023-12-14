
import React from 'react'

export const appContext = React.createContext()

function AuthContextProvider({ children }) {

    const [isAuth, setisAuth] = React.useState(localStorage.getItem('token') ? true : false);

    const [userRole, setUserRole] = React.useState(localStorage.getItem('role') ? localStorage.getItem('role') : '');

    const handleAuth = () => {
        setisAuth(!isAuth)
    }

    const handleRole = () => {
        setUserRole(localStorage.getItem('role') || '');
        window.location.reload();
    }

    return (
        <appContext.Provider value={{ isAuth, handleAuth, userRole, handleRole }}>
            {children}
        </appContext.Provider>
    )
}

export default AuthContextProvider
