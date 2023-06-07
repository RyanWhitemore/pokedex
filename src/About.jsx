import { Link } from "react-router-dom"


const AboutPage = () => {
    

    return (
        <>
            <div id={"About-div"}>
                <h1 id={"About-header"}>About</h1>
                <h2>Welcome to my first website</h2>
                <p1>This website was created as a project for me to learn react
                    and express. the idea behind the project was to make a webapp
                    to help track the pokemon you have caught in the pokemon scarlet
                    and violet games. the functionalities that I have implemented so 
                    far include, a register and login feature with password hashing 
                    so you can save the pokemon you have caught to your account. Also
                    I have implemented a sorting of the pokemon table by region, type,
                    and wether or not you have caught the pokemon. Another function 
                    of the website is a basic search where you can search for the name
                    of a pokemon and the row of the table for that pokemon is returned.
                    The header of the page when clicked will reset the sort dropdown
                    boxes. I added a profile page where the only functionality at this
                    point is a profile photo upload.
                </p1> <br></br>
                <Link id={"back-button"}to="/">Back</Link>
            </div>
        </>
    )
}

export default AboutPage