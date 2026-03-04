# Attribution and Third-Party Licenses

PitchBridge uses open-source and third-party software. This file lists the main dependencies and their licenses where applicable. Full license texts are in the respective packages inside `node_modules` (and in their upstream repositories).

---

## Project License

PitchBridge is released under the **MIT License**.  
Copyright (c) 2026 NadiaTeta.  
See [LICENSE](LICENSE) in the repository root.

---

## License Abbreviations

- **MIT** – Permissive; use, modify, distribute with minimal conditions (see [choosealicense.com](https://choosealicense.com/licenses/mit/)).
- **ISC** – Functionally similar to MIT.
- **Apache-2.0** – Permissive with patent grant and notice requirements.
- **BSD-2-Clause** – Permissive; retain copyright notice.

Exact terms are in each package’s `license` field and in the `node_modules/<package>/LICENSE` (or equivalent) file.

---

## Assets and Media

- **Unsplash:** Background images used in the app may be subject to [Unsplash License](https://unsplash.com/license) (free use with optional attribution).
- **Icons:** Lucide React (ISC), MUI Icons (MIT).
- **Fonts:** Any custom or third-party fonts should be attributed in the app or in this file if required by their license.

---

## Updates

Dependency list and versions were accurate at the time of writing. For the current list, run:

```bash
# Frontend
cd frontend && npm list --depth=0

# Backend
cd backend && npm list --depth=0
```

To inspect a specific package’s license:

```bash
npm info <package-name> license
```

---

**Last updated:** 2026 (structure and dependencies as of project state).
