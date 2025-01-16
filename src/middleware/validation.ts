import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name must be string"),
  body("number").isString().notEmpty().withMessage("Number must be string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("AddressLine1 must be string"),
  handleValidationErrors,
];

export const validateMyRoomRequest = [
  body("pgName").isString().notEmpty().withMessage("Pg Name must be string"),
  body("imageUrl").isArray().notEmpty().withMessage("imageUrl must be array"),
  body("location").isString().notEmpty().withMessage("location must be string"),
  body("rent").isNumeric().notEmpty().withMessage("rent must be number"),
  body("contactNumber").isNumeric().notEmpty().withMessage("Contact number must be number"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("description must be string"),
];
