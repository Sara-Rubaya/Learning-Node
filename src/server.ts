import { createServer, IncomingMessage, Server, ServerResponse } from "http";


const server : Server = createServer((req : IncomingMessage, res: ServerResponse) =>{
    // console.log(req.url); =>'/', '/user', '/product'....
    // console.log(req.method); => "GET", "POST", "Delete"...

    const url = req.url
    const method = req.method

    if(url === '/' && method === "GET"){
        // console.log("This is Root route");
        res.writeHead(200,{"content-type" : "application/json"})
        res.end(JSON.stringify({message: "This is Root route"}));
    } else if(url?.startsWith("/products")){
        res.writeHead(200,{"content-type" : "application/json"})
        res.end(JSON.stringify({message: "This is product route"}));
    }else{
         res.writeHead(404,{"content-type" : "application/json"})
        res.end(JSON.stringify({message: "Route not found!"}));
    }
 },
);

server.listen(5000,()=>{
    console.log("Server is running on the port 5000");
});