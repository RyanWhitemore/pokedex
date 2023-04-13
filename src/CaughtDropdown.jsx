

const CaughtDropdown = ({ handleDropdown }) => {
    
        return (
            <div>
                <select onChange={(e) => handleDropdown(e)} name="caught">
                    <option key="isCaught" value=''>Caught</option>
                    <option key="caught" value="caught">Yes</option>
                    <option key="uncaught" value="uncaught">No</option>
                </select>
            </div>
        )

}

export default CaughtDropdown