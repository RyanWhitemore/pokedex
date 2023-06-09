import { useState, useEffect } from "react";
import axios from 'axios'
import {useNavigate} from "react-router-dom"




const Profile = () => {
    const navigate = useNavigate()
    const path = "https://pokedex-project.com/api"

    const user = JSON.parse(localStorage.getItem("user"))
    const [ file, setFile ] = useState(null);
    const [ imageUrl, setImageUrl ] = useState(null)


    const fileUpload = async (e) => {
        const fileToConvert = e.target.files[0]
        const base64 = await convertToBase64(fileToConvert)
        setFile(base64)
    }

    const convertToBase64 = (file) => {
        return new Promise( resolve => { 
            const reader = new FileReader();

            reader.readAsDataURL(file)
            reader.onload = () => {
                resolve(reader.result)
        }})
    }

    const handleSubmission = async () => {
        if (!file) {
            return;
        }
        const { Location } = await axios.put(path + "/profilePic", {
            userID: user.user_id,
            file: file
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Credentials": true
            }
        })

        setImageUrl(Location);
        getProfilePic();
    }

    const getProfilePic = async () => {
        const profilePic = await axios.get(
            path + `/profilePic/`
            + user.user_id)
        if (!profilePic.data[0].profile_pic) {
            return setImageUrl("./profileDefault.png")
        } else {
            setImageUrl(profilePic.data[0].profile_pic)
        }
    }

    useEffect( () => {
        getProfilePic()
    },
    )


    return (
        <>
            <div className="profile-page">
                <img alt="" src={imageUrl} height="100px" width="100px"/>
                <p>Profile</p>
                <input type="file" name="file" onChange={fileUpload}/>
                <div>
                    <button onClick={handleSubmission}>Submit</button>
                </div>
            </div>
            <div>
                <button onClick={(e) => {e.preventDefault(); navigate('/home')}}>Back</button>
            </div>
        </>
    )
}

export {Profile}
