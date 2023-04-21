import numpy as np
import pandas as pd
import copy
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split


def train_val_test_split(data, targets, nn_type):
    X_train, X_temp, y_train, y_temp = train_test_split(
        data, targets, test_size=.3, random_state=42)
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=.5, random_state=42)
    if nn_type == 'classification':
        encoder = OneHotEncoder()
        y_train = encoder.fit_transform(
            copy.deepcopy(y_train).reshape((-1, 1))).toarray()
        y_val = encoder.fit_transform(
            copy.deepcopy(y_val).reshape((-1, 1))).toarray()
        y_test = encoder.fit_transform(
            copy.deepcopy(y_test).reshape((-1, 1))).toarray()
    return (X_train, y_train, X_val, y_val, X_test, y_test)
