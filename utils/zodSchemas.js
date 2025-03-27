import { z } from 'zod';

export const SignUpSchema = z.object({
  name: z.string()
    .min(2, 'The name must be at least 2 characters long')
    .max(50, 'The name cannot be longer than 50 characters.')
    .regex(/^[a-zA-Z\s]+$/, 'The name cannot contain special characters'),
  email: z.string().email('Invalid email'),
  password: z.string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
    'The password must contain at least one lowercase letter, one uppercase letter and one number'
  ),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const PostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(60, 'Title must be at most 60 characters'),
  content: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Invalid image URL'),
});
