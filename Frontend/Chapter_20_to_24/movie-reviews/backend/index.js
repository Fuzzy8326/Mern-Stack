import app from './server.js'
import mongodb from "mongodb"
import dotenv from "dotenv"
import MoviesDAO from './dao/moviesDAO.js'
import ReviewsDAO from './dao/reviewsDAO.js'


//This functions access the database (mongodb)
async function main() {
    dotenv.config() //dotenv accesses environmental variables

    const client = new mongodb.MongoClient(
        process.env.MOVIEREVIEWS_DB_URI
    )
    //use port 8000 if we can't access port from .env
    const port = process.env.PORT || 8000
    try {
        await client.connect()// Connect to the MongoDB cluster
        await MoviesDAO.injectDB(client) // Set up MoviesDAO with the connected MongoDB client
        await ReviewsDAO.injectDB(client)

        app.listen(port, () => {
            console.log('server is running on port:' + port);
        })
    } catch (e) {
        console.error(e);
        process.exit(1)
    }
}
main().catch(console.error);
