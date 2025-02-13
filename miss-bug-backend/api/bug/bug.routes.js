import express from "express"
import { addBug, getBug, getBugs, removeBug, updateBug } from "./bug.controller.js"

const router = express.Router()

router.get('/', getBugs)

router.get('/:bugId', getBug)

router.post('/', addBug)

router.put('/:bugId', updateBug)

router.delete('/:bugId', removeBug)

export const bugRoutes = router