import React from 'react'
import { Switch, Route, Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

import AddReview from "./components/add-review"
import MoviesList from "./components/movies-list"
import Movie from "./components/movie"
import Login from "./components/login"

function App() {
  const [user, setUser] = React.useState(null)//Initialize a state variable 'user' with a default value of null

  async function login(user = null) {//function 'login' that takes a user parameter(default user to null)
    setUser(user)
  }
  
  async function logout() {//function 'logout' to clear the user state
    setUser(null)//Log out by resetting the user state to null
  }

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Movie Reviews</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link>
              <Link to={"/movies"}>Movies</Link>
            </Nav.Link>
            <Nav.Link>
              {user ? (
                <a onClick={logout}>Logout User</a>
              ) : (
                <Link to={"/login"}>Login</Link>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Switch>
        <Route exact path={["/", "/movies"]} component={MoviesList}>
        </Route>
        <Route path="/movies/:id/review" render={(props) =>
          <AddReview {...props} user={user} />
        }>
        </Route>
        <Route path="/movies/:id/" render={(props) =>
          <Movie {...props} user={user} />
        }>
        </Route>
        <Route path="/login" render={(props) =>
          <Login {...props} login={login} />
        }>
        </Route>
      </Switch>
    </div>
  );
}
export default App;