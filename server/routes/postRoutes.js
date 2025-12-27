const {Router} = require('express')
const {createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost} = require('../controllers/postControllers')
const authMiddleware = require('../middleware/authMiddleware')
const router = Router()

router.post('/', authMiddleware, createPost)
router.get('/', getPosts)

// specific paths FIRST
router.get('/categories/:category', getCatPosts)
router.get('/users/:id', getUserPosts)

// generic dynamic LAST
router.get('/:id', getPost)
router.patch('/:id', authMiddleware, editPost)
router.delete('/:id', authMiddleware, deletePost)

module.exports = router
