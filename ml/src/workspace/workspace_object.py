import numpy as np
import tensorflow as tf
from tensorflow import keras
from src.preprocess import Preprocessor


# this is what is going to be stored in S3 to be pulled by the other lambda
class WorkspaceObject:

    def __init__(self, model, performance_metric, preprocessor):
        self.model = model
        self.performance_metric = performance_metric
        self.preprocessor = preprocessor

