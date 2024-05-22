import http from 'node:http'

const PORT = 3333

const participantes = [];
const server = http.createServer((request, response)=> {
    const {method, url} = request
    //localhost:3333/rotasDaAplicação
    //localhost:3333/participantes/1
    if(method === 'GET' && url === '/participantes'){
        //listar todos os participantes
        response.writeHead(200, {'Content-Type': 'application/json'})
        response.end(JSON.stringify(participantes))
    } else if(method === 'POST' && url === '/participantes'){
        let body = ''
        request.on('data', (chunk)=> {
            body += chunk
        })
        request.on('end', ()=> {
            const participante = JSON.parse(body);
            if(participante.idade < 16){
                response.writeHead(403, {'Content-Type': "aplication/json"});
                response.end(
                    JSON({message: "Apenas usuarios maiores de 15 anos"})
                );
                return
            }

            //Validação de Senha
            if(participante.senha !== participante.confirmeSenha){
                response.writeHead(400, {'Content-Type': 'application/json'})
                response.end(JSON.stringify({message: 'Senhas não correspondem'}))
                return
            }
            participante.id = participante.length + 1
            participante.push(participante)
            response.write(201, {'Content-Type': 'application/json'})
            console.log(participante.nome);
            response.end();
        });
    }else if(method === 'GET' && url === '/participantes/count'){
       const contarParticipantes = participantes.length
       response.writeHead(200, {'Content-Type': 'application/json'})
       response.end(JSON.stringify({"Números total de participantes:": contarParticipantes})
       );
    }else if(method === 'GET' && url === '/participantes/count/over18'){
       const participanteMaior18 = participantes.filter((participante) => participante.idade > 18
       );
       const quantidadeteMaior18 = participanteMaior18.length
       response.writeHead(200, {'Content-Type': "aplication/json"});
       response.end(JSON.stringify)
    }else if(method === 'GET' && url === '/participantes/city/most'){
        const contandoCidades = participantes.reduce((acc, participant)=>{
            acc[participant.cidade] = (acc[participant.cidade] || 0) + 1
            return acc
        }, {})
        console.log(contandoCidades)
        //[ ['Maceió', '3',], ['Marechal', '2'] ['Sao luis', '2'] ]
        let quantidadeDeParticipante = 0
        let cidadeComMaiorNumeroDeParticipante = 0
        Object.entries(contandoCidades).forEach((cidade, count)=>{
            if(count > quantidadeDeParticipante){
                quantidadeDeParticipante = count
                cidadeComMaiorNumeroDeParticipante = cidade
            }
        })
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(
            JSON.stringify({
            "Qunatidade total de participantes":quantidadeDeParticipante,
            "Cidade com a maior qunatidade de paricipantes":
            cidadeComMaiorNumeroDeParticipante,
        })
        
    };
    }else if(method === 'PUT' && url.startsWith('/participantes/')){
      //Participantes/1
      const id = (url.split('/')[2])
      let body = ''
      request.on('data', (chunk) => {
        body += chunk;
      });
      request.on('end', ()=> {
        const participanteAtualizado = JSON.parse(body)

        const indexParticipantes = participantes.findIndex((participante)=>participante.id === id
        );
        if(indexParticipantes === -1)
        response.writeHead(404, {"Content-Type": "application/json"});
        response.end(
            JSON.stringify({ message: "Usuário selecionado não existe"})
            );
        return;
      
        participantes[indexParticipantes] = {
            ...participantes[indexParticipantes], ...participanteAtualizado
        };
        response.writeHead(200, {'Content-Type': 'application/json'})
        response.end(JSON.stringify({message: ''}))
      });
    }else if(method === 'DELETE' && url.startsWith('/participantes/')){
        const id = parseInt(url.split('')[2])
        const indexParticipante = participantes.findIndex((participante)=> participante.id === id
        );
        if (indexParticipante === -1) {
            response.writeHead(404, { "Content-Type": "application/json"});
            response.end(JSON.stringify({ mesage: "Usuario não encontrado"}));
            return;
        }
        participantes.slice(indexParticipante -1)
        response.writeHead(200, { "Content-Type": "application/json"});
        response.end(JSON.stringify({ mesage: "Usuario não encontrado"}));

    }else if(method === 'GET' && url.startsWith('/participantes/')){
        //localhost:3333/participantes/2
        //[0    1,   2]
        const id = perseInt(typeof url.split('/')[2])

        const encontrarParticipante = participantes.find((participante)=> participante.id === id);

        if(!participantes){
            response.writeHead(404, {"Content-Type": "application/json"});
            response.end(JSON.stringify({ message: "Participantes não encontrado"}));
            return
        }
        console.log(encontrarParticipante)
        console.log(id);
        response.end();
    }else{
        console.log(`${method},  ${url} `);
        response.end();
}
});

server.listen(PORT, ()=>{
    console.log(`servidor on http://localhost:${PORT}`)
})