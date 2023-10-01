const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fgokub5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  try {
    const courseCollection = client.db("BestCourse").collection("course");
    const addUserCollection = client.db("BestCourse").collection("user");
    const addSelectCollection = client.db("BestCourse").collection("SelectCourses");


    app.get("/course", async (req, res) => {
      const result = await courseCollection.find().toArray();
      res.send(result);
    });
    


    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const result = await addUserCollection.findOne({ email: email })
      res.send(result)
    });

    app.get('/user', async (req, res) => {
      const result = await addUserCollection.find().toArray()
      res.send(result)
    })

    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const updatedDoc = {
        $set: user,
      };
      const result = await addUserCollection.updateOne(
        query,
        updatedDoc,
        options
      );
      res.send(result);
    });


    app.post('/selected', async (req, res) => {
      const body = req.body
      const result = await addSelectCollection.insertOne(body)
      res.send(result)
    });


    
    app.get('/select/:email', async (req, res) => {
      const email = req.params.email
      const query = { userEmail: email }
      const result = await addSelectCollection.find(query).toArray()
      res.send(result)
    })


    app.get('/select', async (req, res) => {
      const result = await addSelectCollection.find().toArray()
      res.send(result)
    })


    // app.get(`/course/:email`, async (req, res) => {
    //   try {
    //     const email = req.params.email;
    //     const sortBy = req.query.sortBy;

    //     let sortOptions = {};
    //     if (sortBy === 'lower') {
    //       sortOptions = { enrolled_number: 1 };
    //     }

    //     else if (sortBy === 'higher') {
    //       sortOptions = { enrolled_number: -1 };
    //     }
    //     const result = await courseCollection
    //       .find({ sellerEmail: email })
    //       .sort(sortOptions)
    //       .toArray();
    //     res.send(result)
    //   } catch (error) {
    //     console.error('Error retrieving toys:', error);
    //     res.status(500).send('Internal Server Error')
    //   }
    // })

    // app.get('/searchText', async (req, res) => {
    //   const searchText = req?.query?.search;
    //   const result = await courseCollection.find({
    //     name:{$regex:searchText, $options:"i"}
    //   }).toArray()
    //   res.send(result)
    // })
  

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //     await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Best courses server is running");
});

app.listen(port, () => {
  console.log(`chose best course port on ${port}`);
});
