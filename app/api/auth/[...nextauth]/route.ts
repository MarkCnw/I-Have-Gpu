// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth" // Import จากไฟล์ auth.ts ที่เราสร้างตะกี้
export const { GET, POST } = handlers