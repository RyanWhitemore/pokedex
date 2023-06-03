
const AreaDropdown = (props) => {

    const areaList = ["south province", "east province", "west province", 
        "north province", "tagtree thicket", "casseroya lake", "the pokemon league",
        "glaseado mountain", "great crater of paldea", "asado desert", 
        "east paldean sea",  "west paldean sea", "south paldean sea",
        "evolves"
    ]
 

    return (
        <div>
            <select onChange={e => {e.preventDefault(); props.handleDropdown(e)}} 
            name="area" id="area" value={props.areaSelected}>
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