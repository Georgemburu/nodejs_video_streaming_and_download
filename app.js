const http = require('http'),
    fs = require('fs'),
    path = require('path'),
    port = process.env.PORT || 3000;


function handleRequests(req,res){
    console.log(req.method,req.url)
    let range = req.headers.range
    console.log(req.headers.range)
    if(req.url=='/'){
        fs.createReadStream('./index.html').pipe(res)
    }else if(req.url=='/video'){
        let path = './video.mp4'
        let fileSize = fs.statSync('./video.mp4').size
        if(!range){
            const parts = range.replace(/bytes=/,'').split("-")|| [10,133]
            const start = parseInt(parts[0],10)
            const end = parts[1]?parseInt(parts[1],10):fileSize-1
            const chunksize = (end-start)+1;
            const file = fs.createReadStream(path,{start,end})
            const head = {
                'Content-Range':`bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges':'bytes',
                'Content-Length':chunksize,
                'Content-Type':'video/mp4',
            }
            console.log(head)
            res.writeHead(206,head);
            file.pipe(res)
        }else {
            const head = {
                "Content-Length":fileSize,
                'Content-Type':'video/mp4',
            }
            res.writeHead(200,head)
            fs.createReadStream('./video.mp4').pipe(res)

        }
    }else if(req.url=='/download'){
        // res.end(fs.readFileSync('./video.mp4','binary'))
        // console.log(res)
        fs.createReadStream('./video.mp4').pipe(res)
        // fs.re
    }
}





const server = http.createServer(handleRequests)
server.listen(port)
console.log('server running on port ',port)