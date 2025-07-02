import React , {useEffect , useState , createContext} from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/ApiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user , setUser] = useState(null);
    const [loading , setLoading] = useState(true); //new state to track loading status

    useEffect(() => {
        if (user) {
            return;
        }

        const accessToken = sessionStorage.getItem("token");
        if (!accessToken) {
            setLoading(false);
            return ;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
            } catch (error) {
                console.error("User not Authenticated" , error);
                clearUser();
            } finally {
                setLoading (false);
            }
        }

        fetchUser();
    } , [])

    const updateUser = (userData) => {
        setUser(userData);
        sessionStorage.setItem("token" , userData.token); // Save token
        setLoading(false);
    };

    const clearUser = () => {
        setUser(null);
        sessionStorage.removeItem("token");
    };

    return(
        <UserContext.Provider value={{ user , loading , updateUser , clearUser }}>
            {children}
        </UserContext.Provider>
    )

}

export default UserProvider;