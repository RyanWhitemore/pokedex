const Search = ({ submitSearch, setSearch }) => {
    return (
        <form onSubmit={(e) => {e.preventDefault(); submitSearch(e)}}>
        <input className='search-bar' 
        type="text" 
        onChange={(e) => {e.preventDefault(); setSearch(e.target.value)}} 
        placeholder='search'/>
        <input id="search-image" 
        type="image" 
        src="test.png" 
        alt='detective picachu' 
        width="30px" 
        height="30px"/>
    </form>
    )
}

export default Search