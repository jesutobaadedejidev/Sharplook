import { v2 as cloudinary } from "cloudinary";
import serviceModel from "../models/serviceModel.js";

//function for add service
const addService = async (req, res) => {
  try {
    const { name, price } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    //to store the images on cloudinary; as we can't store images on the database, then we get a url and store it on the database.
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const serviceData = {
      name,
      price,
      image: imagesUrl,
      date: Date.now(),
    };

    console.log(serviceData);
    const service = new serviceModel(serviceData);
    await service.save();

    res.json({ success: true, message: "Service Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//function for list services
const listServices = async (req, res) => {
  try {
    const services = await serviceModel.find({});
    res.json({ success: true, services });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//function for removing service
const removeService = async (req, res) => {
  try {
    await serviceModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Service removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//function for single service info
const singleService = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const service = await serviceModel.findById(serviceId);
    res.json({ success: true, service });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { listServices, addService, removeService, singleService };
