export default {
  id: "antridoc_data",
  url: process.env.DB_URL || "mongodb://localhost:27017/antridoc_data",
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};
