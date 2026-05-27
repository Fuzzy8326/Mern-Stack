import React, { useState, useEffect } from 'react'
import MovieDataService from '../services/movies'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import { Container, Row, Col, Image, Button } from 'react-bootstrap'
import moment from 'moment'


const Movie = props => {

    const [movie, setMovie] = useState({//State to store movie details
        id: null,
        title: "",
        rated: "",
        reviews: []
    })

    const getMovie = id => {//Function to fetch a movie by its ID
        MovieDataService.get(id)//Call the service method to get the movie
            .then(response => {//Handle the successful response
                setMovie(response.data)//Update the movie state with the retrieved data
                console.log(response.data)//Log the response
            })
            .catch(e => {
                console.log(e)
            })
    }

    useEffect(() => {//useEffect to run side effects
        getMovie(props.match.params.id)//Call getMovie with the ID from URL parameters
    }, [props.match.params.id])//Run getMovie when the ID changes

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Image src={movie.poster + "/100px250"} fluid />
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header as="h5">{movie.title}</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {movie.plot}
                                </Card.Text>
                                {props.user &&
                                    <Link to={"/movies/" + props.match.params.id + "/review"}>
                                        Add Review
                                    </Link>}
                            </Card.Body>
                        </Card>
                        <br></br>
                        <h2>Reviews</h2>
                        <br></br>
                        {movie.reviews.map((review, index) => {//Loop through each review in the movie's reviews
                            return (
                                <Card key={index}//Card component for displaying review details
                                >
                                    <Card.Body>
                                        <h5>{review.name + " reviewed on "} {moment(review.date).format("Do MMMM YYYY")}</h5>
                                        <p>{review.review}</p> {/* Display the review text */}
                                        {props.user && props.user.id === review.user_id &&//Check if the current user is the reviewer
                                            <Row>
                                                <Col><Link to={{//Link to edit the review
                                                    pathname: "/movies/" +
                                                        props.match.params.id + //Use the movie ID from URL
                                                        "/review",
                                                    state: { currentReview: review }//Pass the current review to edit
                                                }}>Edit</Link>
                                                </Col>
                                                <Col><Button variant="link">Delete</Button></Col>
                                            </Row>
                                        }
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}


export default Movie;