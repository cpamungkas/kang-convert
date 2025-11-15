# Kang Convert

A sleek, in-memory PDF to image converter that respects user privacy by processing files entirely in the browser.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cpamungkas/kang-convert)

Aura Convert is a minimalist, high-performance web application designed for converting PDF documents into high-quality JPG or PNG images. The core principle is privacy and speed: all file processing happens directly in the user's browser using the robust `pdfjs-dist` library, powered by WebAssembly. No files are ever uploaded to a server, ensuring complete data confidentiality and eliminating server-side processing costs.

The application is a single-page app (SPA) running entirely on the client-side, making it exceptionally fast and perfect for deployment on modern edge networks like Cloudflare.

## Key Features

-   **100% Client-Side:** All PDF processing is done in your browser. Files never leave your machine.
-   **Privacy First:** No data is uploaded or stored on any server.
-   **High-Speed Conversion:** Leverages WebAssembly for near-native performance.
-   **Multiple Formats:** Convert PDF pages to high-quality JPG or PNG images.
-   **Instant Previews:** See a preview of every converted page immediately.
-   **Individual Downloads:** Download specific pages as images with a single click.
-   **Modern & Responsive UI:** A clean, intuitive, and beautiful interface that works flawlessly on any device.

## Technology Stack

-   **Frontend:** React (Vite), TypeScript
-   **Styling:** Tailwind CSS, shadcn/ui
-   **PDF Processing:** `pdfjs-dist`
-   **Animations:** Framer Motion
-   **Icons:** Lucide React
-   **State Management:** Zustand
-   **Deployment:** Cloudflare Pages / Workers

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/aura-convert.git
    cd aura-convert
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Run the development server:**
    ```sh
    bun run dev
    ```

The application will be available at `http://localhost:3000`.

## Usage

1.  Open the application in your web browser.
2.  Drag and drop a PDF file onto the designated area, or click to select a file from your computer.
3.  Choose your desired output image format (PNG or JPG).
4.  Click the "Convert" button.
5.  Wait for the conversion to complete. The process is very fast, but depends on the size and complexity of your PDF.
6.  Image previews for each page will appear in a grid.
7.  Click the "Download" button on any image to save it to your device.

## Development

The core application logic is contained within `src/pages/HomePage.tsx`. This project is a pure Single Page Application (SPA), and all functionality is handled on the client-side.

-   `src/pages/HomePage.tsx`: The main component containing the UI and conversion logic.
-   `src/components/ui/`: Contains the reusable UI components from shadcn/ui.
-   `public/`: Static assets, including the `pdf.worker.js` required by `pdfjs-dist`.

## Deployment

This application is optimized for deployment on serverless platforms like Cloudflare Pages.

### One-Click Deploy

You can deploy this project to your own Cloudflare account with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cpamungkas/kang-convert)

### Manual Deployment with Wrangler

1.  **Login to Cloudflare:**
    ```sh
    bunx wrangler login
    ```

2.  **Build the project:**
    ```sh
    bun run build
    ```

3.  **Deploy to Cloudflare:**
    ```sh
    bun run deploy
    ```

Wrangler will build and deploy your application, providing you with a live URL.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
