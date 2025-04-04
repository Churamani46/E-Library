import { z } from "zod";
import genres from "./utilities/genres";

export const reviewSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "review should be at least 1 characters long" }),
  rating: z.preprocess(
    (value) => (isNaN(value) ? 0 : value),
    z.coerce.number().int().gte(1).lte(5)
  ),
});

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_PDF_TYPE = "application/pdf";

export const bookSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  
  image: z
    .any()
    .refine((file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024), {
      message: "Image must be less than 5MB",
    })
    .refine((file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)), {
      message: "Only JPEG, JPG, PNG, and WEBP formats are allowed",
    })
    .optional(),

  book_file: z
    .any()
    .refine((file) => !file || (file instanceof File && file.size <= 10 * 1024 * 1024), {
      message: "PDF must be less than 10MB",
    })
    .refine((file) => !file || (file instanceof File && file.type === ACCEPTED_PDF_TYPE), {
      message: "Only PDF files are allowed",
    })
    .optional(),

  author: z.string().trim().min(3, { message: "Author name must be at least 3 characters long" }),
  genre: z.array(z.enum(genres)).min(1, { message: "At least one genre is required" }),

  // book_url: z.string().trim().min(1, { message: "URL is required" }),

  year_published: z.preprocess(
    (value) => (isNaN(value) ? 0 : value),
    z.coerce
      .number()
      .int()
      .gte(618, { message: "Year published must be at least 618" })
      .lte(new Date().getFullYear(), { message: "Year cannot be in the future" })
      .optional()
  ),
});


export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
