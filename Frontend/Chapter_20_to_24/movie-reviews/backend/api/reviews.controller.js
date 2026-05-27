import ReviewsDAO from '../dao/reviewsDAO.js'

export default class ReviewsController {
    static async apiPostReview(req, res, next) {//Static async method to handle posting reviews
        try { //try block to handle any errors 
            const movieId = req.body.movie_id //Get movie_id from request body & assign to movieId
            const review = req.body.review
            const userInfo = { //storing information about the user
                name: req.body.name,
                _id: req.body.user_id
            }

            const date = new Date()//Create a new date object
            const ReviewResponse = await ReviewsDAO.addReview(//Call addReview and wait for response, storing it in ReviewResponse
                //passing them as arguments to addReview method
                movieId,
                userInfo,
                review,
                date
            )
            res.json({ status: "success " }) //Sends a JSON response 
        } catch (e) {//catch block to handle any errors
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id
            const review = req.body.review
            const date = new Date()
            const ReviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.body.user_id,
                review,
                date
            )
            //Extract error from ReviewResponse
            var { error } = ReviewResponse;

            // If there's an error, send it in the response
            if (error) {
                res.status.json({ error })
            }

            // If no reviews were modified, throw an error
            if (ReviewResponse.modifiedCount === 0) {
                throw new Error("unable to update review. User may not be original poster")
            }
            res.json({ status: "success " })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //Static async method to handle posting reviews
    static async apiDeleteReview(req, res, next) {
        try {//try block to handle any errors 
            //Get review_id from request body & assign to reviewId
            const reviewId = req.body.review_id
            const userId = req.body.user_id
            //Call deleteReview and wait for response, storing it in ReviewResponse
            const ReviewResponse = await ReviewsDAO.deleteReview(
             //pass arguments to deleteReview method   
                reviewId,
                userId,
            )

            res.json({ status: "success " })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}