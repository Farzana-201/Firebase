import { createContext, useContext, useEffect, useState } from "react";
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, SignInWithEmailAndPassword, signOut} from 'firebase/auth';
import { auth } from "../firebase.Config";
import { doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase.Config";
export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);


    useEffect(()=>{
         const unsub = onAuthStateChanged(auth, (user)=>{
            // console.log('got user: ', user);
            if(user){
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid);
            }else{
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unsub;
    },[]);
    const updateUserData = async (userId)=>{
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            let data = docSnap.data();
          setUser((prev) => ({
            ...prev,
            username: data.username, 
            profileUrl: data.profileUrl,
            userId: data.userId
            }));


        }
    }

    const login = async (email, password)=>{
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            return {success: true};
        }catch(e){
             let msg = e.message;
            if (msg.includes('(auth/invalid-email')) msg='Invalid email'
            if (msg.includes('(auth/invalid-credential)')) msg='Wrong credentials'
            return {success: false, msg};
        }
    }
    const logout = async (email, password)=>{
        try{
        await signOut(auth);
        return {success: true}
        }catch(e){ 
            return {success: false, msg: e.message, error: e};
        }
    }
    const register = async (email, password, username, profileUrl)=>{
        try{
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log('response.user :', response?.user);

          // setUser(response?.user);
          // setIsAuthenticated(true)

          await setDoc(doc(db, "users", response?.user?.uid),{
            username,
            profileUrl,
            userId: response?.user?.uid

          });
          return {success: true, data: response?.user};
        }catch(e){ 
          
        }
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    const value = useContext(AuthContext);

    if(!value){
        throw new Error('useAuth must be wrapped inside AuthContextProvider');
    }
    return value; 
}