/**
 * Advanced Form Handling with React Hook Form + Zod
 * Type-safe forms with validation and error handling
 */

import { useForm, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * Common Validation Schemas
 */

// Login Form Schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register Form Schema
export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Product Form Schema
export const productSchema = z.object({
    name: z.string().min(3, 'Product name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be positive'),
    category: z.string().min(1, 'Category is required'),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
    featured: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Contact Form Schema
export const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^[0-9+\-\s()]+$/, 'Invalid phone number').optional(),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(20, 'Message must be at least 20 characters'),
    attachments: z.array(z.instanceof(File)).max(5, 'Maximum 5 files allowed').optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Profile Update Schema
export const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    avatar: z.string().url().optional(),
    company: z.string().optional(),
    website: z.string().url('Invalid URL').optional(),
    location: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Order Form Schema
export const orderSchema = z.object({
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
    })).min(1, 'At least one item is required'),
    shippingAddress: z.object({
        street: z.string().min(5, 'Street address is required'),
        city: z.string().min(2, 'City is required'),
        state: z.string().min(2, 'State is required'),
        zipCode: z.string().regex(/^[0-9]{4,6}$/, 'Invalid ZIP code'),
        country: z.string().min(2, 'Country is required'),
    }),
    billingAddress: z.object({
        street: z.string().min(5, 'Street address is required'),
        city: z.string().min(2, 'City is required'),
        state: z.string().min(2, 'State is required'),
        zipCode: z.string().regex(/^[0-9]{4,6}$/, 'Invalid ZIP code'),
        country: z.string().min(2, 'Country is required'),
    }).optional(),
    paymentMethod: z.enum(['card', 'paypal', 'bank_transfer', 'cash_on_delivery']),
    notes: z.string().max(500).optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;

/**
 * Custom Form Hook with Enhanced Features
 */
export function useAppForm<T extends FieldValues>(
    schema: z.ZodSchema<T>,
    defaultValues?: Partial<T>
) {
    const form = useForm<T>({
        resolver: zodResolver(schema as any) as any,
        defaultValues: defaultValues as any,
        mode: 'onBlur', // Validate on blur for better UX
    });

    return {
        ...form,

        // Helper to check if form has errors
        hasErrors: Object.keys(form.formState.errors).length > 0,

        // Helper to get first error message
        getFirstError: () => {
            const errors = form.formState.errors;
            const firstKey = Object.keys(errors)[0];
            return firstKey ? (errors[firstKey]?.message as string) : null;
        },

        // Reset form with new values
        resetWithValues: (values: Partial<T>) => {
            form.reset(values as any);
        },
    };
}

/**
 * Form Field Component Helpers
 */

// Get error message for a field
export function getFieldError(form: UseFormReturn<any>, fieldName: string): string | undefined {
    const error = form.formState.errors[fieldName];
    return error?.message as string | undefined;
}

// Check if field has error
export function hasFieldError(form: UseFormReturn<any>, fieldName: string): boolean {
    return !!form.formState.errors[fieldName];
}

// Get field state (touched, dirty, invalid)
export function getFieldState(form: UseFormReturn<any>, fieldName: string) {
    return {
        touched: form.formState.touchedFields[fieldName],
        dirty: form.formState.dirtyFields[fieldName],
        invalid: !!form.formState.errors[fieldName],
    };
}

/**
 * Example Usage:
 * 
 * const form = useAppForm(loginSchema, { email: '', password: '' });
 * 
 * const onSubmit = form.handleSubmit(async (data) => {
 *     await loginMutation.mutateAsync(data);
 * });
 * 
 * <form onSubmit={onSubmit}>
 *     <input {...form.register('email')} />
 *     {getFieldError(form, 'email') && <span>{getFieldError(form, 'email')}</span>}
 * </form>
 */
