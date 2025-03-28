'use client'            

import { auth, db } from "@/firebase"
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import React , { useEffect,useContext,useState } from "react"

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}){
    const [currentUser, setCurrentUser] = useState(null)
    const [userDataObj, setUserDataObj] = useState(null)
    const [userDashboardData, setUserDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)

    // AUTH HANDLERS 
    function signup(email,password){
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password){
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout(){
        setUserDataObj(null)
        setCurrentUser(null)
        return signOut(auth)
    }
    
   useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, async user =>{
            try{
                // Set the user to our local context state
                setLoading(true)
                setCurrentUser(user)

                if(!user){
                    return
                }

                // if user exists, fetch data from firestore database

                const docRef = doc(db,'users', user.uid)
                const docSnap = await getDoc(docRef)
                let firebaseData = {}
                if(docSnap.exists()){
                    firebaseData = docSnap.data()
                }
                setUserDataObj(firebaseData)
            }catch(e){
                console.error(e)
            }finally{
                setLoading(false)
            }
        })
        return unsubscribe
    },[])

    const value = {
        currentUser,
        userDataObj,
        signup,
        logout,
        login,
        loading,
        setUserDataObj,
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}