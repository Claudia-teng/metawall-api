const Posts = require('../models/posts');
const Users = require('../models/users');

async function getPosts (req, res) {
  // asc -> old to new
  // desc -> new to old
  const timeSort = { "createdAt": req.query.timeSort === "asc" ? 1 : -1};
  const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
  const allPost = await Posts.find(q).populate({
    path: 'userId',
    select: 'name photo '
  }).sort(timeSort);
  return res.status(200).json(await allPost);
}

async function createPost (req, res) {
  try {
    const data = req.body;
    const existUser = await existsUserWithId(data.userId);

    if (!existUser) {
      return res.status(400).json({
        err: 'User not found!'
      });
    }

    if (!data.content) {
      return res.status(400).json({
        error: 'Please enter the content.'
      });
    } else {
      const newPost = await Posts.create({
        userId: data.userId,
        content: data.content,
        tags: data.tags,
        image: data.image
      })
      return res.status(201).json(await newPost);
    }
  } catch(err) {
    return res.status(400).json({
      error: err.message
    });
  }
}

async function deleteAllPosts(req, res) {
  await Posts.deleteMany({});
  return res.status(200).json({
    ok: true
  });
}

async function deletePost(req, res) {
  const id = req.params.id;
  const existPost = await existsPostWithId(id);

  try {
    if (!existPost) {
      return res.status(400).json({
        error: "Post not found!"
      });
    } else {
      await Posts.findByIdAndDelete(id);
      return res.status(200).json({
        ok: true
      });
    }
  } catch (err) {
    return res.status(400).json({
      error: err.message
    });
  }
}

async function editPost(req, res) {
  try {
    const data = req.body;
    const id = req.params.id;
    const existPost = await existsPostWithId(id);

    if (!existPost) {
      return res.status(400).json({
        error: 'Post not found!'
      });
    }

    if (!data.content) {
      return res.status(400).json({
        error: "Please enter the content."
      });
    } else {
      const editedPost = await Posts.findByIdAndUpdate(id, {
        userId: data.userId,
        content: data.content,
        tags: data.tags,
        image: data.image
      },{
        new: true,
        runValidators: true
      })
      return res.status(200).json(await editedPost);
    }
  } catch (err) {
    return res.status(400).json({
      error: err.message
    });
  }
}

async function existsPostWithId(id) {
  try {
    return await Posts.findById(id);
  } catch (err) {
    return null;
  }
}

async function existsUserWithId(id) {
  try {
    return await Users.findById(id);
  } catch (err) {
    return null;
  }
}

module.exports = {
  getPosts, 
  createPost,
  deleteAllPosts,
  deletePost,
  editPost,
}