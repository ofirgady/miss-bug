import express from "express"
import { addUser, getUser, getUsers, removeUser, updateUser } from "./user.controller.js"

const router = express.Router()

router.get('/', getUsers)

router.get('/:userId', getUser)

router.post('/', addUser)

router.put('/:userId', updateUser)

router.delete('/:userId', removeUser)

export const userRoutes = router