import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews //Declare a variable to hold the reviews collection

export default class ReviewsDAO {
    //Static async method to initialize the database connection
    static async injectDB(conn) {
        if (reviews) {//If the reviews collection is already initialized
            return //Exit the method early
        }
        try {
            //Fetch and assign the 'reviews' collection from the database
            reviews = await
                //Get the 'reviews' collection from the database
                conn.db(process.env.MOVIEREVIEWS_NS).collection('reviews')
        }
        catch (e) {//Catch any errors that occur
            //Log the error message
            console.error(`unable to establish connection handle in reviewDAO: ${e}`)
        }
    }

    static async addReview(movieId, user, review, date) { // Static async method to add a review
        try {
            const reviewDoc = {//Create a review document
                name: user.name,
                user_id: user._id,
                date: date,
                review: review,
                movie_id: new ObjectId(movieId) //Convert movieId to ObjectId
            }
            return await reviews.insertOne(reviewDoc)//Add reviewDoc to the reviews collection in the database
        }
        catch (e) {//Catch any errors
            console.error(`unable to post review: ${e}`)//Log the error
            return { error: e }//Return an error object
        }
    }

    static async updateReview(reviewId, userId, review, date) {//Static async method to update a review
        try {
            const updateResponse = await reviews.updateOne(//Perform the update operation
                { user_id: userId, _id: new ObjectId(reviewId) },//Find the review by userId and reviewId
                { $set: { review: review, date: date } }//Update fields with new review and date
            )
            return updateResponse//Return the result of the update operation
        }
        catch (e) {
            console.error(`unable to update review: ${e}`)
            return { error: e }
        }
    }

    static async deleteReview(reviewId, userId) {//Static async method to delete a review
        try {
            const deleteResponse = await reviews.deleteOne({ //Delete a review document
                _id: new ObjectId(reviewId), //Find review by ID
                user_id: userId, //Find user by user_id
            })
            return deleteResponse//Return the result of the delete operation
        }
        catch (e) {
            console.error(`unable to delete review: ${e}`)
            return { error: e }
        }
    }
}