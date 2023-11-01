import mongoose from "mongoose";

const mongoDataBase = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log("Database launched")
    } catch (err) {
        console.log(err);
    }
}

export default mongoDataBase;