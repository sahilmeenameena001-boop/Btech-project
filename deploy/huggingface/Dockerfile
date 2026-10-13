# IndicXlit transliteration API as a Hugging Face Docker Space (CPU).
#
# The Space repo only needs this Dockerfile and the README.md next to it; the backend
# code is cloned from GitHub at build time. Model weights (~1 GB) are downloaded during
# the build so the Space starts without re-downloading after every restart.

# fairseq 0.12.2 ships prebuilt Linux wheels only up to CPython 3.8, so 3.8 avoids a
# from-source C++ build.
FROM python:3.8-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends git \
 && rm -rf /var/lib/apt/lists/*

# Spaces run the container as UID 1000.
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=7860
WORKDIR $HOME

# omegaconf 2.0.6 (required by fairseq) has metadata that pip >= 24.1 rejects.
RUN pip install --user "pip<24.1"

# CPU-only PyTorch first, so fairseq doesn't pull the multi-GB CUDA build from PyPI.
# 2.4.1 is the newest release with Python 3.8 wheels.
RUN pip install --user --index-url https://download.pytorch.org/whl/cpu \
      torch==2.4.1+cpu torchaudio==2.4.1+cpu

# numpy < 1.24: fairseq 0.12.2 predates numpy's removal of np.float (used in its CRF layer).
RUN pip install --user \
      numpy==1.23.5 \
      fairseq==0.12.2 \
      hydra-core==1.0.7 \
      omegaconf==2.0.6 \
      flask==3.0.3 \
      flask-cors==5.0.0 \
      flask-limiter==3.8.0 \
      gevent==24.2.1 \
      indic-nlp-library==0.92 \
      pydload==1.0.9 \
      ujson==5.10.0 \
      tqdm \
      regex
# Only urduhack's regex normaliser is used; its dependencies (TensorFlow, Click 7) are not needed.
RUN pip install --user --no-deps urduhack==1.1.1

# Backend code. Bump CACHE_BUST (or use "Factory rebuild" in the Space settings) to pick up new commits.
ARG REPO_URL=https://github.com/sahilmeenameena001-boop/Btech-project.git
ARG REPO_REF=main
ARG CACHE_BUST=1
RUN git clone --depth 1 --branch "$REPO_REF" "$REPO_URL" src
WORKDIR $HOME/src/IndicXlit-master/app

# Download (but don't load) the model checkpoints and rescoring dictionaries into the same
# folders the engines look in at runtime.
RUN PYTHONPATH=. python ../../deploy/huggingface/download_models.py

EXPOSE 7860
CMD ["python", "start_server.py"]
