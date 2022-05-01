const Posts = require('../models/posts');

async function getPosts (req, res) {
  // asc -> old to new
  // desc -> new to old
  const timeSort = { "createdAt": req.query.timeSort === "asc" ? 1 : -1};
  const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
  const allPost = await Posts
    .find(q)
    .sort(timeSort);
  // const post = await Post.find(q).populate({
  //   path: 'user',
  //   select: 'name photo '
  // }).sort(timeSort);
  res.status(200).json(await allPost);
}

async function createPost (req, res) {
  try {
    const data = req.body;
    if (data.content) {
      const newPost = await Posts.create({
        user: data.user,
        content: data.content,
        tags: data.tags,
        image: data.image
      })
      res.status(201).json(await newPost);
    } else {
      res.status(400).json({
        error: 'Please enter the content.'
      });
    }
  } catch(err) {
    res.status(400).json({
      error: err.message
    });
  }
}

async function deleteAllPosts(req, res) {
  await Posts.deleteMany({});
  res.status(200).json({
    ok: true
  });
}

async function deletePost(req, res) {
  const id = req.params.id;
  const existPost = await existsPostWithId(id);
  try {
    if (existPost) {
      await Posts.findByIdAndDelete(id);
      res.status(200).json({
        ok: true
      });
    } else {
      res.status(400).json({
        error: "Post not found!"
      });
    }
  } catch (err) {
    res.status(400).json({
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
      res.status(400).json({
        error: 'Post not found!'
      });
    }

    if (data.content) {
      const editedPost = await Posts.findByIdAndUpdate(id, {
        user: data.user,
        content: data.content,
        tags: data.tags,
        image: data.image
      },{
        new: true,
        runValidators: true
      })
      res.status(200).json(await editedPost);
    } else {
      res.status(400).json({
        error: "Please enter the content."
      });
    }
  } catch (err) {
    res.status(400).json({
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

module.exports = {
  getPosts, 
  createPost,
  deleteAllPosts,
  deletePost,
  editPost,
}