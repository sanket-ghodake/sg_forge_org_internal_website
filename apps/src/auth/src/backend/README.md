# ⚙️ Auth Backend Engine (`@forge/auth/backend`)

Central authentication, cryptographic operations, and GCP-style IAM policy evaluation engine.

## 🚀 Features
* **Asymmetric Ed25519 & JWKS**: Signs access tokens with private key; publishes public key via `/.well-known/jwks.json`.
* **Refresh Token Rotation (RTR)**: Single-use refresh token families with automated replay detection and instant family revocation.
* **GCP-Style Policy Evaluator**: Scoped permissions evaluation across the organizational hierarchy.
* **Password Complexity & Reset**: Enforces forced password setup on first login with entropy validation.
