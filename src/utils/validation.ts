import { z } from 'zod';

export type ContactFormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export const contactSchema = z.object({
  name: z.string().min(2, { message: 'Họ và tên phải có ít nhất 2 ký tự' }),
  phone: z
    .string()
    .min(8, { message: 'Số điện thoại không hợp lệ' })
    .regex(/^[0-9+\-()\s]+$/, { message: 'Số điện thoại không hợp lệ' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  message: z.string().min(10, { message: 'Vui lòng nhập nội dung tối thiểu 10 ký tự' }),
});

