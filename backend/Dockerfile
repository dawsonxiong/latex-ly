FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_ROOT_USER_ACTION=ignore

# Torch and torchvision come from the CPU-only index first, so no CUDA wheels or nvidia-*
# packages are ever candidates; the 2.0.1+cpu build then satisfies torch==2.0.1 below.
# On top of requirements.txt: torchvision and Pillow (imported by predict.py but not listed;
# versions from requirements_train.txt) and Werkzeug 2.x (Flask 2.2 breaks on Werkzeug 3).
# OpenCV is swapped for the headless build of the same version, which doesn't need libGL.
COPY requirements.txt .
RUN pip install --no-deps --index-url https://download.pytorch.org/whl/cpu torch==2.0.1 torchvision==0.15.2 \
 && sed 's/^opencv-python==/opencv-python-headless==/' requirements.txt > /tmp/requirements.txt \
 && pip install -r /tmp/requirements.txt torchvision==0.15.2 Pillow==9.4.0 Werkzeug==2.2.3 \
 && rm /tmp/requirements.txt

# Only the API code and the model predict.py loads
COPY read.py process.py predict.py ./
COPY models/LaTeXly_v5.pth models/

RUN useradd --create-home app
USER app

# The model is tiny; with one OpenMP thread per CPU (torch's default) each prediction
# took ~1.2 s in testing instead of ~5 ms, so pin it to a single thread
ENV FLASK_RUN_HOST=0.0.0.0 \
    FLASK_DEBUG=0 \
    OMP_NUM_THREADS=1

EXPOSE 5000
CMD ["python", "read.py"]
