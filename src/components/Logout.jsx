import React from 'react'
import { useNavigate } from 'react-router-dom';


const Logout = () => {

  const navigate = useNavigate();


const logoutHandler = ()=>{
    localStorage.removeItem('userName'); // Clear the user name
    localStorage.removeItem('userEmail'); // Clear email if stored
    localStorage.removeItem('token'); // Clear email if stored
    
    navigate('/'); // Redirect to login page
}

return (
    <div>
        <h2>Logout</h2>

        <p>click here for logout</p>
        <h2><button onClick={logoutHandler}> Logout </button></h2>
    </div>
  )
}

export default Logout