const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { request } = require("express");
const path = require("path");


//middleware
app.use(cors());
app.use(express.json());
//app.use(express.static(path.join(__dirname, "client/build")));
if(process.env.NODE_ENV === "production"){
	app.use(express.static(path.join(__dirname, "client/build")));
}

//Routes//

//create a todo
app.post("/todos", async(req, res) =>{
    try {
        const {description} = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);
        res.send(newTodo.rows);
    } catch (error) {
        console.log(error.message);
    }
})


//get all todos
app.get("/todos", async(req, res) =>{
    try {
        const allTodos = await pool.query("SELECT * FROM todo");

        res.json(allTodos.rows); 
    } catch (error) {
        console.log(error.message);
    }
})

//get a todo
app.get("/todo/:id", async(req, res) =>{
    try {
        const {id} = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(todo.rows[0]); 
    } catch (error) {
        console.log(error.message);
    }
})

//update a todo
app.put("/todo/:id", async(req, res) =>{
    try {
        const id = req.params.id;
        const updatedTodo = req.body.updatedTodo;
        await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [updatedTodo, id]);
        const newTodo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.send(newTodo.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
})

//delete a todo
app.delete("/todo/:id", async(req, res) =>{
    try {
        const {id} = req.params;
        await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.send("Todo was deleted");
    } catch (error) {
        console.log(error.message);
    }
})

const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`server is listening on port ${port}`);
});