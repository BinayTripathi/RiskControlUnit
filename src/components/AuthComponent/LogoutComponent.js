import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

import {logoutUser} from '@store/ducks/userSlice'
import { SCREENS } from '@core/constants';

export default function Logout() {

    const dispatch = useDispatch()
    const navigation = useNavigation()
    return (
       
        <AntDesign name="logout" size={24} color="black" onPress={() => {
                dispatch(logoutUser())
                navigation.reset({
                    index: 0,
                    routes: [{ name: SCREENS.Login , params: { lastState: 'Logout' }}],
            })
            }}

            onLongPress={() => {
                dispatch({ type: "DESTROY_SESSION" });
                navigation.reset({
                    index: 0,
                    routes: [{ name: SCREENS.Login , params: { lastState: 'Logout' }}],
            })
            }}

           />
     
    )
}


