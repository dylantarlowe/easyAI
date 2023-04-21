from src.train import generate_nn_model, generate_nn_params, train_model
from src.preprocess import Preprocessor, train_val_test_split
from src.evaluate import eval_model, labelize_softmax
from src.predict import predict_model
from src.workspace import WorkspaceObject

import pandas as pd

# params: dataset, attribute values of all the dropdowns (is image data, orientation of inputted csv)
# nn_type can be: 'classification-binary', 'classification-multi', 'regression' (can be extended later)


# needs to change to data being passed as a parameter instead of reading a csv
def create_workspace_object(data, nn_type, target_col):

    # read in data
    # data = pd.read_csv(f'src/data/{data_name}.csv') # change to pass as parameter

    # preprocess data method here
    preprocessor = Preprocessor()
    preprocessor.fit_transform(data, target_col)

    # get dataset splits
    dataset = train_val_test_split(preprocessor.samples, preprocessor.targets, nn_type)

    # generate params
    nn_params = generate_nn_params(dataset, nn_type)

    # generate nn model
    model = generate_nn_model(nn_params)

    # train model and save
    model_fitted = train_model(model, dataset)
    # model_fitted.save(f'models/{data_name}_model') # change to saving in S3 or mongo

    # model predictions and save them
    preds = predict_model(model_fitted, dataset)
    if nn_type == 'classification':
        preds = labelize_softmax(preds)
    # pd.DataFrame(preds).to_csv(f'predictions/{data_name}_predictions.csv') # change to saving in S3 or mongo

    # eval model
    performance_metric = eval_model(preds, dataset, nn_type)

    # create object here
    workspace_object = WorkspaceObject(model_fitted, performance_metric, preprocessor)

    # return object (or do whatever needs to be done)
    return workspace_object


data = pd.read_csv('data/Life Expectancy Data.csv')
create_workspace_object(data, 'regression', 'target')
