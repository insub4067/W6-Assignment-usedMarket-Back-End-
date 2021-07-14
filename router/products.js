const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Product = require("../models/product");
const authMiddleware = require("../middlewares/auth-Middleware");
const registerValidator = require("../middlewares/registerValidater")
const fs = require("fs");
const app = express();
const router = express.Router();


// 이미지 저장공간 지정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./images/product");
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    },
  });
  
  // 이미지 파일 형식 체크
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("이미지 파일 형식이 맞지 않습니다"), false);
    }
  };
  
  // 이미지 저장 세팅
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
  });
  
//본인확인
router.post("/product/auth/:id", async (req, res) => {
    const { id } = req.params;
    const { authPassword } = req.body;
  
    const result = await Product.findById(id);
    const dbPassword = result.password;
  
    if (authPassword !== dbPassword) {
      res.status(400).send({
        errorMessage: "사용자가 일치하지 않습니다",
      });
      return;
    } else {
      res.status(200).send({});
    }
  });
  
  //게시글 전체조회
  router.get("/product", async (req, res) => {
    const result = await Product.find().sort("-createdAt");
    console.log(result[0]["productId"]);
    result.id = result.productId;
    res.json({ result });
  });
  
  //게시글 등록
  router.post("/product/post", upload.single("image"), async (req, res) => {
    const { name, title, content, price } = req.body;
    // password, confirmPassword, 
    const productImage = req.file.path;
  
    const product = new Product({
      name,
      // password,
      title,
      content,
      price,
      productImage,
    });
  
    await product.save();
      res.status(200).send({});

    // if (password !== confirmPassword) {
    //   res.send(400).send({
    //     errorMessage: "비밀번호가 일치하지 않습니다",
    //   });
    //   return;
    // } else {
      
    // }
  });
  
  //게시글 detail 조회
  router.get("/product/:id", async (req, res) => {
    const { id } = req.params;
  
    const result = await Product.findById(id);
    res.status(200).send({ result });
  });
  
  //게시글 수정
  router.put("/product/edit/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const { title, content, price } = req.body;
    const Image = req.file;
  
    if (Image) {
      const post = await Product.findById({ _id: id });
      console.log(post);
  
      try {
        // 이미지 수정 시 , 기존에 있던 파일을 삭제하고 업데이트함
        if (post.productImage) {
          fs.unlinkSync(`./${post.productImage}`);
        }
        const productImage = req.file.path;
        await Product.findByIdAndUpdate(id, {
          title,
          content,
          price,
          productImage,
        });
      } catch (error) {
        console.log("파일 삭제 Error 발생");
        res.status(401).send({ result: "게시물을 수정할 수 없습니다" });
      }
    }
  
    await Product.findByIdAndUpdate(id, { title, content, price });
    res.status(200).send({});
  });
  
  //게시글 삭제
  router.delete("/product/delete/:id", async (req, res) => {
    const { id } = req.params;
  
    await Product.findByIdAndDelete(id);
    res.status(200).send({});
  });
  

module.exports = router;
