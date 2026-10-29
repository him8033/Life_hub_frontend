# Account Module

A modular, reusable account management system for Next.js applications with Django REST Framework backend.

## 📁 Structure

```
account/
├── app/(root)/dashboard/account/
│   ├── users/page.jsx           # User management page
│   ├── roles/page.jsx           # Role management page
│   └── status/page.jsx          # Status management page
├── components/dashboard/account/
│   ├── users/UserTable.jsx      # User table component
│   ├── roles/RoleTable.jsx      # Role table component
│   └── status/StatusTable.jsx   # Status table component
├── services/api/dashboard/account/
│   ├── users/
│   │   ├── userApi.js           # User API service
│   │   └── index.js             # User exports
│   ├── roles/
│   │   ├── roleApi.js           # Role API service
│   │   └── index.js             # Role exports
│   ├── status/
│   │   ├── statusApi.js         # Status API service
│   │   └── index.js             # Status exports
│   └── index.js                 # Main account exports
└── lib/validations/dashboard/account/
    ├── users/userValidation.js  # User validation schemas
    ├── roles/roleValidation.js  # Role validation schemas
    └── status/statusValidation.js # Status validation schemas
```

## 🚀 Usage in Your Project

### 1. Copy the Module

Copy the entire `account` folder structure to your project:

```bash
# Copy pages
cp -r account/app/(root)/dashboard/account your-project/app/(root)/dashboard/

# Copy components
cp -r account/components/dashboard/account your-project/components/dashboard/

# Copy services
cp -r account/services/api/dashboard/account your-project/services/api/dashboard/

# Copy validations
cp -r account/lib/validations/dashboard/account your-project/lib/validations/dashboard/

# Copy module files
cp account/modules/account/* your-project/modules/account/
```

### 2. Import and Use

#### Import from Main Index

```javascript
import {
  UsersPage,
  RolesPage,
  StatusesPage,
  UserTable,
  RoleTable,
  StatusTable,
  useGetUserListQuery,
  useCreateUserMutation,
  // ... all other exports
} from '@/modules/account';
```

#### Import Specific Module

```javascript
// User Management
import {
  useGetUserListQuery,
  useCreateUserMutation,
  UserTable,
} from '@/services/api/dashboard/account/users';

// Role Management
import {
  useGetRoleListQuery,
  useCreateRoleMutation,
  RoleTable,
} from '@/services/api/dashboard/account/roles';

// Status Management
import {
  useGetStatusListQuery,
  useCreateStatusMutation,
  StatusTable,
} from '@/services/api/dashboard/account/status';
```

### 3. Add Routes

Update your routes configuration:

```javascript
export const ROUTES = {
  DASHBOARD: {
    ACCOUNT: {
      USERS: "/dashboard/account/users",
      ROLES: "/dashboard/account/roles",
      STATUS: "/dashboard/account/status",
    },
  },
};
```

### 4. Add Navigation

Add to your sidebar navigation:

```javascript
{
  id: 'account',
  label: 'Account Management',
  icon: <FiUsers />,
  show: true,
  submenu: [
    {
      label: 'Users',
      icon: <FiUser />,
      href: ROUTES.DASHBOARD.ACCOUNT.USERS,
    },
    {
      label: 'Roles',
      icon: <FiShield />,
      href: ROUTES.DASHBOARD.ACCOUNT.ROLES,
    },
    {
      label: 'Statuses',
      icon: <FiActivity />,
      href: ROUTES.DASHBOARD.ACCOUNT.STATUS,
    },
  ],
}
```

## 🔧 Dependencies

### Required Packages

```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.x",
    "react": "^18.x",
    "zod": "^3.x",
    "react-icons": "^4.x"
  }
}
```

### Required Context Providers

Ensure your app has these context providers:

```javascript
import { ModalProvider } from '@/context/ModalContext';
import { SnackbarProvider } from '@/context/SnackbarContext';
import { ConfirmProvider } from '@/context/ConfirmContext';

function App({ children }) {
  return (
    <ModalProvider>
      <SnackbarProvider>
        <ConfirmProvider>
          {children}
        </ConfirmProvider>
      </SnackbarProvider>
    </ModalProvider>
  );
}
```

## 📡 API Requirements

The module expects a Django REST Framework backend with these endpoints:

### User Management
- `GET /api/v1/users/` - List users
- `POST /api/v1/users/create/` - Create user
- `GET /api/v1/users/{user_id}/` - Get user details
- `PUT /api/v1/users/{user_id}/edit/` - Edit user
- `PATCH /api/v1/users/{user_id}/status/` - Update user status
- `DELETE /api/v1/users/{user_id}/delete/` - Delete user

### Role Management
- `GET /api/v1/roles/` - List roles
- `POST /api/v1/roles/create/` - Create role
- `GET /api/v1/roles/{role_id}/` - Get role details
- `PUT /api/v1/roles/{role_id}/edit/` - Edit role
- `DELETE /api/v1/roles/{role_id}/delete/` - Delete role

### Status Management
- `GET /api/v1/statuses/` - List statuses
- `POST /api/v1/statuses/create/` - Create status
- `GET /api/v1/statuses/{userstatus_id}/` - Get status details
- `PUT /api/v1/statuses/{userstatus_id}/edit/` - Edit status
- `DELETE /api/v1/statuses/{userstatus_id}/delete/` - Delete status

## 🎨 Customization

### Styling

The module uses CSS Modules from common styles:
- `@/styles/common/TableStyles.module.css` - Table styling
- `@/styles/common/CommonListing.module.css` - Page layout styling

### API Configuration

Update the base URL in `@/services/api/baseQueryWithReauth.js`:

```javascript
export const baseQueryWithReauth = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/',
  // ... other config
});
```

## 🔐 Authentication

The module uses JWT authentication via `baseQueryWithReauth`. Ensure your backend:

1. Accepts JWT tokens in `Authorization: Bearer <token>` header
2. Returns 401 when token expires
3. Provides `/auth/token/refresh/` endpoint for token refresh

## 📝 Validations

The module uses Zod for form validation. Schemas are exported for reuse:

```javascript
import { createUserSchema } from '@/lib/validations/dashboard/account/users/userValidation';

// Use with your form library
const formData = createUserSchema.parse(myFormData);
```

## 🧪 Testing

The module is designed to be testable. Each component and service can be tested independently:

```javascript
// Example test
import { render, screen } from '@testing-library/react';
import { UserTable } from '@/components/dashboard/account/users/UserTable';

test('renders user table', () => {
  render(<UserTable users={mockUsers} />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

## 📦 Migration Guide

If migrating from the old structure:

1. Update imports from:
   ```javascript
   import { useGetUserListQuery } from '@/services/api/authApi';
   ```
   to:
   ```javascript
   import { useGetUserListQuery } from '@/services/api/dashboard/account/users/userApi';
   ```

2. Update routes from:
   ```javascript
   USERS: "/dashboard/users"
   ```
   to:
   ```javascript
   USERS: "/dashboard/account/users"
   ```

3. Update component imports from:
   ```javascript
   import UserTable from '@/components/roles/RoleTable';
   ```
   to:
   ```javascript
   import RoleTable from '@/components/dashboard/account/roles/RoleTable';
   ```

## 🤝 Contributing

When making changes to this module:

1. Keep the modular structure
2. Export everything from index files
3. Update this README
4. Test all CRUD operations
5. Ensure backward compatibility

## 📄 License

This module is part of the Life Hub project.
