import type { IncomingMessage, ServerResponse } from "http";
import { readProduct } from "../service/product.service";

export const productController = (
    req : IncomingMessage, 
    res : ServerResponse
)=>{
    const url = req.url;
    const method = req.method;

     if(url === "/products" && method === "GET"){

        // const products = [
        //     {
        //         id :  1,
        //         name : "Product-1",
        //     },
        // ];
        const products = readProduct();

        res.writeHead(200,{"content-type" : "application/json"});
        res.end(
            JSON.stringify({
            message: "Product retrived successfully!",
            data: products
        }),
    );
     }
};