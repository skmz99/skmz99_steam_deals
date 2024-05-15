import React,{useEffect,useState} from "react";
import "./Profile.css"

const Profile = () =>{
    const [userName,setuserName] = useState();
    const [showDisplay, setshowDisplay] = useState('');
    const [user,setUser] = useState();
    const [errorMessage, seterrorMessage] = useState();
    const [fieldError, setfieldError] = useState({
        userName: false,
        passWord: false
    });
        
    useEffect(()=>{
        // fetch('http://localhost:5432/sessionUser',{
        fetch('https://smendez-steam-deals-229dfa09606a.herokuapp.com/sessionUser',{
            method: 'GET',
            credentials: 'include',
            headers:{
                'Content-Type':'application/json',
                'Connection':'keep-alive',
            }
        })
        .then((res)=>{return res.json()})
        .then((result)=>{
            result.message?
            setuserName()
            :
            result.userName?
            setuserName(result.userName)
            :
            setuserName()
        })
    },[])

    useEffect(()=>{
        // fetch('http://localhost:5432/userWishlist',{
        fetch('https://smendez-steam-deals-229dfa09606a.herokuapp.com/userWishlist',{
            method: 'GET',
            credentials:'include',
            headers:{
                'Content-Type':'application/json',
                'Connection':'keep-alive',
            }
        })
        .then((res)=>{return res.json()})
        .then((result)=>{(
            Object.values(result).includes("NO USER") || Object.values(result).includes("Zero wishlist")?
            setUser()
            :
            setUser(result)
            )
        })
        .catch((err)=>{console.log(err)})
    },[])

    const logout = () =>{
        // fetch('http://localhost:5432/logout',{
        fetch('https://smendez-steam-deals-229dfa09606a.herokuapp.com/logout',{
            method: 'GET',
            credentials: 'include',
            headers:{
                'Content-Type':'application/json',
            }
        })
        .then((res)=>{return res.json()})
        .then((result)=>{if(result.bool === false) window.location.reload()})
        .catch((err)=>{console.log(err)})
    }
    const handleLogin = (e)=>{
        e.preventDefault();
        // fetch(`http://localhost:5432/checkUser?username=${e.target[0].value}&password=${e.target[1].value}`,{
        fetch(`https://smendez-steam-deals-229dfa09606a.herokuapp.com/checkUser?username=${e.target[0].value}&password=${e.target[1].value}`,{
            method: 'GET',
            credentials:'include',
            headers:{
                'Content-Type':'application/json',
                'Connection' : 'keep-alive',
            }
        })
        .then((res)=>{return res.json()})
        .then((result)=>{
            Object.values(result).includes("Error: Username or Password are incorrect") ? seterrorMessage(Object.values(result)): window.location.reload()
            // console.log(Object.values(result));
        })
        .catch((err)=>{console.log(err)})
        // console.log(e.target);
    }

    const saveUserInfo = (e)=>{
        let name = e.target[0].value
        let password = e.target[1].value
        // fetch('http://localhost:5432/enterUser',{
        fetch('https://smendez-steam-deals-229dfa09606a.herokuapp.com/enterUser',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: name,
                passWord: password,
            })
        })
        .then((res)=>{return res.json()})
        .then((result)=>{result.message ? seterrorMessage(result.message): window.location.reload()
        
            // console.log(Object.values(result.message))
        })
        .catch((err)=>{console.log(err)})
    }

    const handleCreatelogin = (e) =>{
        e.preventDefault();
        //initialize both as false incase neither input fields are wrong
        var userNameBool = false;
        var passWordBool = false;
        //sets userName field as true to flag an error message
        if(e.target[0].value.length < 1 || e.target[0].value === undefined){
            userNameBool = true;
        }
        //sets passWord field as true to flag and error message
        if(e.target[1].value.length < 1 || e.target[1].value === undefined){
            passWordBool = true;
        }
        //update the useState fieldError to show the error message
        setfieldError({
            userName: userNameBool,
            passWord: passWordBool
        })
        seterrorMessage();
        if(userNameBool === false && passWordBool === false){
            saveUserInfo(e);
        }
    }

    const handleremoveWishlist = (e,value) =>{
        // fetch(`http://localhost:5432/removeWishlist?steamAppID=${value}`,{
        fetch(`https://smendez-steam-deals-229dfa09606a.herokuapp.com/removeWishlist?steamAppID=${value}`,{
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type':'application/json',
            },
        })
        .then(()=>{
            window.location.reload();
        })
        .catch((err)=>{console.log(err)})
    }

    return(
        <div className="profile-wrapper">
            <div style={{height: '10%',border: '1px solid black', overflow: "hidden"}}>
                <div style={{display: 'flex', flexDirection: 'row',width: '100%', height: '100%'}}>
                    <div style={{position: 'relative',display: 'flex', flexWrap: 'wrap', width: '70%',justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                        <div style={{display: 'flex', overflowWrap: 'break-word', hegith: '100%', width: '100%', flexFlow: 'column '}}>

                            {userName === undefined ? 
                                <span style={{opacity: 0.3}}>No User</span>
                                :
                                <span style={{fontSize: '0.9vw'}}>{userName}</span>
                            }
                        </div>
                    </div>

                    <div style={{display: 'flex', width: '30%', alignItems: 'flex-end'}}>
                        {userName === undefined ?
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <button onClick={()=>{setshowDisplay("Login")}}>Login</button>
                                <button onClick={()=>{setshowDisplay("Sign up")}}>Sign Up</button>
                            </div>
                            :
                            <>
                                <button onClick={(e)=>{logout(e)}}>Sign out</button>
                            </>
                        }
                    </div>
                </div>
            </div>
            {/* User Wistlist*/}
            <div className="user-wishlistArea">
                {/* <span style={{opacity: '0.5',}}>aslkdf</span> */}
                {  
                    userName !== undefined && user !== undefined?
                    <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%'}}>
                        <div style={{width: '100%',}}>
                            <button onClick={()=>{window.location.reload()}}>Refresh</button>
                        </div>
                        {/* {console.log(user)} */}
                        {user.map((val,key)=>{
                            
                            return(
                                <div key={key} style={{display: 'flex', flexDirection: 'row',border: '1px solid black', width: '100%',height: '50px'}}>
                                    <button onClick={()=>{window.open(`https://store.steampowered.com/app/${val.steamappid}`)}} style={{height: '100%', width: '50%',background: 'none', color: 'inherit', border: 'none', padding: '0', font: 'inherit', outline: 'inherit',cursor: 'pointer' }}>
                                        <img style={{height: '100%', width: '100%', fontSize: '10px'}} src={String.fromCharCode.apply(String,val.picture['data'])} alt={val.title}></img>
                                    </button>
                                    <div style={{border: '1px solid black'}}/>
                                    <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '25%'}}>
                                        <div style={{backgroundColor: 'lightgreen', height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black'}}>
                                            <span style={{fontSize: '6px', fontWeight: 'bold'}}>Original Price</span>
                                        </div>
                                        <div style={{backgroundColor: 'lightgreen',height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <span style={{padding: '4px', fontWeight: 'bold', }}>{"$"+val.saleprice}</span>
                                        </div>
                                    </div>
                                    <div style={{border: '1px solid black'}}/>
                                    <div style={{backgroundColor: 'red',width: '25%',display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
                                        <button onClick={(e)=>{handleremoveWishlist(e,val.steamappid)}} style={{backgroundColor: 'red', background: 'none', color: 'inherit', border: 'none', padding: '0', font: 'inherit', outline: 'inherit',cursor: 'pointer' }}>
                                            <span style={{fontSize: '7px', fontWeight: 'bold'}}>Delete From Wishlist</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    :
                userName === undefined && showDisplay !== "Login" && showDisplay !== "Sign up"?
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
                        <span>No Logged in User</span>
                        <br/>
                        <span style={{fontSize: '15px'}}>Please login or create an account</span>
                    </div>
                    :
                    showDisplay === "Login" ?
                    <div style={{display: 'flex', flexDirection: 'row', /*background: 'lightgray'*/ minHeight: '100px', minWidth: '100%'}}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div>
                                <span>Login</span>
                            </div>
                            <form onSubmit={(e)=>{handleLogin(e)}}>
                                <div>
                                    <input style={{margin: '3px', width: '180px', borderColor: (fieldError['userName']!== false || (errorMessage !== undefined && errorMessage.includes("Error: Username or Password Are Incorrect."))) ? 'red':''}} name="userName" placeholder="Username"/>
                                    {errorMessage !== undefined && errorMessage.includes("Error: Username or Password are incorrect")?
                                        <span style={{fontSize: '10px', color: 'red'}}>{errorMessage}</span>
                                        :
                                        ""
                                    }
                                </div>
                                <div>
                                    <input style={{margin: '3px', width: '180px', borderColor: (fieldError['userName']!== false || (errorMessage !== undefined && errorMessage.includes("Error: Username or Password Are Incorrect.")))? 'red':''}} name="passWord" placeholder="Password"/>
                                    {errorMessage !== undefined && errorMessage.includes("Error: Username or Password are incorrect")?
                                        <span style={{fontSize: '10px', color: 'red'}}>{errorMessage}</span>
                                        :
                                        ""
                                    }
                                </div>
                                <div className="submit_login_container">
                                    <button type="submit">submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    :
                    <div style={{display: 'flex', flexDirection: 'row', /*background: 'lightgray'*/ minHeight: '100px', minWidth: '100%'}}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div>
                                <span>Create Account</span>
                            </div>
                            <form onSubmit={(e)=>{handleCreatelogin(e)}}>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <div>
                                        <input style={{borderColor: fieldError['userName'] === false ? 'black' : 'red'}} name="Username" placeholder="Username"/>
                                    </div>                                    <div>

                                        {fieldError['userName'] === false? 
                                            ""
                                            :
                                            <span style={{fontSize: '10px',color: 'red'}}>Error: <span style={{color: 'red'}}>No Username was given.</span></span>
                                        }
                                        {errorMessage !== undefined && errorMessage.includes('duplicate key')?
                                            <span style={{fontSize: '10px', color: 'red'}}>Username Already Exist.</span>
                                            :
                                            ""
                                        }
                                    </div>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <div>
                                        <input style={{borderColor: fieldError['passWord'] === false ? 'black' : 'red'}} name="Password" placeholder="Password"/>
                                    </div>
                                    <div>
                                        {fieldError['passWord'] === false?
                                            ""
                                            :
                                            <span style={{fontSize: '10px',color: 'red'}}>Error: <span style={{color: 'red'}}>No Password was given.</span></span>
                                        }
                                    </div>
                                </div>
                                <div className="submit_login_container">
                                    <button type="submit">submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
export default Profile;