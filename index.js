const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port =  process.env.PORT || 3030;

var txts;
var resend;
var kindOfQuery = "";
var commentCount = 0;
var contentIndex;

const {MongoClient} = require('mongodb');

// We are using our packages here
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 extended: true})); 
app.use(cors())

//Route that handles MeinungsSpiegel logic
app.post('/SpeekersCorner', (req, res) =>{
	const data = req.body;
    resend = res;
	txts = data.toString().split(",");
    kindOfQuery = txts[0];
    //console.log("-->-"+txts);
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

        var str = "", comma = ","
        for(var x=4;x<arr.length;x++) {
            if(x == arr.length -1) comma = "";

            str = str+arr[x]+comma;
        }
        var docu = {
                    _id: id,
                    browserid: arr[1],
                    lenguage: arr[2],
                    deleteDate: Number(arr[3]),
                    comment: str
           }
    return docu;
}

function read_write_Comments (collection) {
    
    collection
       .countDocuments({})
       .then(
	    (myCount) =>{
	             commentCount = myCount,
		         dbEntrace(collection)
		         }
	   );
}
async function dbEntrace (collection) {

    if(kindOfQuery == 'deploy') {
       await collection.insertOne(createDocument((commentCount +1), txts));
       resend.status(200).json({body: JSON.stringify("commentsCount: " + (commentCount +1))});
    }
    else if(kindOfQuery == 'request') {
       var transfer ="";;
       var list;
       try {
          await collection
                  .deleteMany({ deleteDate: txts[3] });
          await collection
                .find({lenguage: txts[2]}, {comment:1, _id:0} )
                .forEach(function(records){
                          transfer =  transfer + "------------>"+ records.comment;
                 })

           resend.status(200).json({body: JSON.stringify(transfer)});
         } catch (error) {
           resend.status(400).json({ error: error });
         }
    }

}

