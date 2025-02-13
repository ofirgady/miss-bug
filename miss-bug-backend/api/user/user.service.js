import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const userService = {
    query,
    getById,
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

        // console.log({ users: usersToDisplay })

        return usersToDisplay
    } catch (err) {
        loggerService.error(`Couldn't get users`)
        throw err
    }
}

async function getById(userId) {
    try {
        const user = users.find((user) => user._id === userId)
        if (!user) throw `Bad user id ${userId}`
        return user
    } catch (err) {
        loggerService.error(`Couldn't get user ${userId}`)
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
            users.splice(idx, 1, { ...users[idx], ...userToSave })
        } else {
            userToSave._id = utilService.makeId()
            userToSave.score = 100
            users.push(userToSave)
        }
        await utilService.writeJsonFile('./data/users.json', users)
        return userToSave
    } catch (err) {
        loggerService.error(`Couldn't save user ${userId}`)
        throw err
    }
}
