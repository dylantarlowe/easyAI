import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras


def predict_model(model, dataset):

    X_train, y_train, X_val, y_val, X_test, y_test = dataset

    preds = model.predict(X_test)

    return preds
