import DBLocal from 'db-local'
import crypto from 'node:crypto'
import path from 'path'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from './config.js'

const { Schema } = new DBLocal({ path: './db'})

const User = Schema ('User', {
    _id: {type: String, require: true},
    username: {type: String, require: true},
    password: {type: String, require: true}
})

export class UserRepository {
    static create ({ username, password}) {
        Validation.username(username)
        Validation.password(password)
        
        const user = User.findOne({ username })
        if (user) throw new Error('username already exists')
        
        const id = crypto.randomUUID()
        const hashedPassword = bcrypt.hashSync(password,SALT_ROUNDS)

        User.create({
            _id: id,
            username,
            password: hashedPassword
        }).save()

        return id
    }

    static login ({ username,password }){
        Validation.username(username)
        Validation.password(password)

        const user = User.findOne({ username })
        if (!user) throw new Error('username does not exists')
        
        const isValid = bcrypt.compareSync(password, user.password)
        if (!isValid) throw new Error('password is invalid')
        
        const { _id, password: _, ...publicUser } = user

        return publicUser
    }
}

class Validation {
    static username(username){
        if (typeof username != 'string') throw new Error('Username must be a string')
        if (username.length < 3) throw new Error('Username must be at least 3 characters long')
    }

    static password(password){
        if (typeof password != 'string') throw new Error('Password must be a string')
        if (password.length < 6) throw new Error('Password must be at least 3 characters long')
    }
}