import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
    body("numberOfRooms")
      .notEmpty()
      .isNumeric()
      .withMessage("Number of rooms is required and must be a number")
      .isInt({ min: 1 })
      .withMessage("Number of rooms must be at least 1"),
    body("bedsPerRoom") // Add validation for bedsPerRoom
      .notEmpty()
      .isNumeric()
      .withMessage("Beds per room is required and must be a number")
      .isInt({ min: 1 })
      .withMessage("Beds per room must be at least 1"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      const imageUrls = await uploadImages(imageFiles);

      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;
      newHotel.numberOfRooms = parseInt(req.body.numberOfRooms);
      newHotel.bedsPerRoom = parseInt(req.body.bedsPerRoom);

      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).send(hotel);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels.map((hotel) => hotel.toObject()));
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get("/bookings", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      userId: req.userId,
    });

    const hotelBookings = hotels.map((hotel) => {
      const bookingsWithHotel = hotel.bookings.map((booking) => {
        return {
          ...(booking as any).toObject(),
          hotelName: hotel.name,
        };
      });
      return bookingsWithHotel;
    }).flat();

    res.status(200).json(hotelBookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const hotelId = req.params.hotelId;
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();
      updatedHotel.numberOfRooms = parseInt(req.body.numberOfRooms);
      updatedHotel.bedsPerRoom = parseInt(req.body.bedsPerRoom);
      updatedHotel.pricePerNight = parseFloat(req.body.pricePerNight);
      updatedHotel.starRating = parseInt(req.body.starRating);
      updatedHotel.facilities = req.body.facilities;

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const newImageFiles = req.files as Express.Multer.File[];
      const updatedImageUrls = await uploadImages(newImageFiles);

      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(req.body.imageUrls || []),
      ];

      await hotel.save();
      res.status(201).json(hotel);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;
