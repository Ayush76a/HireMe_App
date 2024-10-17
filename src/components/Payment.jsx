import React from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom';

// cashfree frontend package to get cashfree sandbox environment
import {load} from '@cashfreepayments/cashfree-js';
import { useState } from 'react'

const Payment = () => {
  const [orderId, setOrderId] = useState("")

  // Retrieve the token from cookies
  const tokenRow = document.cookie.split('; ').find(row => row.startsWith('token='));
  const token = tokenRow ? tokenRow.split('=')[1] : null; // Get the token value or null
  // Log the token for debugging purposes
//   console.log('Token:', token);

  // Using SDK from cashfree npm package
  let cashfree;
  let initialiseSDK = async function(){
    cashfree = await load({
      mode: "sandbox" //or production
    });
  }

  initialiseSDK();

  // getting data from states
  const location = useLocation();
  const { helperName, helperEmail, fees } = location.state || {}; // Use optional chaining to avoid errors

  const getSessionId = async() => {
    try{
        let res = await axios.post("http://localhost:8080/pay",
        {
            fees: fees,
            helper_name: helperName,
            helper_email: helperEmail,
        },
        {
            withCredentials: true,  // Ensure cookies are sent with the request
            headers: {
              'Authorization': `Bearer ${token}`,  // Pass the token in the Authorization header
            },
        })

        if(res.data && res.data.payment_session_id){
        //   console.log(res.data)
          setOrderId(res.data.order_id)

          return res.data.payment_session_id
        }
    }
    catch(Error){
      console.log("Error");
    }
  }

  // VERIFY AFTER PAYMENT
  const verifyPayment = async()=>{
    try{
      let res = await axios.post("http://localhost:8080/verify", {orderId: orderId})
      
      if(res && res.data){
        alert("Payment Verified")
      }
    }


    catch(e){
      console.log(e);
    }
  }


  // on click handler
  const HandlePayment = async(e)=>{
    e.preventDefault();

    try{
      // making session id (similar to a order id)

      let sessionId = await getSessionId();
      // session Id ko le ke hm popup show krwaenge checkout ke liye 

      let checkoutOptions = {
        paymentSessionId : sessionId,
        redirectTarget : "_modal",           // modal => on you localhost (frontend) the popup of chekout will be coming
      }

      cashfree.checkout(checkoutOptions).then((res)=>{
        console.log("payment initiated")
        // payment jo hua hai user se usko verify bhi karana hoga

        verifyPayment(orderId)
      })
    }
    catch(e){
      console.log(e)
    }
  }

  return (
    <div >
          <h1>Click Here to proceed with Payment</h1>
          <button onClick={HandlePayment}>Pay</button>
    </div>
  )
}

export default Payment