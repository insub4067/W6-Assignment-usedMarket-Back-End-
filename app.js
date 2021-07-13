const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Product = require("./models/product");

const app = express();
const router = express.Router();

mongoose.connect("mongodb://localhost:27017/usedMarket", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// 이미지 저장공간 지정
const storage = multer.diskStorage({

    destination: function(req, file, cb) {
        cb(null, "./images/product");


    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

// 이미지 파일 형식 체크
const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null, true);
    }else{
        cb(new Error("이미지 파일 형식이 맞지 않습니다"), false);
    }
};

// 이미지 저장 세팅
const upload = multer({ 
    storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

//본인확인
router.get('/product/auth/:id', async(req, res) => {

    const { id } = req.params;
    const { authPassword } = req.body;

    const result = await Product.findById(id)
    const dbPassword = result.password

    if( authPassword !== dbPassword ){
        res.status(400).send({
            errorMessage: "사용자가 일치하지 않습니다"
        })
        return
    }else{
        res.status(200).send({})
    }

});

//게시글 전체조회
router.get("/product", async(req, res) => {


    const result = await Product.find().sort("-createdAt");
    res.json({ result });
    
});

//게시글 등록
router.post("/product/post", upload.single("image"), async(req,res) => {

    const { name, password, confirmPassword, title, content, price } = req.body;

    const productImage = req.file.path

    const product = new Product({ name, password, title, content, price, productImage });

    if( password !== confirmPassword){
        res.send(400).send({
            errorMessage: "비밀번호가 일치하지 않습니다"
        })
        return
    }else{
        await product.save();
        res.status(200).send({});
    };

});

//게시글 detail 조회
router.get("/product/:id", async(req, res) => {

    const { id } = req.params;

    const result = await Product.findById(id)
    res.status(200).send({});

});

//게시글 수정
router.post("/product/edit/:id", upload.single("image"), async(req, res) => {

    const productImage = req.file.path
    const { id } = req.params;
    const { title, content, price } = req.body;

    await Product.findByIdAndUpdate(id, { title, content, price, productImage })
    res.status(200).send({});

});

//게시글 삭제
router.delete("/product/delete/:id", async(req, res) => {

    const { id } = req.params

    await Product.findByIdAndDelete(id)
    res.status(200).send({});

});


app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.json());
app.use("/images", express.static("images"));

app.listen(8080, () => {
    console.log("서버가 요청을 받을 준비가 됐어요");
  });
