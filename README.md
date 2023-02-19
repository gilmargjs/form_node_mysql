# form_node_mysql 
## Integração de  Node com MYSQL
Nesse Projeto Fizemos um CRUD Com 
* Nodejs
* Express
* Mysql
* Handlebars
#
## Inserindo Dados 
* Para inserir dados no banco de dados foi criado e executado uma query seguindo os padrões do MYSQL.
* iremos faser uso do insert.
```js
const sql = ` INSERT INTO books (title, autor, pageqty) VALUES('${title}','${autor}','${pageqty}')`
```
#
## Resgatando e Editando Dados
* Para resgatar um dado especifico vamos precisar utilizar o WHERE.
* Desta forma conseguiremos pegar pelo ID.
```js
  const sql = `SELECT * FROM books WHERE id = ${id}`
```
* A edição dos dados será feito na rota post.
```js
const sql = ` UPDATE books SET title = '${title}',autor = '${autor}', pageqty = '${pageqty}' WHERE id = ${id}`
```
#
## Excluindo Dados
* Para revover um item vamos utilizar a query DELETE.
* Precisamos enviar para rota Post.
```js
const sql = `DELETE FROM books WHERE id = ${id}`
```
