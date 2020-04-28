const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/vendor')
const auth = require('../middlewares/auth')
// const { sendWelcomeMail, sendCancelationMail } = require('../emails/account')
const router = new express.Router()
router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    const gstin = user.tax_iden_no
    console.log(gstin)

    await user.save()
    // sendWelcomeMail(user)
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
  /* user
		.save()
		.then((user) => {
			res.status(201).send(user)
			console.log(user)
		})
		.catch((e) => {
			res.status(400).send(e)
			console.log(e.message)
		}) */
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    console.log(req.user)

    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send(e)
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
  /* try {
		const users = await User.find({})
		res.send(users)
	} catch (e) {
		res.status(500).send(e)
	} */
  /* User.find({})
		.then((users) => {
			res.send(users)
		})
		.catch((e) => {
			res.status(500).send()
		}) */
})

//  router.get("/users/:id", async (req, res) => {
// 	const _id = req.params.id
// 	try {
// 		const user = await User.findById(_id)
// 		if (!user) {
// 			return res.status(404).send()
// 		}
// 		res.send(user)
// 	} catch (e) {
// 		res.status(500).send(e)
// 	}
// 	/* User.findById(_id)
// 		.then((user) => {
// 			if (!user) {
// 				return res.status(404).send()
// 			}
// 			res.send(user)
// 		})
// 		.catch((e) => {
// 			res.status(500).send(e)
// 		}) */
// })

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isAllow = updates.every((update) => {
    return allowedUpdates.includes(update)
  })
  if (!isAllow) {
    return res.status(400).send({
      Error: 'Invalid Update!',
    })
  }
  // Alternate code for the above
  /* const check = []
	updates.forEach((update) => {
		check.push(allowedUpdates.includes(update))
	})
	console.log(check)

	if (false in check) {
		console.log(updates)
		return res.status(400).send({
			Error: "Invalid Update!"
		})
	} */

  try {
    // const user = await User.findById(req.user._id)
    updates.forEach((update) => (req.user[update] = req.body[update]))
    await req.user.save()
    /* const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			runValidators: true,
			new: true
		}) */
    //No need of using if after setting route for self-updating.
    // if (!user) {
    // 	return res.status(404).send()
    // }
    res.send(req.user)
  } catch (e) {
    return res.status(500).send(e)
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try {
    /* const user = await User.findByIdAndDelete(req.user._id)
		if (!user) {
			return res.status(404).send()
		}
		res.send(user) */
    await req.user.remove()
    sendCancelationMail(req.user)
    res.send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
})

const avatar = multer({
  //dest property is removed to store the file in User model not in filesystem.
  // dest: "avatars",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Please upload an image!'))
    }
    callback(undefined, true)
  },
})

router.post(
  '/users/me/avatar',
  auth,
  avatar.single('avatar'),
  async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer)
        .resize({
          width: 250,
          height: 250,
        })
        .png()
        .toBuffer()
      req.user.avatar = buffer
      await req.user.save()
      res.send()
    } catch (e) {
      res.status(400).send(e)
      console.log(e)
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message })
  },
)

router.delete(
  '/users/me/avatar',
  auth,
  avatar.single('avatar'),
  async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
  },
  (error, req, res, next) => {
    res.status(500).send()
  },
)

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    console.log(user)

    if (!user | !user.avatar) {
      throw new Error()
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
