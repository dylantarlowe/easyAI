import numpy as np


def labelize_softmax(preds):
    return (preds == preds.max(axis=1)[:, None]).astype(int)
