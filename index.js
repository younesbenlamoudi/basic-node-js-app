// const fs = require('fs');

// const textIn = fs.readFileSync("./txt/input.txt",'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about avocado : ${textIn} .\n Created : ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);

// console.log("Created");


// fs.readFile("./txt/start.txt","utf-8",(err, data1)=>{
//     fs.readFile(`./txt/${data1}.txt`,"utf-8",(err,data2)=>{
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`,"utf-8",(err,data3)=>{
//             const final = `${data2}\n${data3}😎`;
//             fs.writeFile("./txt/final.txt",final,'utf-8',(err=>{
//                 console.log("we write in the file sucsufully😛");
//             }))
//         })
//     })
// })
// const http = require('http');
// const url = require('url');

// const server = http.createServer((req,res)=>{
//     // console.log(req.url);
//     // res.end("this is the server");
//     const pathName = req.url;
//     if(pathName === "/" || pathName === "/overview"){
//         res.end("Welcome to the home page");
//     }
//     else if(pathName === "/younes"){
//         res.end("Welcome to the your personal page");
//     }
//     else {
//         res.writeHead(404,{'Content-Type':'text/html',
//             'my-own-header':'hello'
//         });
//         res.end("<h1>error 404</h1>");
//     }
// });

// server.listen("8000","127.0.0.1",()=>{
//     console.log("server is running on port 8000");
// })


const fs = require('fs');
const http = require('http');
const url = require('url');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8");
const tempOverview = fs .readFileSync("./templates/overview.html","utf-8");
const tempProduct = fs .readFileSync("./templates/product.html","utf-8");
const tempCard = fs .readFileSync("./templates/template-card.html","utf-8");

const newData = JSON.parse(data);

function replaceFunc (temp , product){
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%ID%}/g,product.id);
    if (!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    }
    return output;
}

const server = http.createServer((req,res)=>{
    const pathName = req.url;
        
    if(pathName === "/" || pathName === "/overview"){
        let cardHtml = newData.map(ele=> replaceFunc(tempCard,ele));
        cardHtml = cardHtml.join("");
        let tempOvervieww = tempOverview.replace(/{%PRODUCT_CARDS%}/g,cardHtml);
        // console.log(tempOvervieww);
        res.writeHead(200,{"content-type" : "text/html"
        });
        res.end(tempOvervieww);
    }
    else if (pathName.includes){
        // let id = parseInt(pathName.split("id=")[1]);
        let id = parseInt(url.parse(pathName,true).query.id);

        // newData.map(ele => {
        //     if (id == ele.id){
        //         // console.log("mami" + ele.id);
        //         let temp = replaceFunc(tempProduct,ele);
        //         res.writeHead(200,{"content-type" : "text/html"});
        //         res.end(temp);
        //     }
        // })
        
        let temp = replaceFunc(tempProduct,newData[id]);
        res.writeHead(200,{"content-type" : "text/html"});
        res.end(temp);
    }
    else if(pathName === "/api"){
        res.writeHead(200,{"content-type":"application/json"});
        res.end(data);
    }
    else{
        res.writeHead(400,{"content-type":"text/html",
            "my-own-header":"hello"
        });
        res.end("<h1>error 404</h1>");
    }
});

server.listen("8000","127.0.0.1",()=>{
    console.log("server is running on port 8000");
})