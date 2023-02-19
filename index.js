const { query } = require('express')
const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')
const app = express()


app.use(
    express.urlencoded({
        extended:true,
    }),
)
app.use(express.json())

app.engine('handlebars', exphbs.engine())

app.set('view engine', 'handlebars')

//ponte pra os arquivos staticos
app.use(express.static('public'))

//ROTA DO HOME
app.get('/', (req, res)=>{
    res.render("home")  
})

//ROTA PRA INSERIR DADOS
app.post('/books/insertbook',(req, res)=>{
    
    const title = req.body.title
    const autor = req.body.autor
    const pageqty = req.body.pageqty
    
    const sql = ` INSERT INTO books (??, ??, ??) VALUES(?,?,?)`
    const data = ['title','autor','pageqty',title,autor,pageqty]
    pool.query(sql, data, function(err){
        if(err){
            console.log(err)
        }
        res.redirect('/books')
    })
})

//ROTA PARA SELECIONAR OS DADOS
app.get('/books', (req, res)=>{
    const sql = "SELECT * FROM books"
    //buscando os dados 
    pool.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }
    const books = data
    console.log(data)
    res.render('books', { books })
    })


})

app.get('/books/:id', (req, res)=>{
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE ?? = ?`
    const data = ['id',id]
    pool.query(sql,data, function(err, data){
        if(err){
            console.log(err)
            return
        }
        const book = data[0]
        res.render('book', {book})
    })
})

//1 parte Rota para editar
// 1 Resgatar os dados e mandar pra uma view
app.get('/books/edit/:id', (req, res)=>{
    const id = req.params.id
    const sql = `SELECT * FROM books WHERE ?? = ?`
    const data = ['id',id]
    pool.query(sql,data, function(err, data){
        if(err){
            console.log(err)
            return
        }
        const book = data[0]
        res.render('editbook', {book})
    })
})

//2 parte Rota para editar

app.post('/books/updatebook', (req, res)=>{

    //Resgatnado os dados que vim pelo body
    const id = req.body.id
    const title = req.body.title
    const autor = req.body.autor
    const pageqty = req.body.pageqty

    //sql para editar a tabela books
    const sql = ` UPDATE books SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?`
    const data = ['title',title, 'autor',autor, 'pageqty',pageqty, 'id',id]
    pool.query(sql,data, function(err){
        if(err){
            console.log(err)
            return
        }
        res.redirect('/books')
    })

})

app.post('/books/remove/:id', (req, res)=>{
    const id = req.params.id;
    //selecionando pelo ID 
    const sql = `DELETE FROM books WHERE ?? = ?`
    const data = ['id', id]

     pool.query(sql,data, function(err){
        if(err){
            console.log(err)
            return
        }
        res.redirect('/books')
     })
})

app.listen(3000)
