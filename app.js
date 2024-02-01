const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port =  process.env.PORT || 3030;

var txts;
var resend;
var kindOfQuery = "";
var membCount = 0;
var contentIndex;

const {MongoClient} = require('mongodb');

// We are using our packages here
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 extended: true})); 
app.use(cors())

//You can use this to check if your server is working
app.get('/SpeekersCorner', (req, res)=>{
	  kindOfQuery = 'request';
	  resend = res;
	  requestGet().catch(console.error);
})

//Route that handles MeinungsSpiegel logic
app.post('/SpeekersCorner', (req, res) =>{
	kindOfQuery = 'deploy';
	const data = req.body;
	res.status(200).json({"Message": "Data posted", data});
	txts = data.toString().split(",");
    console.log(txts);
	requestPost().catch(console.error);
})

//Start your server on a specified port
app.listen(port, ()=>{
    console.log(`Server is runing on port ${port}`)
})

async function requestGet() {
	const uri = "mongodb+srv://wh:admin01@cluster0.kmwrpfb.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        var collection;
        try {
		 await client.connect(err => {
                    if(err)
		       console.log('No successfully connection to server');
                    else
                       console.log('Successfully connected to server');
                 });
                 collection = await client.db("SpeekersCorner").collection("ActualInsanityGaza");
                 read_write_Comments(collection);
                    
        } catch (e) {
		   console.error(e);
        }
        finally {
                   try {
                       await client.close();
                    } catch (e) {} 
        }
}

async function requestPost() {
	const uri = "mongodb+srv://wh:admin01@cluster0.kmwrpfb.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const collection = client.db("SpeekersCorner").collection("ActualInsanityGaza");;
        try {
                await client.connect((err) => {
		  if (err) {
		    console.log('Connection to server wasnt successfull');
		  } else {
		    console.log('Connected successfully to server');

                    read_write_Comments (collection)
		  }
		})
                    
        } catch (e) {
		   console.error(e);
        } finally {
                   try {
                        await client.close();
                   } catch (e) {}
        }
        
                   
}

function createDocument(id, arr) {
        
        var docu = {
                    _id: id,
                    browserid: arr[0],
                    lenguage: arr[1],
                    deleteDate: arr[2],
                    comment: arr[3];
           }
    return docu;
}

function read_write_Comments (collection) {
    
    collection
       .countDocuments({})
       .then(
	    (myCount) =>{
	             membCount = myCount,
		         if(kindOfQuery == 'deploy')
                       await col.insertOne(createDocument((membCount +1), txts));
                 else if(kindOfQuery == 'request') {
                         await collection
                 	       	  .find({}, {comment:1, _id:0});
                 	       	  .then(
                 	       	       res => contentIndex = res)
                 	       	  );
                         contentIndex[contentIndex.length] = ""+membCount;
                         resend.status(200).json({"Message": "requestedIndex",  contentIndex});
                              try {
                                   await client.close();
                              } catch (e) {}
                      }
			 }
	   );
}

