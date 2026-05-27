import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let movies;

export default class MoviesDAO {
    static async injectDB(conn) {
        if (movies) {
            return
        }
        try {
            movies = await conn.db(process.env.MOVIEREVIEWS_NS)
                .collection('movies')
        }
        catch (e) {
            console.error(`unable to connect in MoviesDAO: ${e}`)
        }
    }

    static async getMovies({// default filter
        filters = null,
        page = 0,
        moviesPerPage = 20, // will only get 20 movies at once
    } = {}) //syntax provides default values for function parameters and handles cases where arguments are missing or undefined.
    {
        let query = {};
        // Check if the 'filters' object is provided and not null or undefined
        if (filters) {
            //If 'filters' contains a 'title' property, create a query to search for movies with that title
            if ("title" in filters) {
                query = { $text: { $search: filters['title'] } }
                //If 'filters' does not contain 'title' but contains a 'rated' property, create a query to match movies with that rating
            } else if ("rated" in filters) {
                query = { rated: { $eq: filters['rated'] } }
            }
        }

        let cursor;
        try {
            cursor = await movies
                .find(query)
                .limit(moviesPerPage)
                .skip(moviesPerPage * page)
            const moviesList = await cursor.toArray()
            const totalNumMovies = await movies.countDocuments(query)
            return { moviesList, totalNumMovies }
        }
        catch (e) {
            // Log an error message to the console, including the error details
            console.error(`Unable to issue find command, ${e}`)
            // Return an object with empty movie list and zero total number of movies
            return { moviesList: [], totalNumMovies: 0 }
        }
    }

    static async getMovieById(id) {//Static async method to get a movie by its ID
        try {
            return await movies.aggregate([//Run a series of data processing steps on the movies collection.
                {
                    $match: {//Find the movie document with the specified ID.
                        _id: new ObjectId(id),
                    },
                },
                {
                    $lookup:// Join the movie document with related reviews from the reviews collection.
                    {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
                        as: 'reviews',
                    }
                }
            ]).next()//Execute the aggregation and get the first result
        }
        catch (e) {
            console.error(`something went wrong in getMovieById: ${e}`)
            throw e
        }
    }

    static async getRatings() {//Static async method to get  movie ratings
        try {
            // Fetch values of the rated field from the movies collection
           const ratings = await movies.distinct("rated")
            return ratings//Return the list of ratings
        }
        catch (e) {
            console.error(`unable to get ratings, $(e)`)
            return []//Return the empty array 
        }
    }
}

