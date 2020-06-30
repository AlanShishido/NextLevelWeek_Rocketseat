const express = require("express")
const server = express()

// pegar o banco de dados do outro script
const db = require("./database/db.js")

// Configurar pasta publica
server.use(express.static("public")) //disponibiliza essa pasta no servidor para a utilização nos outros códigos também

//Habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))

// Configuração de um HTML mais dinâmico para não ser apenas estático com o texto existente. E sim, mudando de acordo com o sevidor
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//configurar caminhos da minha aplicação
//pagina inicial
server.get("/", (req, res) => { //res: requisição, res:resposta
    // res.send("Cheguei aqui")
    // res.sendFile(__dirname+ "/views/index.html") //uma rota, nesse caso apenas do index
    return res.render("index.html", { titulo: "Uma coisa" }) //Foi configurado o dirname com o nunjuck e utiliza a funcao render
        // usar o return para evitar de acontecer bugs futuros
})

server.get("/create-point", (req, res) => {
    // req.query: Query strings da nossa url
    // console.log(req.query)


    return res.render("create-point.html")
})
server.post("/savepoint", (req, res) => {
    //req.body: O corpo do nosso formulário
    // console.log(req.body)
    //inserir dados na tabela
    const query = `
        INSERT INTO places(
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES( ? , ? , ? , ? , ? , ? , ? );`

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            return console.log(err)
        }
        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("ok")
    }

    db.run(query, values, afterInsertData)

})

server.get("/search", (req, res) => {
        //pegar os dados do banco de dados
        db.all(`SELECT * FROM places`, function(err, rows) {
            if (err) { return console.log(err) }

            // console.log("Aqui está seus registros")
            // console.log(rows)

            const total = rows.length

            //mostrar a p[agina html com os dados do banco de dados
            return res.render("search-results.html", { places: rows, total })
        })


    })
    // lembrando que todos esses sendFile devem ser alterador em cada arquivo html para o servidor entender a rota

//ligar o servidor
server.listen(3000)