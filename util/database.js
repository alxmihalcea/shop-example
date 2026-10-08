require("dotenv").config();
const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const mongoDbPassword = encodeURIComponent(process.env.DB_PASSWORD);

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://alex:${mongoDbPassword}@cluster0.gddgznl.mongodb.net/shop?appName=Cluster0`,
  )
    .then((client) => {
      _db = client.db();
      callback();
      console.log("CONNECTED!!!");
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No data base found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
