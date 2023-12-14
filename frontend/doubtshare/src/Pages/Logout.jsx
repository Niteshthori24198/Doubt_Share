import axios from 'axios';
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { appContext } from '../AuthContext/AuthContextProvider';

function Logout() {

    const { handleAuth, handleRole } = useContext(appContext);

    React.useLayoutEffect(() => {

        async function Logout() {
            const token = localStorage.getItem('token');

            await axios.post(`${process.env.REACT_APP_BASE_URL}/user/logout`, {}, { headers: { 'authorization': `Bearer ${token}` } })

            localStorage.clear();
            handleAuth();
            handleRole();
            
        }

        Logout();

    }, [])

    return (
        <>

            {
                <Navigate to={"/Login"} />
            }

        </>
    )
}

export default Logout
