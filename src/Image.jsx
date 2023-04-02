import axios from "axios";
import React, { useEffect, useState } from 'react'

const Image = (props) => {
        const [image, setImage] = useState([])
        const [loading, setLoading] = useState(true)

        const getImage = async () => {
            const result = await axios.get("http://localhost:5000/picUrls/" + props.id)
            for (const url of result.data) {
                setImage(oldArray => [...oldArray, url.image])
                
            }
            setLoading(false)
        }

        useEffect(() => {
            getImage()
        }, [])

        if (loading) {
            return <>
                <h1></h1>
            </>
        } else {
            
            const renderImages = image.map(url => {
                return <img key={url} 
                        alt={props.name}
                        src={url}
                        height="75"
                        width="75"
                        />
            })
            return <div>
                {renderImages}
            </div>
        }
        

    }

    
export default Image