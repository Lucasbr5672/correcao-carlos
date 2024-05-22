
const http = require('node:http')
const fs = require('node:fs')

const PORT = 3333

const server = http.createServer((request, response)=>{
    const urlInfo = require('url').parse(request.url, true);
    const name = urlInfo.query.name; 
    if(!name) {
        fs.readFile('index.html', (err, data)=>{
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data)
            response.end();
        });
    }else{
        // Escrita e Atualização do arquivo
        const NomeEmNovaLinha = name + ',\r\n';
        fs.appendFile('arquivo.txt', NomeEmNovaLinha, (err)=>{ 
                 if(err){return response.end()}
               response.writeHead(302, {
                     Location: '/',
                 })
                 return response.end();
             });

        //codigo para escrita
        // fs.writeFile('arquivo.txt', name, (err)=>{ 
        //     if(err){return response.end()}
        //     response.writeHead(302, {
        //         Location: '/'
        //     })
        //     return response.end()
        // })
    }

})

server.listen(PORT, ()=> {
    console.log(`Servidor on PORT: ${PORT}`)
})