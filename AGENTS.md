# AGENTS.md

## Purpose
This file defines conventions for using AI assistance (e.g., ChatGPT) in this repository. It focuses on secure collaboration, consistent style, and reliable commit messages.

---

## Security & Environment

- **Never commit `.env` or other secret files.** Use `.env.example` as a reference for required variables.
- Always check `.gitignore` before starting new work. Typical entries include `node_modules/`, `*.pyc`, `__pycache__/`, `.env`, and build artifacts.
- The assistant cannot access external networks. If dependencies are missing, document them in `README.md` or a setup script rather than attempting online installation.

---

## Working with the Assistant

1. **Clear Requests**  
   - Formulate concise tasks. Example: “Add a REST endpoint `/api/vehicles` that serves GeoJSON.”
2. **Testing**  
   - If tests exist, ask the assistant to run them before committing. If they fail due to missing dependencies, it will report the failure.
3. **Partial Changes**  
   - Stage only related files. Avoid `git add .` if it would capture unrelated artifacts.
4. **Commit Messages**  
   - Use the format:

     ```
     git commit -m "✨ feat: Short summary
     - Key changes

     Lead Developer: Dusan Krajniker <dusan.krajniker@outlook.com>
     AI Assistant: ChatGPT"
     ```

5. **Pull Request Creation**  
   - After commits, run `make_pr` with a clear title and description. The assistant cannot push directly to GitHub.
6. **Documentation**  
   - Update `README.md` or `docs/` when behavior or setup changes.
7. **Be Explicit about Uncertainty**  
   - The assistant will state when it is unsure or when environment limits prevent actions.

---

## Coding Standards

- **SOLID**, **DRY**, **KISS**, and **YAGNI** principles apply.
- Follow language-specific naming conventions:
  - **JavaScript/TypeScript**: `auth-middleware.ts`, `getUserById`
  - **Python**: `auth_middleware.py`, `get_user_by_id`
- Keep functions small and single-purpose.
- Favor clear error messages and input validation.
- When adding new code, mirror the structure of existing folders. For example, source under `src/` and tests under `tests/`.

---

## Repository Context

- The project currently contains a demo dashboard in `visualization/modern-dashboard` with mock data and a TODO list outlining future tasks such as importing the SFOE dataset and providing an API endpoint.
- New features should integrate cleanly with this structure and the existing codebase.

---

Use this document as a reference when instructing the assistant or contributing to the codebase. Adjust as needed as the project grows.
