import axios from 'axios'

const AreaDropdown = (props) => {

    const areaList = ["south province", "east province", "west province", 
        "north province", "tagtree thicket", "casseroya lake", "the pokemon league",
        "glaseado mountain", "great crater of paldea", "asado desert", 
        "east paldean sea",  "west paldean sea", "south paldean sea"
    ]
 

    const handleAreaDropdown = async (e) => {
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
            <select onChange={e => {e.preventDefault(); handleAreaDropdown(e)}} name="area" id="area">
                <option key="default" value="" defaultValue={""}>Area</option>
                <option key="all" value="">All</option>
                <option key="violet" value="violet">Violet Exclusive</option>
                <option key="scarlet" value="scarlet">Scarlet Exclusive</option>
                {areaList.map((item) => {
                    return (
                        <option key={item} value={item}>{item}</option>
                    )
                })}
             </select>
        </div>
    )
}

export default AreaDropdown