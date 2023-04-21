import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, mean_squared_error
import tensorflow as tf
from tensorflow import keras

from .labelize_softmax import labelize_softmax


def eval_model(preds, dataset, nn_type):
    X_train, y_train, X_val, y_val, X_test, y_test = dataset

    if nn_type == 'classification':
        return accuracy_score(y_test, labelize_softmax(preds))
    elif nn_type == 'regression':
        return mean_squared_error(y_test, preds)
    else:
        print("not a valid nn_type")
