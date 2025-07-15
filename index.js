const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceFunc = require('./modules/replaceFunc');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8");
const tempOverview = fs .readFileSync("./templates/overview.html","utf-8");
const tempProduct = fs .readFileSync("./templates/product.html","utf-8");
const tempCard = fs .readFileSync("./templates/template-card.html","utf-8");

const newData = JSON.parse(data);


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
        //this ⬆ or this ⬇
        let id = parseInt(url.parse(pathName,true).query.id);

        // newData.map(ele => {
        //     if (id == ele.id){
        //         // console.log("mami" + ele.id);
        //         let temp = replaceFunc(tempProduct,ele);
        //         res.writeHead(200,{"content-type" : "text/html"});
        //         res.end(temp);
        //     }
        // })
        //this ⬆ or this ⬇
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