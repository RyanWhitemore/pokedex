import axios from "axios";
import React, { useEffect, useState } from 'react'

const Image = (props) => {

        const path = "http://localhost:5000" 

        const [image, setImages] = useState([])
        const [loading, setLoading] = useState(false)

        const getImage = async () => {
            const result = await axios.get(path + "/picUrls/" + props.id)
            for (const url of result.data) {
                setImages(oldArray => [...oldArray, url.image])
                
            }
            setLoading(false)
        }

        useEffect(() => {
            getImage()
        }, [])

        if (loading) {
            return <>
                <h1>Loading</h1>
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
