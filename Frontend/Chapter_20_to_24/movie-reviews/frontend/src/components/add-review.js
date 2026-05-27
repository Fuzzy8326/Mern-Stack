import React, { useState } from 'react'
import MovieDataService from "../services/movies"
import { Link} from "react-router-dom"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddReview = props => {//functional component called AddReview that takes props as an argument

    let editing = false//Track if editing an existing review
    let initialReviewState = ""//Initialize a variable to store

    // Check if there's a currentReview in the location state
    if (props.location.state && props.location.state.currentReview) {
        editing = true
        initialReviewState = props.location.state.currentReview.review
        // Initialize review state with the current review's text
    }

    const [review, setReview] = useState(initialReviewState)//Use the useState hook to create a state variable for the review, initialized to an empty string
    const [submitted, setSubmitted] = useState(false)//State to track review submission status

    const onChangeReview = e => {//Function to handle changes in the review input field
        const review = e.target.value //Get the current value of the input field
        setReview(review);//Update the review state with the new value
    }

    const saveReview = () => {//Function to save the review
        var data = { //Create an object to hold the review data
            review: review,
            name: props.user.name,
            user_id: props.user.id,
            movie_id: props.match.params.id // get movie id direct from url
        }

        if (editing) {
            // get existing review id
            data.review_id = props.location.state.currentReview._id
            MovieDataService.updateReview(data)//update the existing review
                .then(response => {
                    setSubmitted(true);//Update submission 
                    console.log(response.data)//Log the response
                })
                .catch(e => {
                    console.log(e);
                })
        }
        else {
            MovieDataService.createReview(data) //Call the MovieDataService to create the review
                .then(response => {
                    setSubmitted(true)//Update submission status on success
                })
                .catch(e => {
                    console.log(e);
                })
            }
        }
        return ( //Return the JSX for rendering the component 
            <div>
                {submitted ? (//Check if the review has been submitted
                    <div>
                        <h4>Review submitted successfully</h4>
                        {/* Link back to the movie page */}
                        <Link to={"/movies/" + props.match.params.id}>
                            Back to Movie
                        </Link>
                    </div>
                ) : (//If not submitted, show the review form
                    <Form>
                        <Form.Group>
                            {/* Conditional label for editing or creating */}
                            <Form.Label>{editing ? "Edit" : "Create"} Review</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={review}
                                onChange={onChangeReview}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={saveReview}>
                            Submit
                        </Button>
                    </Form>
                )}
            </div>
        )
    }
    export default AddReview;
