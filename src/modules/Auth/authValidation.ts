import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().min(1, { message: 'Email is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
});



export const registerUserValidationSchema = z.object({
   body: z.object({
      firstName: z.string().trim().min(1, { message: "First name is required" }),
      lastName: z.string().trim().min(1, { message: "Last name is required" }),
  
      email: z.string().trim().email("Invalid email address"),
 
      password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    
 
  }),
   })


export const editProfileSchema = z.object({
  body:z.object({
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    bio: z.string().max(500, "Bio can't be longer than 500 characters").optional(),
  })
});






export const AuthValidation = {
  loginValidationSchema,
  registerUserValidationSchema,
  editProfileSchema

  
};
