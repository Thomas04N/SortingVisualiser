# Sorting Algorithm Visualizer

An interactive **sorting algorithm visualizer** built with **React + TypeScript**, designed to demonstrate how common sorting algorithms work step-by-step through animated visualisations.

The project focuses on **clean architecture**, **separation of concerns**, and **professional version control practices**, using an event-driven approach to decouple algorithm logic from UI rendering.

---

## 🚀 Features

- Visualises sorting algorithms using animated bars
- Step-by-step playback with:
  - Start / Pause
  - Single-step execution
  - Adjustable speed
- Shuffleable input array with adjustable size
- Real-time statistics:
  - Comparisons
  - Swaps
  - Array writes (for merge sort)
- Algorithm selector
- Deterministic, replayable animations
- Containerised development environment (Docker Dev Containers)

---

## 📊 Implemented Algorithms

| Algorithm      | Type             | Notes |
|----------------|------------------|-------|
| Bubble Sort    | Comparison-based | Uses adjacent swaps |
| Insertion Sort | Comparison-based | Gradually builds sorted prefix |
| Merge Sort     | Divide & conquer | Uses array overwrites instead of swaps |

> **Note:**  
> Merge sort does not perform in-place swaps. Instead, it overwrites values during the merge step, which is why swaps remain zero and array writes are tracked separately.

---

## 🧠 Architecture Overview

### Event-driven animation model

- Each algorithm **does not manipulate UI state directly**
- Algorithms emit a sequence of **actions** (events), such as:
  - `compare`
  - `swap`
  - `overwrite`
  - `markSorted`
- A central **playback engine** replays these actions to update the UI

This design:
- Keeps algorithms pure and testable
- Makes it easy to add new algorithms
- Decouples computation from rendering

---

## 🛠️ Tech Stack

- **TypeScript**
- **React**
- **Vite**
- **Docker (Dev Containers)**
- **Git & GitHub**

---

## 🧑‍💻 Running the project locally

### Option 1: VS Code Dev Container (recommended)

**Prerequisites**
- Docker Desktop
- VS Code
- VS Code “Dev Containers” extension

Steps:
1. Clone the repository
2. Open it in VS Code
3. Run:  
   `Cmd + Shift + P → Dev Containers: Reopen in Container`
4. Inside the container terminal:
   ```bash
   npm run dev -- --host 0.0.0.0
