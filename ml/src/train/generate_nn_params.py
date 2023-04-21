import numpy as np


def generate_nn_params(dataset, nn_type):
    X_train, y_train, X_val, y_val, X_test, y_test = dataset
    input_shape = X_train.shape[1]
    if nn_type == 'classification':
        output_shape = len(np.unique(y_train))
        output_activation = 'softmax'
        hidden_widths = []
        in_s = input_shape
        while in_s > output_shape + 2:
            hidden_widths.append(in_s)
            in_s = round(in_s*.75)

        loss = 'categorical_crossentropy'
        metric = 'balanced_accuracy'

    elif nn_type == 'regression':
        output_shape = 1
        output_activation = 'relu'
        hidden_widths = []
        in_s = input_shape
        while in_s > output_shape + 2:
            hidden_widths.append(in_s)
            in_s = round(in_s*.75)

        loss = 'mse'
        metric = 'mse'

    else:
        raise Exception('Not a currently valid nn_type')

    print("nn parameters: ", (input_shape, hidden_widths, output_shape, output_activation, loss, metric))
    return (input_shape, hidden_widths, output_shape, output_activation, loss, metric)
