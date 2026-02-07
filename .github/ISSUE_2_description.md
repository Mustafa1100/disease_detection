Observed 100% accuracy / precision / recall in `notebooks/conjunctivitis_mobilenetv3_training.ipynb`

Summary
-------
While evaluating the MobileNetV3 model in `conjunctivitis_mobilenetv3_training.ipynb` the reported accuracy / precision / recall values are exactly 1.0. This is almost always a sign of a problem in the evaluation setup or an extremely small/easy validation set, rather than a perfectly generalizable model.

Likely causes
-------------
- Small or imbalanced validation set: the notebook uses an 80/20 split. If the dataset is small, 20% may be only a handful of images (or even a single batch), producing misleading metrics.
- Data leakage: identical images or duplicated files present in both training and validation sets, or evaluation performed on the training set by mistake.
- Overfitting: training the full pretrained backbone on a tiny dataset (no freezing or early stopping) can memorize examples and give perfect validation results if validation is too small or leaked.
- Label issues: corrupted or constant labels in validation (e.g. all zeros) would make trivial predictions appear perfect for some metrics.
- Metric mis-calculation: if predictions / targets arrays are misaligned, or if rounding/truncation leads to degenerate metrics.

Evidence in the notebook (quick notes)
-------------------------------------
- The notebook uses `random_split` on `ImageFolder` and then rewraps the validation subset to apply `val_transform`. This is reasonable but worth verifying the resulting `train`/`val` indices and sizes.
- The model is fine-tuned end-to-end (no initial freeze) which increases overfitting risk for small data.

Recommended checks (quick code snippets you can run)
---------------------------------------------------
1) Confirm validation set size and per-class counts

```python
# run in the notebook after dataset creation
from collections import Counter
# If `full_dataset` + random_split were used originally, you can inspect the subsets' indices
print('train size:', len(train_ds))
print('val size:', len(val_ds))
# If val_ds is a Subset of ImageFolder, get labels
val_labels = [val_ds[i][1] for i in range(len(val_ds))]
print('val label counts:', Counter(val_labels))
```

2) Check for duplicate file paths between train and val (data leakage)

```python
# If you still have `full_dataset` before re-wrapping val, use:
full = datasets.ImageFolder(root=str(DATA_DIR))
train_idx = train_ds.indices if hasattr(train_ds, 'indices') else None
val_idx = val_ds.indices if hasattr(val_ds, 'indices') else None
if train_idx is not None and val_idx is not None:
    train_paths = set(full.samples[i][0] for i in train_idx)
    val_paths = set(full.samples[i][0] for i in val_idx)
    print('overlap count:', len(train_paths & val_paths))
```

3) Validate that evaluation uses the correct dataset (not accidentally using the training loader)

- Print a few file names from `val_loader` and confirm they are not in the `train_loader` sample set.

4) Use stratified splitting to preserve class balance

```python
from sklearn.model_selection import StratifiedShuffleSplit
X = np.arange(len(full_dataset))
y = [s[1] for s in full_dataset.samples]
sss = StratifiedShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
train_idx, val_idx = next(sss.split(X, y))
```

5) Run k-fold cross-validation or repeat experiments with different seeds to verify results are stable

6) Reduce overfitting during development
- Freeze the backbone initially (train classifier only) for a few epochs, then gradually unfreeze
- Use stronger augmentation, weight decay, and early stopping
- Use smaller learning rate for pretrained layers

Why we should expand the dataset
--------------------------------
- Small training/validation sizes cause high variance; the model can memorize a tiny dataset and produce deceptively perfect metrics on a tiny or leaked validation set.
- More diverse real-world examples (different lighting, ages, imaging devices, mild/severe cases) will make evaluation meaningful and improve generalization.

Concrete next steps (actionable)
--------------------------------
1. Run the checks above: val size, class counts, duplicate file detection, and confirm the actual files used for validation.
2. If overlap or extremely small val set is found: re-split using stratified sampling and/or increase validation fraction.
3. Adopt k-fold CV or repeated experiments to measure variance.
4. Expand the dataset by:
   - Collecting more labeled images (recommended)
   - Using controlled augmentation pipelines (but do not leak augmented versions into both train and val)
   - Investigating public datasets for similar tasks
5. Add model-level measures: freeze backbone, add early stopping, log metrics per epoch, and use confusion matrix + per-class precision/recall rather than only accuracy.

If you want, I can add the following to the notebook or to this issue as runnable snippets:
- Stratified splitter and duplicate-check code (small cell)
- k-fold cross-validation wrapper for training loop
- Data-augmentation recipes and how to expand dataset safely

References: see notebook `notebooks/conjunctivitis_mobilenetv3_training.ipynb` for current training/evaluation setup.
