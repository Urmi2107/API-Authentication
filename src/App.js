import logo from './logo.svg';
import './App.css';
import { API, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import * as AWS from 'aws-sdk';
import { APIGateway } from 'aws-sdk';
import base64 from 'base-64';
import { useState } from 'react';
import {Amplify} from 'aws-amplify';
Amplify.configure({
  "aws_project_region": "us-east-1",
  "aws_cognito_identity_pool_id": "us-east-1:8cb86d28-e74e-4fde-8eb9-4f789f10ed27",
  "aws_cognito_region": "us-east-1",
  "aws_user_pools_id": "us-east-1_z0oPpIGop",
  "aws_user_pools_web_client_id": "1cpmb8lcl9vr88q0m6h3b383h2",
  "oauth": {},
  "aws_cognito_username_attributes": [],
  "aws_cognito_social_providers": [],
  "aws_cognito_signup_attributes": [
      "EMAIL"
  ],
  "aws_cognito_mfa_configuration": "OFF",
  "aws_cognito_mfa_types": [
      "SMS"
  ],
  "aws_cognito_password_protection_settings": {
      "passwordPolicyMinLength": 8,
      "passwordPolicyCharacters": []
  },
  "aws_cognito_verification_mechanisms": [
      "EMAIL"
  ],
  "aws_cloud_logic_custom": [
    {
        "name": "authtest",
        "endpoint": "https://1twetzjvk2.execute-api.us-east-1.amazonaws.com/dev",
        "region": "us-east-1"
    },
    {
      "name": "authtest_1",
      "endpoint": "https://overridetestdomain.auth.us-east-1.amazoncognito.com",
      "region": "us-east-1"
  }
  ]
 
})

 function App() {
    const [isValid,setIsValid] = useState(false);
    const [token,setToken] = useState('');

    async function getToken(){

      const client_id= "5nlng9974e48quoji7qaafv6sq";
      const client_secreate = "hpdbseocgtgd1tvc29eevuhtj7rvdg3f7spk4j1vhl0ig6hioji";
      var clientCred = base64.encode(`${client_id}:${client_secreate}`);
      console.log(clientCred);
           const apiName = "authtest_1";
           const path = '/oauth2/token';
           const myInit = {
               headers: {
               Authorization: `Basic ${clientCred}`,
               "Content-Type": 'application/x-www-form-urlencoded'
             },
             queryStringParameters: {
               "grant_type":"client_credentials",
               "client_id":`${client_id}`,
               "scope":"testOverrideIdentifier/json"
             }
           };
           

           try {
              if(!isValid){
                const response = await API.post(apiName, path, myInit);

               checkValidity(response.expires_in);
               console.log("returning new token...");
               console.log(response);
               setIsValid(true);
               setToken(response.access_token);
               return response.access_token;
              }else{
                console.log("returning old token...");
                return token;
              }
               
           } catch (error) {
               console.log(error);
           }
     }
     async function checkValidity(time){
      const timer = setTimeout(() => {
        console.log('After 5 min!')
        setIsValid(false);
      }, time*999);
      
     }
    async function  callApi(){
      //const user = await Auth.currentAuthenticatedUser()
     // const token = user.signInUserSession.idToken.jwtToken
    
      // set the default config object
     /* var creds = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:8cb86d28-e74e-4fde-8eb9-4f789f10ed27'
      },
      {
        region : 'us-east-1'
       });
      
      AWS.config.credentials = creds;
      await refreshCredentials();
      //console.log({token})
      console.log({creds})*/
     const accessToken = await getToken();
    
     const requestInfo = {
        headers : {
           Authorization: `Bearer ${accessToken}`
       
        }
      }
      
      const data = await API.get('authtest','/test',requestInfo)
     console.log({data})
  }
 /*async function refreshCredentials(){
    return new Promise((resolve, reject)=>{
        (AWS.config.credentials).refresh(err =>{
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
   }*/
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={callApi}>Call API</button><br/><br/>
        <button onClick={()=>Auth.signOut()}>Sign Out</button>
      </header>
    </div>
  );
}

export default App;
