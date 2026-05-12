import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProducts } from "../types/product.types";
import { parseBody } from "../utility/parseBody";
import { sendResponse } from "../utility/sendResponse";


export const productController = async(
    req : IncomingMessage, 
    res : ServerResponse
)=>{
    const url = req.url;
    const method = req.method;
    const urlParts = url?.split("/");
    const id = 
    urlParts && urlParts[1] === "products"  ?  Number(urlParts[2]) : null;
    


    // Get All Products
     if(url === "/products" && method === "GET"){  
       try {
         const products = readProduct();

         return sendResponse(
            res,
            200, 
            true,
            "Products retrived successfully!",
            products,
        );
       } catch (error) {
         return sendResponse(
            res,
            404,
             false,
             "Something went wrong!",
             error,
            );
       }

     }else if(method === "GET" && id !== null){   
        try {
            //Get Single Product 
        const products = readProduct();  //[{}]
        const product = products.find((p : IProducts)=>p.id === id);  //id === id
        if(!product){
        return sendResponse(
            res,
             404,
              false,
               "Product not found!",
              );
         }
         
         return sendResponse(
            res,
            200, 
            true,
            "Product retrived successfully!",
            products,
        );
        } catch (error) {
             return sendResponse(
            res,
            404,
             false,
             "Something went wrong!",
             error,
            );
        }

     }
    else if(method === "POST" && url === '/products'){
        try {
            // Created Product by POST method
            const body = await parseBody(req);
            const products = readProduct();  //[{},{},{}]
            const newProducts = {
                id: Date.now(),
                ...body,
            };
            products.push(newProducts);  //[{},{},{},{new}]

            insertProduct(products);

            return sendResponse(
                res,
                200,
                true,
                "Product created successfully!",
                products,
            );
        } catch (error) {
            return sendResponse(
                res,
                404,
                false,
                "Something went wrong!",
                error,
            );
        }
    }else if(method === "PUT" && id !== null){
        try {
            // Updated product by PUT method
            const body = await parseBody(req);
            const products = readProduct();

            const index = products.findIndex((p : IProducts)=>p.id === id);

            if(index < 0){
                return sendResponse(
                    res,
                    404,
                    false,
                    "Product not found!",
                );
            }

            products[index] = {id : products[index].id, ...body};

            insertProduct(products);

            return sendResponse(
                res,
                200,
                true,
                "Product updated successfully!",
                products[index],
            );
        } catch (error) {
            return sendResponse(
                res,
                500,
                false,
                "Something went wrong!",
                error,
            );
        }
    }else if(method === "DELETE" && id !== null){
        try {
            // Deleted product by DELETE method
            const products = readProduct();
            const index = products.findIndex((p : IProducts)=>p.id === id);

            if(index < 0){
                return sendResponse(
                    res,
                    404,
                    false,
                    "Product not found!",
                );
            }

            products.splice(index, 1);

            insertProduct(products);

            return sendResponse(
                res,
                200,
                true,
                "Product deleted successfully!",
                null,
            );
        } catch (error) {
            return sendResponse(
                res,
                500,
                false,
                "Something went wrong!",
                error,
            );
        }
    }
};