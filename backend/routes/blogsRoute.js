const express = require("express");
const route = express.Router();
const blogsModel = require("../models/blogsModel");
const authMiddleware = require("../middleware/authMiddleware");

//blogs/add
route.post("/add", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description } = req.body;
    if (title.trim() === "" || description.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }
    const blog = await blogsModel.create({
      title: title,
      description: description,
      userId,
    });
    res
      .status(200)
      .json({ success: true, blog, message: "Blog Added Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding blog" });
  }
});

//blogs/list
route.get("/list", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.json({ success: false, message: "User Not Found. Try logging in again..." });
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const offset = (page - 1) * perPage;
    const blogs = await blogsModel
      .find({ userId })
      .sort({ updatedAt: -1 })
      .limit(perPage)
      .skip(offset)
      .exec();

    const totalBlogs = await blogsModel.countDocuments({ userId }); //total blogs
    const totalPages = Math.ceil(totalBlogs / perPage);
    const hasNextPage = page < totalPages;
    const pagination = {
      currentPage: page,
      perPage,
      totalBlogs,
      totalPages,
      hasNextPage,
    };
    res.json({ success: true, blogs, pagination });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error Fetching Contact List" });
  }
});

//blogs/edit/:id
route.post("/edit/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.params.id;
    if (!userId) {
      return res.json({ success: false, message: "User not Found. Try logging in again..." });
    }

    const updatedBlog = await blogsModel.findByIdAndUpdate(
      { _id: id, userId },
      {
        title: req.body.title,
        description: req.body.description,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    res.status(200).json({success: true, message: "Blog Edited Successfully!", updatedBlog})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error editing blog" });
  }
});

//blogs/delete/:id
route.post('/delete/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const id = req.params.id;
        if(!userId) {
            return res.json({success: false, message: "User Not Found. Try logging in again..."})
        }

        await blogsModel.findByIdAndDelete({_id: id, userId});
        res.status(200).json({success: true, message: "Blog deleted Successfully"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error Deleting blog"});
    }
})

//blogs/:id
route.get('/:id', authMiddleware, async(req,res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;
    if(!userId) {
      return res.json({success: false, message: "User Not Found. Try logging in again..."});
    }

    const blog = await blogsModel.findOne({_id: id, userId});
    res.json({success: true, blog});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Failed to fetch blog"});
  }
})

module.exports = route;
