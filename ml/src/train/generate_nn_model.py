import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras

# compile model


def generate_nn_model(nn_params):

    input_shape, hidden_widths, output_shape, output_activation, loss, metric = nn_params

    model = keras.models.Sequential(name='model_name')

    model.add(keras.Input(shape=(input_shape,), sparse=False))

    for i, width in enumerate(hidden_widths):
        model.add(keras.layers.Dense(
            width, activation='relu', name=f'hidden_layer_{i}'))

    model.add(keras.layers.Dense(output_shape, activation=output_activation, name='output',
                                 kernel_initializer=keras.initializers.RandomNormal(
                                     stddev=np.sqrt(0.1)),
                                 bias_initializer=keras.initializers.Zeros(), use_bias=True))

    opt = keras.optimizers.Nadam(learning_rate=0.001)

    model.summary()

    model.compile(loss=loss, optimizer=opt, metrics=[metric])

    return model
