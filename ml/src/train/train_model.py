import numpy as np
import tensorflow as tf
from tensorflow import keras


# train model
def train_model(model, dataset):

    X_train, y_train, X_val, y_val, X_test, y_test = dataset

    print("datasets before training", (X_train, y_train, X_val, y_val, X_test, y_test))
    print("X-train nans:", np.count_nonzero(np.isnan(X_train)))
    print("y-train nans:", np.count_nonzero(np.isnan(y_train)))
    print("X-val nans:", np.count_nonzero(np.isnan(X_val)))
    print("y-val nans:", np.count_nonzero(np.isnan(y_val)))
    print("X-test nans:", np.count_nonzero(np.isnan(X_test)))
    print("y-test nans:", np.count_nonzero(np.isnan(y_test)))
    hobj = model.fit(X_train, y_train, validation_data=(
        X_val, y_val), epochs=100, batch_size=200, shuffle=True)

    return model
