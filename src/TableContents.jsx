import Image from "./Image";
import CaughtDropdown from "./CaughtDropdown";
import TypeDropdown from "./TypeDropdown";

const TableContents = ({ handleDropdown }) => {

    return (
        <>
            <tr key="0">
                <th>Picture</th>
                <th>Pokemon #</th>
                <th>Pokemon Name</th>
                <th>Area</th>
                <th><TypeDropdown handleDropdown={handleDropdown} /></th>
                <th><CaughtDropdown handleDropdown={handleDropdown}/></th>
            </tr>
        </>
    )

}

export default TableContents