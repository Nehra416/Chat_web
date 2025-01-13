import mongoose from "mongoose";

const DbConnection = async () => {
    await mongoose.connect(process.env.DATABASE_URL)
        .then(() => console.log('Mongodb connected successfully'))
        .catch((error) => console.log('Mongodb connection error : ' + error.message));
}

export default DbConnection;