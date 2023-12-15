
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import Logout from '../Pages/Logout'
import Register from '../Pages/Register'
import PrivateRoute from '../PrivateRoutes/PrivateRoute'
import CreateDoubt from '../Pages/CreateDoubt'
import Doubts from '../Pages/Doubts'


export default function AllRoutes() {
    return <>

        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/Add-user' element={<Register />} />
            <Route path='/Create-doubt' element={<PrivateRoute><CreateDoubt /></PrivateRoute>} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Logout' element={<Logout />} />
            <Route path='/Doubts' element={
                <PrivateRoute><Doubts /></PrivateRoute>
            } />


        </Routes>


    </>
}