import { Navigate, Route, Outlet } from 'react-router-dom'
import Cookies from 'universal-cookie';

const PrivateRoute = () => {
    const cookies = new Cookies();
    const auth = cookies.get('auth');

    return  <Outlet /> 
}
export default PrivateRoute;