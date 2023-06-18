const Search = ({ submitSearch, search, setSearch }) => {

    
    return (
        <div className="search-div">
            <form onSubmit={(e) => {e.preventDefault(); submitSearch(e)}}>
                <input className='search-bar' 
                type="text" 
                onChange={(e) => {e.preventDefault(); setSearch(e.target.value)}}
                value={search} 
                placeholder='search'/>
                <input id="search-image" 
                type="image" 
                src="https://pokedexpictures.s3.us-east-2.amazonaws.com/defaults/test.png" 
                alt='detective picachu' 
                width="30px" 
                height="30px"/>
            </form>
        </div>
    )
}

export default Search