import { loggerService } from "../../services/logger.service.js"
import { userService } from "./user.service.js"


export async function getUsers(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt,
        }
        const users = await userService.query(filterBy)
        {}
        res.send(users)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't get users`)
    }
}

export async function getUser(req, res) {
    const { userId } = req.params
        try {
            const user = await userService.getById(userId)
            res.send(user)
        } catch (err) {
            loggerService.error(err.message)
            res.status(400).send(`Couldn't get user`)
        }
}

export async function addUser(req, res) {
    const {fullname, username, password } = req.body
        const userToSave = { fullname, username, password }
        try {
            const savedUser = await userService.save(userToSave)
            res.send(savedUser)
        } catch (err) {
            loggerService.error(err.message)
            res.status(400).send(`Couldn't save user`)
        }
}

export async function updateUser(req, res) {
    const { _id, fullname, username, password } = req.body
        const userToSave = { _id, fullname, username, password }
        try {
            const savedUser = await userService.save(userToSave)
            res.send(savedUser)
        } catch (err) {
            loggerService.error(err.message)
            res.status(400).send(`Couldn't save user`)
        }
}

export async function removeUser(req, res) {
    const { userId } = req.params
    try {
        await userService.remove(userId)
        res.send('User Deleted')
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't remove user`)
    }
}
