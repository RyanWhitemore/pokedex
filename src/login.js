import { react, useState, useEffect } from 'react'




function InputFields() {
    return(
        <>
            <div>
                <input type='text'></input><br/>
                <input type='text'></input>
            </div>
       </>
    )
}


function LoginButton() {


    return (
        <div>
            <button>Login</button>
        </div>
    );
}

function RegisterButton() {
    return (
        <div>
            <button>Register</button>
        </div>
    )
}

export {LoginButton, RegisterButton, InputFields}