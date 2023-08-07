const express = require("express")
const app = express();
const cors = require("cors")
const jwt = require("jsonwebtoken")


const jwtsecret = "eaeaeaeaeaeaetstststs"

app.use(cors({ origin: 'http://127.0.0.1:5500' }))
app.use(express.urlencoded({extended: false}));
app.use(express.json());

function auth(req,res,next){
    const authToken = req.headers['authorization'];
    
        if(authToken != undefined){

            const bearer = authToken.split(" ");
            var token = bearer[1];

            jwt.verify(token, jwtsecret,(err, data)=>{
                if(err){
                    res.status(401);
                    res.json({err: "Token Inválido"})
                }else{
                    req.token = token;
                    req.loggedUser = {id: data.id, email: data.email}
                    next();
                }
            })
        }else{
            res.status(401);
            res.json({err: "token inválido"})
        }
    
}

var DB = {
    games: [
        {
            id: 12,
            title: "Mario Kart",
            year: 1998,
            price: 26
        },
        {
            id: 11,
            title: "Bomberman",
            year: 1990,
            price: 45
        },
        {
            id:18,
            title: "Kill",
            year: 2000,
            price: 30
        }
    ],
    users: [
        {
            id:1,
            name: "Nina Holanda",
            email: "nina@gmail.com",
            password: "agente123"
        },
        {
            id: 11, 
            name: "Isis",
            email: "violetta@test",
            password: "olafcat"
        }
    ]
}

app.get("/games",auth, (req,res)=>{
    res.statusCode = 200;
    res.json(DB.games);
})

app.get("/game/:id", (req,res)=>{
    if(isNaN(req.params.id)){
        res.sendStatus(400)
    }else{
        var id = parseInt(req.params.id);

        var game = DB.games.find(g => g.id == id);

        if(game != undefined){
            res.statusCode = 200;
            res.json(game)
        }else{
            res.sendStatus(404)
        }
    }
})

app.post("/game", (req,res)=>{
    var {title, price, year} = req.body;

    DB.games.push({
        id: 2023,
        title,
        price,
        year
    });
    res.sendStatus(200);
})

app.delete("/game/:id", (req,res)=>{
    if(isNaN(req.params.id)){
        res.sendStatus(400)
    }else{
        var id = parseInt(req.params.id);
        var index = DB.games.findIndex(g => g.id == id);

        if(index == -1){
            res.sendStatus(404);
        }else{
            DB.games.splice(index,1);
            res.sendStatus(200);
        }
    }
})

app.put("/game/:id", (req,res)=>{
    if(isNaN(req.params.id)){
        res.sendStatus(400)
    }else{
        var id = parseInt(req.params.id);

        var game = DB.games.find(g => g.id == id);

        if(game != undefined){
           var { title, price, year} = req.body

           if(title != undefined){
                game.title = title;
           }
           if(price != undefined){
                game.price = price;
           }
           if(year != undefined){
                game.year = year;
           }
           res.sendStatus(200)
        }else{
            res.sendStatus(404)
        }
    }
})

app.post("/auth", (req,res)=>{
    var {email, password} = req.body;

    if(email != undefined){
       var user = DB.users.find(u => u.email == email);
        if(user != undefined){
            if(user.password == password){
                jwt.sign({id: user.id, email: user.email}, jwtsecret,{expiresIn: '24h'},(err, token)=>{
                    if(err){
                        res.status(400);
                        res.json({err: "Falha interna"})
                    }else{
                        res.status(200);
                        res.json({token: token})
                    }
                })
            }else{
                res.status(401);
                res.json({err: "Credenciais incorretas"})
            }
        }else{
            res.status(404);
            res.json({err: "Usuário não encontrado"})
        }
    }else{
        res.status(400)
        res.json({err: "email inválido"})
    }
})

app.listen(3000, ()=>{
    console.log('Servidor Conectado!');
})