Conjunctivitis MobileNetV3 Notebook

Files:

- `conjunctivitis_mobilenetv3_training.ipynb` — Jupyter notebook training/evaluation pipeline (uses PyTorch and torchvision).

Quick start

1. Create a Python environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Start Jupyter in the repo root and open the notebook:

```bash
jupyter lab
# or
jupyter notebook
```

3. In the notebook, ensure the `DATA_DIR` variable points to the folder containing `healthy_eye/` and `infected_eye/` (default is `Dataset/`).

Notes

- The notebook uses `mobilenet_v3_small` as a lightweight classifier. Change model import to `mobilenet_v3_large`, `resnet18`, `resnet34`, or a custom CNN if desired.
- For object detection tasks (localizing findings), use a YOLOv8 workflow instead of this classification notebook.
