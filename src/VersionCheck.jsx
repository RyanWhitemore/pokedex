import axios from 'axios'
import { useState, useEffect } from 'react'

const VersionCheck = ({setPokemon, getPokemon, pokemon}) => {
    
    const [checkedViolet, setCheckedViolet] = useState(false)
    const [checkedScarlet, setCheckedScarlet] = useState(false)
    const [checkedAll, setCheckedAll] = useState(false)

    const checkBox = () => {
        const version = localStorage.getItem("version")
        if (version === "violet") {
            setCheckedViolet(true)
        } else if (version === "scarlet") {
            setCheckedScarlet(true)
        } else {
            setCheckedAll(true)
        }
    }

    
    useEffect(() => {
        checkBox()
    })
    
    const handleCheck = async (e) => {
        
        if (e.target.checked) {
            if (e.target.value === "scarlet") {
                localStorage.setItem("version", "scarlet")
                setCheckedScarlet(true)
                setCheckedViolet(false)
                setCheckedAll(false)
            }
            if (e.target.value === "violet") {
                localStorage.setItem("version", "violet")
                setCheckedViolet(true)
                setCheckedScarlet(false)
                setCheckedAll(false)
            }
            if (e.target.value === "all") {
                localStorage.setItem("version", "all")
                setCheckedAll(true)
                setCheckedScarlet(false)
                setCheckedViolet(false)
            }

            axios.put("http://localhost:5000/version/" +
            JSON.parse(localStorage.getItem("user")).user_id + "/" 
            + localStorage.getItem("version"))

            const results = await axios.get("http://localhost:5000/version/sort/" +
                JSON.parse(localStorage.getItem("user")).user_id + "/" +
                e.target.value)
            setPokemon(results.data)
        } else {
            return getPokemon()
        }
    }

    return (
        <div className='version-checks'>
            <h3>Version</h3>
            <input type="checkbox"
            checked={checkedScarlet} 
            value="scarlet"
            onChange={(e) => {e.preventDefault(); 
                handleCheck(e)}}/>Scarlet
            <input type="checkbox" 
            checked={checkedViolet}
            value="violet"
            onChange={(e) => {e.preventDefault(); 
                handleCheck(e)}}/>Violet
            <input checked={checkedAll} type="checkbox"
            value="all"
            onChange={(e) => {e.preventDefault(); 
                handleCheck(e)}}/>All
        </div>
    ) 
}

export default VersionCheck