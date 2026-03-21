// import mongoose from "mongoose"

// const connectDb=async ()=>{
//     try {
//         await mongoose.connect(process.env.MONGODB_URL)
//         console.log("db connected")
//     } catch (error) {
//         console.log(error)
//     }
// }

// export default connectDb



import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log("db connected to:", conn.connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDb;