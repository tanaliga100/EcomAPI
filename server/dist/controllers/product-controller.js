"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_IMAGE = exports.DELETE_PRODUCT = exports.UPDATE_PRODUCT = exports.SINGLE_PRODUCT = exports.ALL_PRODUCTS = exports.CREATE_PRODUCT = void 0;
const http_status_codes_1 = require("http-status-codes");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const errors_1 = require("../errors");
const async_middleware_1 = require("../middlewares/async-middleware");
const product_model_1 = __importDefault(require("../models/product-model"));
// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, __dirname + "/uploads");
//   },
//   // Sets file(s) to be saved in uploads folder in same directory
//   filename: function (req, file, callback) {
//     callback(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage });
exports.CREATE_PRODUCT = (0, async_middleware_1.asyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, averageRating, color, category, featured, freeShipping, description, company, image, price, inventory, user, } = req.body;
    // ATTACH THE USERID INCHARGE TO THE PRODUCT THAT WILL BE CREATED
    req.body.user = req.user.userId;
    // AND THEN CREATE A PRODUCT HERE
    const product = yield product_model_1.default.create(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "PRODUCT CREATED", product });
}));
exports.ALL_PRODUCTS = (0, async_middleware_1.asyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.default.find({});
    const productsCount = (yield product_model_1.default.countDocuments({})) === 0;
    if (productsCount) {
        throw new errors_1.BadRequestError("No Products are on the database... Please create one");
    }
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: " ALL PRODUCTS", length: products.length, products });
}));
exports.SINGLE_PRODUCT = (0, async_middleware_1.asyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productId } = req.params;
    const product = yield product_model_1.default.findOne({ _id: productId });
    if (!product) {
        throw new errors_1.BadRequestError(`No product with such id : ${productId}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: " SINGLE PRODUCT", product });
}));
exports.UPDATE_PRODUCT = (0, async_middleware_1.asyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productId } = req.params;
    const product = yield product_model_1.default.findOneAndUpdate({ _id: productId }, req.body, { new: true, runValidators: true });
    if (!product) {
        throw new errors_1.BadRequestError(`No product with such id : ${productId}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: " UPDATED", product });
}));
exports.DELETE_PRODUCT = (0, async_middleware_1.asyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productId } = req.params;
    const product = yield product_model_1.default.findOneAndDelete({ _id: productId });
    if (!product) {
        throw new errors_1.BadRequestError(`No product with such id : ${productId}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "PRODUCT DELETED" });
}));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, callback) {
        const uploadDir = path_1.default.join(__dirname, "..", "public", "uploads");
        callback(null, uploadDir);
    },
    // Sets file(s) to be saved in uploads folder in same directory
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
exports.UPLOAD_IMAGE = (0, async_middleware_1.asyncMiddleware)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    upload.array("files")(req, res, function (err) {
        if (err) {
            return next(err);
        }
        console.log(req.files);
        console.log("REQUESTED");
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: " UPLOADEDDD", data: req.files });
    });
    console.log(req.files);
    console.log("REQUESTED");
    // res.status(StatusCodes.OK).json({ msg: " UPLOADEDDD", data: req.files });
}));
// export {
//  CREATE_PRODUCT,
//  ALL_PRODUCTS,
//  SINGLE_PRODUCT,
//  UPDATE_PRODUCT,
//  DELETE_PRODUCT,
//  UPLOAD_IMAGE
// }
// const form = formidable({ multiples: true });
// form.parse(req, (err: any, fields: any, files: any) => {
//   return res.json({ fields, files });
// });
// const { image } = req.files;
// console.log(req.files);
// // CHECK THE REQUEST BODY
// if (!req.files) {
//   throw new BadRequestError("No File Uploaded");
// }
// upload.array("File")(req, res, (err) => {
//   if (err) {
//     console.log(err);
//     return res.status(500).send(err);
//   }
//   console.log(req.file); // Contains information about the uploaded file
//   res.send("File uploaded successfully");
// });
