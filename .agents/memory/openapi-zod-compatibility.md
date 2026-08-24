---
name: OpenAPI and generated Zod compatibility
description: A codegen compatibility constraint between Orval output and the workspace's installed Zod version.
---

When adding numeric fields to the OpenAPI contract, prefer `number` unless integer validation is essential; the current Orval/Zod combination can emit `z.int()`, which is unavailable in the installed Zod runtime.

**Why:** Code generation can succeed while the chained library typecheck fails when generated validators use APIs from a newer Zod major version.

**How to apply:** After every OpenAPI change, run the API codegen command and the workspace library typecheck before relying on generated hooks.