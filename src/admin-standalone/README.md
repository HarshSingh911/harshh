# TripYeah — Standalone Admin & Extranet Portal (MakeMyTrip Style)

Yeh MakeMyTrip Extranet jaisa **completely separate project** hai jo public website se 100% alag chalta hai.

---

### VS Code mein naya project kaise banayein (Sirf 2 Minute):

1. **VS Code ka terminal open karein** aur yeh commands chalayein:
   ```bash
   # 1. Naya React + TypeScript project banayein
   npm create vite@latest tripyeah-admin -- --template react-ts

   # 2. Folder ke andar jayein
   cd tripyeah-admin

   # 3. Dependencies install karein
   npm install
   npm install lucide-react
   npm install -D tailwindcss @tailwindcss/vite
   ```

2. **Tailwind CSS enable karein:**
   - `vite.config.ts` mein:
     ```ts
     import tailwindcss from '@tailwindcss/vite';
     import react from '@vitejs/plugin-react';
     import { defineConfig } from 'vite';

     export default defineConfig({
       plugins: [react(), tailwindcss()],
     });
     ```
   - `src/index.css` mein:
     ```css
     @import "tailwindcss";
     ```

3. **Code paste karein:**
   - Apne `tripyeah-admin/src/App.tsx` file ka sara code delete karein aur hamari `/src/admin-standalone/App.tsx` file ka poora code paste kar dein.

4. **Run karein:**
   ```bash
   npm run dev
   ```
   Aapka MakeMyTrip-grade Admin Portal `http://localhost:5173` (ya `5174`) par chal jayega!

---

### Is Standalone Admin mein kya kya features hain:

1. **Corporate Staff SSO Login:**
   - Corporate Email (`ops.admin@tripyeah.com`)
   - Role selector (Super Admin / Flight Desk / Hotel Desk / Finance Ops)
   - Passcode (Demo PIN: `1234`)

2. **Passenger PNR & Booking Desk:**
   - Real-time PNR table with passenger email, phone, travel dates, collected fare
   - PNR Inspector modal
   - Actions: Confirm, Cancel, Issue Instant Refund

3. **Dynamic Fares & Seat Quota Controller:**
   - Live airline fares (`DEL → GOI`, `BOM → BLR`)
   - 1-click **Modify Fare** & **Edit Seat Quota**
   - Automatic `Sold Out` status jab seats 0 ho jayein

4. **Promotional Coupons Vault:**
   - `TRIPYEAH40`, `STAY60`, `HOLIDAY50`, `FESTIVE25`
   - "Create New Coupon" modal: code, category, discount %, max cap
   - 1-click toggle / delete coupon

5. **Customer Support Escalations:**
   - Priority-based ticket queue (High / Medium / Low)
   - One-click Resolve / Re-open
