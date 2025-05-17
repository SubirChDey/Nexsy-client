import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import app from "../firebase/firebase.config";
import useAxiosPublic from "../hooks/useAxiosPublic";


export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
    const googleProvider = new GoogleAuthProvider();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();


    const createNewUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);

    }

    const userLogin = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    const googleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)

    }

    const manageProfile = (name, image) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: image
        })
    }

    const logOut = () => {
        setLoading(true);
        return signOut(auth)
            .then(() => {
                setUser(null);
            })
    }

    // const logOut = async () => {
    //     setLoading(true);
    //     try {
    //         await signOut(auth);
    //         setUser(null);
    //     } catch (error) {
    //         console.error("Logout failed:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const authInfo = {
        user,
        setUser,
        createNewUser,
        logOut,
        userLogin,
        loading,
        googleLogin,
        manageProfile,
    };

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    //         // setUser(currentUser);
    //         // setLoading(false);
    //         if (currentUser?.email) {
    //             setUser(currentUser);
    //             const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, {
    //                 email: currentUser?.email
    //             },
    //                 { withCredentials: true })               
    //             setLoading(false);
    //         }
    //         else {
    //             // setUser(currentUser);
    //             const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/logout`,
    //                 { withCredentials: true })
    //                 setLoading(false);
    //         }

    //     });

    //     return () => {
    //         unsubscribe();
    //     }

    // }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userInfo = { email: currentUser.email };
                axiosPublic.post('/jwt', userInfo)
                    .then(res => {
                        if (res.data.token) {
                            localStorage.setItem('access-token', res.data.token);
                            setLoading(false);
                        }
                    })


            }
            else {
                localStorage.removeItem('access-token');
                setLoading(false);
            }
        });

        return () => {
            unsubscribe();
        }

    }, [])


    return <AuthContext.Provider value={authInfo}>
        {children}
    </AuthContext.Provider>
};

export default AuthProvider