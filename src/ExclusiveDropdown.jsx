import axios from 'axios'

const ExclusiveDropdown = (props) => {

    const handleExclusiveDropdown = async (e) => {
        if (e.target.value === "") {
            return props.getPokemon()
        }
        try {
            const results = await axios.get("http://localhost:5000/version/" +
        e.target.value + '/' +
        JSON.parse(localStorage.getItem("user")).user_id)
        console.log(results.data)
        props.setPokemon(results.data)
        } catch (err) {
            return
        }
        

    }


    return (
        <div>
            <select onChange={e => {e.preventDefault(); handleExclusiveDropdown(e)}} name="area" id="area">
                <option key="default" value="" defaultValue={""}>Area</option>
                <option key="all" value="">All</option>
                <option key="violet" value="violet">Violet Exclusive</option>
                <option key="scarlet" value="scarlet">Scarlet Exclusive</option>
             </select>
        </div>
    )
}

export default ExclusiveDropdown