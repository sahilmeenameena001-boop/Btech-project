"""
Download (but don't load) the IndicXlit checkpoints and rescoring dictionaries into the
folders the engines read at runtime. Run from IndicXlit-master/app during the Docker build.
"""
import os

from ai4bharat.transliteration.transformer import en2indic, indic2en
from ai4bharat.transliteration.transformer.base_engine import BaseEngineTransformer

for mod in (en2indic, indic2en):
    direction = mod.__name__.rsplit(".", 1)[-1]
    path = os.path.join(mod.F_DIR, "models", direction, mod.XLIT_VERSION)
    os.makedirs(path, exist_ok=True)
    # download_* never touch `self`, so call them without building an engine (which would
    # load ~GBs of dictionaries into RAM during the build).
    BaseEngineTransformer.download_models(None, path, mod.MODEL_DOWNLOAD_URL)
    if direction == "en2indic":  # xlit_server.py only rescores Roman -> native
        BaseEngineTransformer.download_dicts(None, path, mod.DICTS_DOWNLOAD_URL)
    print(f"{direction}: {sorted(os.listdir(path))}")
