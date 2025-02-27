import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    save,
}

const users = utilService.readJsonFile('./data/users.json')

async function query(filterBy) {
    let usersToDisplay = users
    try {
        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.title, 'i')
            usersToDisplay = usersToDisplay.filter((user) => regExp.test(user.title))
        }
        return usersToDisplay.map(user => ({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            isAdmin: user.isAdmin
        }))
    } catch (err) {
        loggerService.error(`Couldn't get users`)
        throw err
    }
}

async function getById(userId) {
    try {
        const user = users.find((user) => user._id === userId)
        if (!user) throw `Bad user id ${userId}`
        return {
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            isAdmin: user.isAdmin
        }
    } catch (err) {
        loggerService.error(`Couldn't get user ${userId}`)
        throw err
    }
}


async function getByUsername(username) {
    try {
        const user = users.find(user => user.username === username)
        return user
    } catch (err) {
        loggerService.error('userService[getByUsername] : ', err)
        throw err
    }
}

async function remove(userId) {
    try {
        const idx = users.findIndex((user) => user._id === userId)
        if (idx === -1) throw `Bad user id ${userId}`
        users.splice(idx, 1)

        await utilService.writeJsonFile('./data/users.json', users)
        return
    } catch (err) {
        loggerService.error(`Couldn't remove user ${userId}`)
        throw err
    }
}

async function save(userToSave) {
    try {
        if (userToSave._id) {
            const idx = users.findIndex((user) => user._id === userToSave._id)
            if (idx === -1) throw `Bad user id ${userId}`
            users[idx] =  userToSave
        } else {
            userToSave._id = utilService.makeId()
            userToSave.score = 1000
            userToSave.isAdmin = false
            users.push(userToSave)
        }
        await utilService.writeJsonFile('./data/users.json', users)
        return userToSave
    } catch (err) {
        loggerService.error(`Couldn't save user ${userId}`)
        throw err
    }
}
