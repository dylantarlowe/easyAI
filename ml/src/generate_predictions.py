import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras


def predict_model(model, preprocessor, X_test): # might need different params (for accessing preprocessor and model)

    data_t = preprocessor.transform(X_test)

    return model.predict(data_t)
