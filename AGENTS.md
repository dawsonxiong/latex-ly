# latex-ly

LaTeX.ly — OCR that turns handwritten/printed math into LaTeX. CNN trained with PyTorch. Flask API + Next.js frontend.

This is **not** a Next-16 house app. Do not rewrite it onto pnpm/oxlint/Vercel without being asked. Frontend still uses npm (`frontend/package-lock.json`). Backend is Python.

## Commands

Frontend:

```sh
cd frontend
npm install
npm run dev
```

Backend:

```sh
cd backend
pip install -r requirements.txt
python read.py
```

Train extras: `pip install -r requirements_train.txt`.

## Stack

- Backend: Python 3.9+, PyTorch, OpenCV, Flask, NumPy
- Frontend: Next.js + React + Tailwind (legacy JS, `frontend/jsconfig.json`)
- Dataset: ~1.6k generated symbol images (see README)

## Hard rules

- Keep brand name **LaTeX.ly** in the README/description. Repo folder is `latex-ly`.
- Do not apply `next16-app` defaults here unless migrating the frontend on purpose.
