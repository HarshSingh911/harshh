# Security Specification & "Dirty Dozen" Threat Model

## 1. Data Invariants

1. **User Identity Invariant**: A user document at `/users/{userId}` can only be created or modified if `request.auth.uid == userId`. A non-admin user can NEVER elevate their role to `'admin'`.
2. **Trip Booking Invariant**: A trip booking at `/trips/{tripId}` can only be created by an authenticated user where `incoming().userId == request.auth.uid`. A traveller cannot view, modify, or cancel other travellers' trips.
3. **Property Ownership Invariant**: A property listing at `/properties/{propertyId}` must set `incoming().ownerId == request.auth.uid`. Only the owner or an admin can update listing details, and standard users cannot approve their own listings (must remain `'pending'` unless updated by admin).
4. **Admin Protection Invariant**: The `/admins/{adminId}` collection is read-only for verified admins and closed to all client-side writes. Privileges cannot be self-granted.
5. **Customer Support Inquiry Invariant**: Inquiries at `/inquiries/{inquiryId}` must be authored by the submitting user (`userId == request.auth.uid`). Users can only read their own inquiries; only admins can list all inquiries and change ticket status to 'Resolved'.
6. **Denial-of-Wallet Prevention**: All text fields are constrained by `.size()` upper bounds to block megabyte-scale payload injections. All path IDs are bounded by `isValidId()`.
7. **Default-Deny Catch-All**: Any unspecified path in the database is denied access by default.

---

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1 (Privilege Escalation on User Profile)**:
   Attempt by regular user `uid-101` to create `/users/uid-101` with `role: "admin"`.
   *Target*: `/users/uid-101`
   *Payload*: `{ "id": "uid-101", "email": "traveller@gmail.com", "role": "admin" }`
   *Expected*: `PERMISSION_DENIED`

2. **Payload 2 (User Identity Spoofing)**:
   Attempt by user `uid-101` to write to another user's profile `/users/uid-999`.
   *Target*: `/users/uid-999`
   *Payload*: `{ "id": "uid-999", "email": "victim@gmail.com", "role": "user" }`
   *Expected*: `PERMISSION_DENIED`

3. **Payload 3 (Orphaned / Stolen Booking Creation)**:
   Attempt by user `uid-101` to create a booking claiming `userId: "uid-victor"`.
   *Target*: `/trips/trip-steal-1`
   *Payload*: `{ "id": "trip-steal-1", "userId": "uid-victor", "pnr": "TY-9999", "category": "flights", "serviceTitle": "IndiGo 6E", "route": "DEL-BOM", "travelDate": "2026-11-01", "fareInr": 5000, "status": "Confirmed" }`
   *Expected*: `PERMISSION_DENIED`

4. **Payload 4 (Unauthenticated Booking Scraping)**:
   Attempt by an unauthenticated guest (`auth == null`) to list documents from `/trips`.
   *Target*: `/trips` (list)
   *Expected*: `PERMISSION_DENIED`

5. **Payload 5 (Cross-User Trip Snooping)**:
   Attempt by user `uid-101` to read trip `/trips/trip-secret-404` owned by `uid-202`.
   *Target*: `/trips/trip-secret-404`
   *Expected*: `PERMISSION_DENIED`

6. **Payload 6 (Unauthorized Trip Cancellation / Tampering)**:
   Attempt by user `uid-101` to modify or cancel another user's confirmed booking.
   *Target*: `/trips/trip-202-booking`
   *Payload*: `{ "status": "Cancelled" }`
   *Expected*: `PERMISSION_DENIED`

7. **Payload 7 (Denial-of-Wallet Long String Injection on Trip)**:
   Attempt by user `uid-101` to create a trip with an oversized 2MB `serviceTitle` string.
   *Target*: `/trips/trip-dos-1`
   *Payload*: `{ "id": "trip-dos-1", "userId": "uid-101", "pnr": "TY-DOS", "serviceTitle": "A".repeat(50000), ... }`
   *Expected*: `PERMISSION_DENIED`

8. **Payload 8 (Self-Approval of Property Listing)**:
   Attempt by property host `uid-101` to register a new property directly with `status: "approved"` bypassing admin moderation.
   *Target*: `/properties/prop-sneak-1`
   *Payload*: `{ "id": "prop-sneak-1", "ownerId": "uid-101", "name": "Fake Hotel", "category": "hotel", "city": "Goa", "country": "India", "basePriceInr": 3000, "status": "approved" }`
   *Expected*: `PERMISSION_DENIED`

9. **Payload 9 (Host Property Hijacking)**:
   Attempt by user `uid-999` to edit or overwrite property `/properties/prop-host-5` owned by host `uid-101`.
   *Target*: `/properties/prop-host-5`
   *Payload*: `{ "basePriceInr": 1 }`
   *Expected*: `PERMISSION_DENIED`

10. **Payload 10 (Direct Write to Admin Access Collection)**:
    Attempt by regular authenticated user to insert their own UID into `/admins/{request.auth.uid}`.
    *Target*: `/admins/uid-101`
    *Payload*: `{ "id": "uid-101", "email": "hacker@test.com" }`
    *Expected*: `PERMISSION_DENIED`

11. **Payload 11 (Support Ticket Cross-Read)**:
    Attempt by user `uid-101` to list or read private support inquiries submitted by other customers.
    *Target*: `/inquiries/inq-private-777`
    *Expected*: `PERMISSION_DENIED`

12. **Payload 12 (Path Injection / ID Poisoning)**:
    Attempt to write a document using an invalid/poisoned ID containing illegal path characters `../..//etc`.
    *Target*: `/trips/bad..id$$`
    *Expected*: `PERMISSION_DENIED`
