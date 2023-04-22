

const CaughtDropdown = ({ handleDropdown }) => {
    
        return (
            <div>
                <select onChange={(e) => handleDropdown(e)} name="caught">
                    <option key="isCaught" value='all'>Caught</option>
                    <option key="caught" value="1">Yes</option>
                    <option key="uncaught" value="0">No</option>
                </select>
            </div>
        )

}

export default CaughtDropdown