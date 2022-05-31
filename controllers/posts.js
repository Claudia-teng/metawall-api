const Posts = require('../models/posts');
const Users = require('../models/users');
const Comments = require('../models/comments');

async function getPosts (req, res) {
  // asc -> old to new
  // desc -> new to old
  const timeSort = { "createdAt": req.query.timeSort === "asc" ? 1 : -1};
  const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
  const allPost = await Posts.find(q)
    .populate({
      path: 'userId',
      select: 'name photo'
    })
    .populate({
      path: 'comments',
      select: 'comment user'
    })
    .sort(timeSort);
  return res.status(200).json(await allPost);
}

async function getSinglePost (req, res) {
  const id = req.params.id
  const existPost = await existsPostWithId(id);

  try {
    if (!existPost) {
      return res.status(400).json({
        error: 'Post not found!'
      });
    }

    const post = await Posts.findById(id);
    return res.status(200).json(await post);
  } catch(err) {
    return res.status(400).json({
      error: err.message
    });
  }
}

async function createPost (req, res) {
  try {
    const data = req.body;
    const user = await existsUserWithId(data.userId);

    if (!user) {
      return res.status(400).json({
        error: 'User not found!'
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
  const post = await existsPostWithId(id);

  try {
    if (!post) {
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
        content: data.content,
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

async function likePost(req, res) {
  const id = req.params.id;
  const existPost = await existsPostWithId(id);

  try {
    if (!existPost) {
      return res.status(400).json({
        error: "Post not found!"
      });
    } else {
      await Posts.findByIdAndUpdate(id, {
        $addToSet:{ likes: req.user.id }
      })
      return res.status(201).json({
        ok: true
      });
    }
  } catch (err) {
    return res.status(400).json({
      error: err.message
    });
  }
}

async function unlikePost(req, res) {
  const id = req.params.id;
  const existPost = await existsPostWithId(id);

  try {
    if (!existPost) {
      return res.status(400).json({
        error: "Post not found!"
      });
    } else {
      await Posts.findByIdAndUpdate(id, {
        $pull:{ likes: req.user.id }
      })
      return res.status(201).json({
        ok: true
      });
    }
  } catch (err) {
    return res.status(400).json({
      error: err.message
    });
  }
}

async function getUserPost(req, res) {
  const id = req.params.id;
  const user = await existsUserWithId(id);

  if (!user) {
    return res.status(400).json({
      error: 'User not found!'
    });
  }

  const posts = Posts.find({user})
    .populate({
      path: 'userId',
      select: 'name photo'
    })
    .populate({
      path: 'comments',
      select: 'comment user'
    });
  return res.status(200).json(await posts);
}

async function commentPost(req, res) {
  const id = req.params.id;
  const existPost = await existsPostWithId(id);
  const { comment } = req.body;

  try {
    if (!comment) {
      return res.status(400).json({
        error: "Please enter the comments."
      });
    }

    if (!existPost) {
      return res.status(400).json({
        error: "Post not found!"
      });
    } else {
      await Comments.create({
        user: req.user.id,
        postId: id,
        comment
      });
      return res.status(401).json({
        ok: true
      });
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
  getSinglePost,
  createPost,
  deleteAllPosts,
  deletePost,
  editPost,
  likePost,
  unlikePost,
  commentPost,
  getUserPost
}