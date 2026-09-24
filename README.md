# LaTeX.ly

Turns a photo of a handwritten or printed equation into LaTeX.

![LaTeX.ly with an uploaded equation image, the generated LaTeX and a rendered preview](docs/screenshots/result.webp)

## Features

- Upload a photo of an equation and get LaTeX back, with a rendered preview.
- Reads both handwriting and print.
- Symbol recognition from a CNN trained from scratch on 49k+ images of math symbols.
- Conversion history: your last 30 conversions stay in the browser with a thumbnail, ready to reopen, copy or delete.
- A Flask REST API behind a Next.js front end.

## Screenshots

| Upload | Contour detection per symbol |
| :-: | :-: |
| <img src="docs/screenshots/home.webp" alt="LaTeX.ly landing page with an upload card for equation images" width="400"> | <img src="docs/screenshots/contours.webp" alt="The equation E(x) = μ + 6σ with a green contour box drawn around each detected symbol" width="400"> |

## How it works

- OpenCV cleans the image, finds each symbol's contour and re-merges split glyphs like = and i.
- Each crop is normalised to 64×64 and classified by a PyTorch CNN, then assembled into LaTeX left to right.
- Five model versions trained on 49k+ symbol images: 24k generated across 25 fonts, 25k handwritten from CROHME.

## Stack

Python, PyTorch, OpenCV, NumPy, Flask, Next.js, React, Tailwind, Docker.

## Running locally

The quickest way is Docker, which runs the API on port 5000 and the app on [localhost:3000](http://localhost:3000):

```sh
docker compose up --build
```

`API_PORT` and `WEB_PORT` change the ports, for example `API_PORT=5001 docker compose up --build` if macOS AirPlay Receiver is holding port 5000. Keep `--build` after changing `API_PORT`, because the API URL is compiled into the front end.

Without Docker, you need Python 3.9 or newer and Node 18.18 or newer. Start the API on port 5000:

```sh
cd backend
pip install -r requirements.txt
python read.py
```

And the front end:

```sh
cd frontend
npm install
npm run dev
```

To train the model, also `pip install -r requirements_train.txt` and open `backend/train.ipynb`.

## What I learned

### Having a good dataset is important

- To build it, I
  - Created **1.6k original images** of 64 math symbols in 25 different fonts using Matplotlib
  - Applied minor transformations, creating **24k+ augmented images**
  - Sourced **25k handwritten math symbols** from CROHME
- Ultimately, I ended up with **49k+ unique images of math symbols**
- Throughout the process, I had to consistently find and create more data, without overfitting

![A sample of the generated symbol dataset](frontend/public/dataset.png)
Almost 50k images!

### Preprocessing data is key

- Data, especially handwritten math symbols, contain many inconsistencies
- With a convolutional neural network trained on consistent data, it is necessary to process data before usage
- For instance, my algorithm applies a Gaussian blur, adaptive thresholding, and a denoising filter amongst other things
- Without preprocessing data, the model's accuracy significantly decreases

<img src="frontend/public/prediction.png" alt="A preprocessed less-than sign, predicted as \lt with 100% confidence" width="180">

### How neural networks work

- With this project, I got to work with and understand how CNNs take in data and output results
- I learned:
  - How to structure a neural network for OCR tasks, balancing the number of layers and neurons for training
  - The importance of choosing the right activation functions (i.e. ReLU improved symbol detection, while softmax was useful for classification)
  - How to use SGD with mini-batches for efficiency and Cross Entropy Loss to improve accuracy

### It's okay to start over

- I originally started this project in November, deciding to use Tesseract, a pre-built open source OCR model
- However, the model was trained only on English letters, making math symbol recognition impossible
- After trying to train my own Tesseract model, the mix of its dataset and mine was not effective either
- I then experimented with TensorFlow and PyTorch, ultimately choosing the latter for its simplicity
- Having restarted my project, I spent many hours cultivating a dataset, which I then used to train my model
- But in my first four attempts, my model had surprisingly low accuracy
  - In the CROHME dataset, there were many inaccurate symbols
  - After slowly cleaning my dataset, 5 models later, I had created one that was **90%+ more accurate than Tesseract**
- Approaching and learning something new is scary. But I learned not to be afraid to restart, if it means getting on the right track
