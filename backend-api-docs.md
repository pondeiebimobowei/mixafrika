# Backend API Documentation

All endpoints follow a common response structure:
```json
{
  "success": boolean,
  "message": string,
  "data": any
}
```

## Base URL
The API is versioned. Current version is `v1`.

---

## Auth (`v1/auth`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/signup` | POST | `AuthSignupReq` | `{ token, refresh_token, user: User }` | Registers a new user. |
| `/login` | POST | `AuthLoginReq` | `{ token, refresh_token, user: User }` | Authenticates a user. |
| `/refresh` | POST | `{ refreshToken }` | `{ token, refreshToken }` | Refreshes the access token. |
| `/forgot-password` | POST | - | `[]` | Placeholder. |
| `/reset-password` | POST | - | `[]` | Placeholder. |

## User (`v1/user`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | GET | - | `User` (incl. `UserVerification`) | Retrieves profile + verification status. |
| `/` | PATCH | - | `[]` | Placeholder. |
| `/credit-score` | GET | - | `[]` | Placeholder. |
| `/verify-identity` | POST | `VerifyIdentityReq` + Files | `{ success: true }` | Submits identity verification. |

## Business (`v1/business`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | GET | - | `UserBusiness[]` (incl. `BusinessVerification`) | Retrieves user's business details. |
| `/` | POST | `SubmitBusinessReq` + Files | `UserBusiness` | Submits business registration/docs. |

## Wallet (`v1/wallet`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | GET | - | `Wallet` | Retrieves user's wallet balances. |
| `/transactions` | GET | - | `[]` | Placeholder. |
| `/` | POST | `{ amount: number }` | `{ wallet: Wallet, transaction: Transaction }` | Funds the user's wallet. |
| `/withdraw` | POST | - | `[]` | Placeholder. |

## Transactions (`v1/transactions`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | GET | Query: `type` | `Record<string, Transaction[]>` | Grouped transactions (by date string). |

## Loan Account (`v1/loan-account`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | GET | - | `LoanAccount` (incl. `Cluster`) | Retrieves user's loan account details. |
| `/repay` | POST | `{ days: number }` | `LoanAccount` | Processes a loan repayment. |

## Loan Repayment History (`v1/loan-repayment-history`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | GET | - | `RepaymentHistory[]` | Retrieves loan repayment history. |

## Investment (`v1/investment`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | GET | - | `Investment[]` | Retrieves available investments. |
| `/` | POST | - | - | Placeholder. |
| `/:investment_id` | GET | - | `Investment` | Detail view of a specific investment. |

## Savings (`v1/savings`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | GET | - | `Savings[]` | Retrieves user's savings plans. |
| `/` | POST | `CreateSavingsPlanReq` | `Savings` | Creates a new savings plan. |
| `/:savings_id` | PATCH | - | `[]` | Placeholder. |
| `/:savings_id` | GET | - | `Savings` (incl. `SavingsHistory[]`) | Detail view of a specific plan. |
| `/:savings_id/top-up` | POST | `{ amount: number, source: 'wallet' or 'card' }` | `Savings` | Tops up a savings plan. |
| `/:savings_id/history` | GET | - | `SavingsHistory[]` | Savings-specific history. |

## Funding (`v1/funding`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/apply` | POST | `FundingApplicationReq` + File | `FundingApplication` | Submits funding application. |

## Collection (`v1/collection`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | GET | - | `Collection[]` (incl. `Cluster[]`) | Retrieves all collections. |
| `/:collection_id` | GET | - | `Collection` (incl. `Cluster[]`) | Detail view of a collection. |

## Cluster (`v1/cluster`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/:cluster_id` | GET | - | `Cluster` | Detail view of a specific cluster. |

## Bank Card (`v1/bank-card`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | GET | - | `BankCard[]` | Retrieves registered bank cards. |

## Notification (`v1/notification`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | GET | - | `{ today, thisWeek, lastWeek, older }` | Grouped `Notification[]`. |
| `/:notification_id` | PATCH | - | `[]` | Marks notification as opened. |

## Settings (`v1/settings`)

| Endpoint | Method | Request Body Schema | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | GET | - | `Setting` | Retrieves user settings. |
| `/dark-mode` | PATCH | `{ enable_dark_mode: boolean }` | `[]` | Toggles dark mode. |
| `/email-notification` | PATCH | `{ enable_email_notification: boolean }` | `[]` | Toggles email notifications. |
| `/push-notification` | PATCH | `{ enable_push_notification: boolean }` | `[]` | Toggles push notifications. |

---

## Request Body Schemas

### AuthSignupReq
```json
{
  "first_name": "string",
  "last_name": "string",
  "phone_number": "string",
  "email": "string",
  "role": "investor | trader | agent",
  "password": "string"
}
```

### AuthLoginReq
```json
{
  "email": "string",
  "password": "string"
}
```

### VerifyIdentityReq
```json
{
  "id_type": "string",
  "id_number": "string",
  "id_image_front": "File",
  "id_image_back": "File"
}
```

### SubmitBusinessReq
```json
{
  "name": "string",
  "type": "string",
  "street_address": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "phone": "string",
  "cac_document": "File (optional)",
  "national_id_document": "File (optional)"
}
```

### CreateSavingsPlanReq
```json
{
  "name": "string",
  "target_amount": "string",
  "maturity_date": "string | null",
  "frequency": "daily | weekly | monthly",
  "source_type": "wallet | card",
  "source_id": "uuid",
  "type": "locked | flexible",
  "is_locked": "boolean"
}
```

### FundingApplicationReq
```json
{
  "user_business_id": "uuid",
  "amount": "string",
  "duration": "string",
  "repayment_plan": "string",
  "purpose": "string",
  "statement": "File"
}
```

---

## Core Data Structures (Models)

### User
```json
{
  "id": "uuid",
  "user_name": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "role": "investor | trader | agent",
  "credit_score": "number",
  "credit_score_status": "string",
  "is_email_verified": "boolean",
  "image": "string | null",
  "user_business": "UserBusiness (optional)"
}
```

### Wallet
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "available_balance": "number",
  "total_portfolio": "number",
  "active_investment_principal": "number"
}
```

### Transaction
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "type": "deposit | withdrawal | disbursement | investment | loan | repayment",
  "title": "string",
  "amount": "number",
  "category": "string",
  "status": "pending | completed | failed | paid | unpaid"
}
```

### Savings
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "string",
  "total_amount": "number",
  "target_amount": "number",
  "type": "locked | flexible",
  "frequency": "daily | weekly | monthly",
  "interest_rate": "number",
  "maturity_date": "ISOString | null",
  "is_locked": "boolean",
  "auto_save": "boolean"
}
```

### LoanAccount
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "disbursed_amount": "number",
  "repaid_amount": "number",
  "daily_repayment_amount": "number",
  "total_repayment_amount": "number",
  "status": "pending | approved | completed | rejected",
  "cluster": "Cluster"
}
```

### UserBusiness
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "string",
  "type": "string",
  "phone": "string",
  "street_address": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "verification": "BusinessVerification"
}
```

### Collection
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "total_traders": "string",
  "about": "string",
  "cover_image": "string",
  "roi": "number",
  "min_investment": "number",
  "city": "string",
  "state": "string",
  "country": "string",
  "cluster": "Cluster[]"
}
```

### Cluster
```json
{
  "id": "uuid",
  "collection_id": "uuid",
  "name": "string",
  "status": "string",
  "about": "string",
  "duration": "30 | 60 | 90",
  "roi": "number",
  "total_funds_raised": "number",
  "target_fundraising_amount": "number",
  "repayment": "string",
  "is_active": "boolean",
  "cover_image": "string",
  "start_date": "string",
  "end_date": "string",
  "description": "string"
}
```

---

## Admin APIs

### Admin Collections (`v1/admin/collection`)
| Endpoint | Method | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- |
| `/` | GET | `Collection[]` (Admin view) | Retrieves all collections. |

### Admin User (`v1/admin`)
| Endpoint | Method | Return Data Structure | Purpose |
| :--- | :--- | :--- | :--- |
| `/user` | GET | `User[]` | Retrieves all users. |
| `/user/:id` | GET | `[]` | Placeholder. |
