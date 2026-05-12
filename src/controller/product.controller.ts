import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProducts } from "../types/product.types";
import { parseBody } from "../utility/parseBody";


export const productController = async(
    req : IncomingMessage, 
    res : ServerResponse
)=>{
    // console.log("Request",req);
    const url = req.url;
    const method = req.method;

    //  /products =>c/products/1  => ['', 'products', '1']

    const urlParts = url?.split("/");
    // console.log(urlParts);
    const id = 
    urlParts && urlParts[1] === "products"  ?  Number(urlParts[2]) : null;
    console.log("This is the actual id : ",id);


    // Get All Products
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
     }else if(method === "GET" && id !== null){   
        //Get Single Product 
        const products = readProduct();
        const product = products.find((p : IProducts)=>p.id === id);
        // console.log(product);

        res.writeHead(200,{"content-type" : "application/json"});
        res.end(
            JSON.stringify({
            message: "Product retrived successfully!",
            data: product,
        }),
    );

     }
     else if(method === "POST" && url === '/products'){
        // Created Product by POST method
        const body = await parseBody(req);
        // console.log("Body",body);
        const products = readProduct();  //[{},{},{}]
        const newProducts = {
            id: Date.now(),
            ...body,
        };
        // console.log(newProducts);
        products.push(newProducts);  //[{},{},{},{new}]
        // console.log(products);
        insertProduct(products);

        res.writeHead(200,{"content-type" : "application/json"});
        res.end(
            JSON.stringify({
            message: "Product created successfully!",
            data: products,
         }),
           );

     }else if(method === "PUT" && id !== null){
        const body = await parseBody(req);
        const products = readProduct();


        const index = products.findIndex((p : IProducts)=>p.id === id);
        // console.log(index);
        if(index < 0){
            res.writeHead(404,{"content-type" : "application/json"});
        res.end(
            JSON.stringify({
            message: "Product not found!",
            data: null,
        }),
    );
    }
    // console.log(products[index]);
    products[index] = {id : products[index].id,...body};

    insertProduct(products);
     res.writeHead(200,{"content-type" : "application/json"});
        res.end(
            JSON.stringify({
            message: "Product updated successfully!",
            data: products[index],
        }),
    );
     }
};