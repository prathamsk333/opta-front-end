## Getting Started
site is live at : https://opta.prathamsk.me

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Opta Express Website Implementation
This README provides an overview of the features implemented in the Opta Express website.

Features Implemented
1. User Authentication (Signup & Login)
Integrated user authentication, including login and signup functionality, allowing users to securely access their accounts.
2. Location Entry (Mandatory on Signup)
Implemented a location prompt immediately upon sign-up, where users can either:
Manually enter their location, or
Use automatic location detection.
Location input is required initially but can be modified if needed.
3. Addresses Page
Created an Addresses page where users can view all saved addresses.
Display of recently used addresses based on the creation date of each address (no purchase data is used to determine this as purchase functionality isn't implemented).
4. Add New Address
Built an Add Address feature, allowing users to input and save new addresses, adhering to all necessary requirements provided.
5. Address Details and Update
Added a dedicated page to view address details.
Integrated update functionality so users can edit and save changes to existing addresses.

NOTE - I've used mapbox API and i'll be hosting this website soon
NOTE - The backend repository is seperate it's in https://github.com/prathamsk333/opta-back-end
