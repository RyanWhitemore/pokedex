

const CaughtDropdown = ({ handleDropdown, caughtSelected }) => {
    
        return (
            <div>
                <select onChange={(e) => handleDropdown(e)} name="caught"
                id={"caught-dropdown"} className="dropdown" value={caughtSelected}>
                    <option key="isCaught" value='all'>Caught</option>
                    <option key="caught" value="1">Yes</option>
                    <option key="uncaught" value="0">No</option>
                </select>
            </div>
        )

}

export default CaughtDropdown