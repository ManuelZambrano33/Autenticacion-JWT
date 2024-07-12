import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './repository-user.js'

const app = express()
app.set ('view engine', 'ejs')

app.use(express.json())

app.get('/', (req, res) => {
    res.render('ejemplo', { name:'MUY MAÑOSA'})
})

app.post('/login',  (req,res) => {
    const { username, password } = req.body

    try {
        const user = UserRepository.login({username,password})
        res.send({user})
    } catch{    
        res.status(401).send(error.message)
    }
})


app.post('/register',  (req,res) => {
    const { username, password} = req.body  
    console.log(req.body)

    try {
        const id = UserRepository.create({username, password})
        res.send({id})
    }catch(error){
        res.status(400).send(error.message)
    }
})

app.post('/logout',  (req,res) => {})

app.get('/protected',  (req,res) => {})



app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})