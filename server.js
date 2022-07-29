const http = require("http");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("/tmp/foo.db");//(':memory:');
db.run("CREATE TABLE lorem (info TEXT)");
const server = http.createServer((request, response) => {
 response.writeHead(200, {'Content-Type':'application/json'});
 response.end(JSON.stringify({     
     data: Array(1, 2, 3, 4)
 }));/**/
 /*response.end("Hello");/**/

db.serialize(() => {    
    try{
        const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
        for (let i = 0; i < 10; i++) {
            stmt.run("Ipsum " + i);
        }
        stmt.finalize();

        db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
            console.log(row.id + ": " + row.info);
        });
    }catch(_e){
        console.log(_e);
        db.close();
    } 
});
}).listen(4001, () => console.log("Servidor ligado!"));
