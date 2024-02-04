const express= require("express");
const readline=require("readline");
const path=require("path");
const bodyparser=require("body-parser");
const fs=require("fs");
const ytdl=require("ytdl-core");

const app=express();

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

const port=4900;
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})
app.post("/",(req,res)=>{
    const videolink=req.body.link; 
    download(videolink,res)
})

async function download(url,res){
    let n=Math.floor(Math.random()*1000) //Math.random(0-9)
    let videoId=ytdl.getURLVideoID(url);
    let video=ytdl(url);
    let output=path.resolve(__dirname,"video"+n+".mp4");

    //get info
    ytdl.getBasicInfo(videoId).then(info=>{
        console.log("title",info.videoDetails.title);
    })

    video.pipe(fs.createWriteStream(info.videoDetails.title+".mp4"));
    video.once("response",()=>{
        starttime=Date.now();

    })
    video.on("progress",(chunkLength,downloaded,total)=>{
        const percent = downloaded/total;
        const downloadedMinutes= (Date.now()-starttime)/1000/60;
        const EstimatedDownloadTime=(downloadedMinutes / percent) - downloadedMinutes;
        readline.cursorTo(process.stdout,0);
        process.stdout.write(`${(percent*100).toFixed(2)}% downloaded`);
        process.stdout.write(`${(downloaded/1024/1024).toFixed(2)}MB of ${(total/1024/1024).toFixed(2)}MB\n`);
        process.stdout.write(`running for : ${(downloadedMinutes.toFixed(2))}minutes `);
        process.stdout.write(`,estimate time left: ${EstimatedDownloadTime.toFixed(2)}minutes `);
        readline.moveCursor(process.stdout,0,-1);

    })
    video.on('end',()=>{
        process.stdout.write("\n\n");
        console.log("downloaded complete");
        res.sendFile(__dirname+"/index.html");
    })
    console.log()
}

app.listen(port,()=>{
    console.log("ser lis...",port)
})


// app.use(bodyparser.urlencoded({ extended: false }));
// This line configures the Express application (app) to use the body-parser middleware for parsing URL-encoded data.
// body-parser is a middleware that extracts the entire body portion of an incoming request stream and exposes it on req.body.
// urlencoded({ extended: false }) is an option that determines how the data is parsed. When set to false, the querystring library is used to parse the URL-encoded data.

// app.use(bodyparser.json());
// This line configures the Express application to use the body-parser middleware for parsing JSON data.
// It parses the JSON data in the body of the incoming requests and makes it available on req.body.