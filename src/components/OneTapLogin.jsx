import React from 'react'
import { useGoogleOneTapLogin } from 'react-google-one-tap-login';

const OneTapLogin = () => {
  return (
    <div>
        <GoogleOneTapLogin onError={(error) => console.log(error} onSuccess={(response) => console.log(response} googleAccountConfigs={{ client_id:"475904526860-ck3h4ohk35hom7gd213cvu9all68kh0e.apps.googleusercontent.com" }} />,
    </div>
  )
}

export default OneTapLogin