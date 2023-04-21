import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler, LabelBinarizer
from sklearn.impute import KNNImputer


class Preprocessor:
    def __init__(self):
        self.dropped_cols = []

        self.object_cols = []
        self.bool_cols = []
        self.int_cols = []
        self.float_cols = []

        self.targets = None
        self.samples = None

        self.labelEncoders = {}
        self.missingValueImputer = None
        self.logScaleExtremes = {}
        self.z_score_upper = None
        self.z_score_lower = None
        self.outlier_bounds = {}
        self.standardScalers = {}
        self.oneHotEncoders = {}

    # method exists to create model training/validation/test data and serializable values to allow transforming of unseen data
    def fit_transform(
        self, data, target_col
    ):
        data_c = data.copy()

        data_c = data_c[data_c[target_col].notna()]

        # split data
        data_c, self.targets = self.splitData(data_c, target_col)

        # TODO: drop useless columns first, then store columns to be dropped later after imputing
        # will have a drop pre-imputing to assist imputing and post-imputing to assist model training
        # drop unnecessary columns
        data_c = self.dropColumns(data_c)

        # process column dtypes via column names
        self.getColumns(data_c)

        # data transformations
        data_c = self.labelEncodeObjectCols(data_c)
        data_c = self.binarizeBoolCols(data_c)
        data_c = self.imputeMissingValues(data_c)
        # data_c = self.logScaleNumericalCols(data_c)
        data_c = self.adjustNumericalOutliers(data_c)
        data_c = self.standardScaleNumericalCols(data_c)
        data_c = self.oneHotEncodeObjectCols(data_c)

        # store and return preprocessed samples
        self.samples = data_c
        return data_c

    # needs to make it such that the targets are always read in as the last column of the csv (and always of correct orientation)
    def splitData(self, data, target_col):
        targ_col_names = (
                list(data.filter(regex=target_col).columns)
        )

        print('target vals',targ_col_names)

        targets = data[targ_col_names]

        data = data.drop(
            targ_col_names, axis=1
        )
        return data, targets

    def dropColumns(self, data):
        for i in data.columns:
            if data[i].isna().sum() / data.shape[0] >= 0.35:
                # print(i) # need to investigate these to alter columns if necessary (since null may not always mean missing)
                self.dropped_cols.append(i)

        self.dropped_cols = (
            self.dropped_cols
            + list(data.filter(regex="Id").columns)
            + list(data.filter(regex="id").columns)
            + list(data.filter(regex="ID").columns)
            + list(data.filter(regex="City").columns)
            + list(data.filter(regex="city").columns)
            + list(data.filter(regex="Date").columns)
            + list(data.filter(regex="date").columns)
            + list(data.filter(regex="Address").columns)
            + list(data.filter(regex="address").columns)
            + list(data.filter(regex="State").columns)
            + list(data.filter(regex="stage").columns)
        )
        data = data.drop(self.dropped_cols, axis=1)
        # TODO: could introduce functionality to dynamically drop categorical columns that have more than a certain number of labels
        return data

    def getColumns(self, data):
        self.object_cols = data.select_dtypes(include="object").columns
        self.bool_cols = data.select_dtypes(include="bool").columns
        self.int_cols = data.select_dtypes(include="int64").columns
        self.float_cols = data.select_dtypes(include="float").columns

    def labelEncodeObjectCols(self, data):
        # Int64 is nullable so that we can preserve the NaNs so we can still label encode then inpute later
        for i in self.object_cols:
            mask = data[i].isnull()
            col_c = data[i].copy()
            LE = LabelEncoder()
            temp = pd.DataFrame(data[i]).astype(str).apply(LE.fit_transform)
            self.labelEncoders[i] = LE
            data[i] = temp[i]
            data[i] = data[i].astype("Int64")
            data[i] = data[i].where(~mask, col_c)
            data[i] = data[i].astype("Int64")
        return data

    def binarizeBoolCols(self, data):
        for i in self.bool_cols:
            mask = data[i].isnull()
            col_c = data[i].copy()
            data[i] = data[i].astype("Int64")
            data[i] = data[i].where(~mask, col_c)
            data[i] = data[i].astype("Int64")
        return data

    def imputeMissingValues(self, data):
        # impute missing values (better to do before scaling numerical columns and one-hot encoding)
        # could hypertune n_neighbors if desired
        # consider making non-uniform weights if it would be more beneficial?
        knn_imputer = KNNImputer(
            n_neighbors=29, weights="uniform", metric="nan_euclidean"
        )
        data[:] = knn_imputer.fit_transform(data)
        self.missingValueImputer = knn_imputer

        # fix int label imputations to be non-float (round to closest label)
        for i in self.object_cols:
            data[i] = data[i].apply(np.ceil).astype(int)

        if data.isna().sum().sum() != 0:
            raise Exception("NaNs exist after imputing, further investigation needed")
        return data

    def logScaleNumericalCols(self, data):
        # log scale exponential/polynomically distributed attributes (all numerical columns)
        # done before scaling so the resulting dataset is standardized properly
        for i in list(self.int_cols) + list(self.float_cols):
            d = np.array(data[i]).copy()
            data[i] = np.where(d <= 0, d, np.log(d))
            d = np.array(data[i]).copy()
            data[i] = np.where(d >= 0, d, -1 * np.log(-1 * d))

        if data.isna().sum().sum() != 0:
            raise Exception("NaNs exist after log scaling, further investigation needed")

        return data

    def adjustNumericalOutliers(self, data, z_up=2.5, z_low=-2.5):
        # adjust outliers to the extreme value (extreme threshold defined by the z score variables in terms of std)
        self.z_score_upper = z_up  # for +2.5 std
        self.z_score_lower = z_low  # for -2.5 std
        for i in list(self.int_cols) + list(self.float_cols):
            col_mean = data[i].mean()
            col_std = data[i].std()
            outlier_upper = col_mean + (self.z_score_upper * col_std)
            outlier_lower = col_mean + (self.z_score_lower * col_std)
            data[i][data[i] > outlier_upper] = outlier_upper
            data[i][data[i] < outlier_lower] = outlier_lower
            self.outlier_bounds[i] = (outlier_upper, outlier_lower)
        return data

    def standardScaleNumericalCols(self, data):
        # standard scale int and float columns
        for i in list(self.int_cols) + list(self.float_cols):
            SS = StandardScaler()
            data[i][data[i] == np.NINF] = np.nanmax(
                data[i]
            )  # fix bug, wasn't catching a single -inf
            data[i] = SS.fit_transform(np.array(data[i]).reshape(-1, 1))
            self.standardScalers[i] = SS
        return data

    def oneHotEncodeObjectCols(self, data):
        # one-hot encode the object columns using label binarizer
        data_cc = data.copy()
        data_cc = data_cc.drop(self.object_cols, axis=1)
        data_arr = np.array(data_cc)
        for i in self.object_cols:
            LB = LabelBinarizer()
            temp_ohe = LB.fit_transform(np.array(data[i]).reshape(-1, 1))
            self.oneHotEncoders[i] = LB
            data_arr = np.append(data_arr, temp_ohe, axis=1)
        return data_arr

    # method exists to transform a given data point without a give label (effectively, unseen data of type already fit)
    def transform(self, data):
        for i in data.columns:
            print("col name", i, "col value", data[i][0])
        data_c = data.copy()
        data_c = self.dropCols_t(
            data_c
        )  # NOTE: would it be smarter to track the necessary columns (when fittinh) instead of
        # trying to keep track of all of the dropped columns and just get the ones we need?

        data_c = self.labelEncode_t(data_c)
        data_c = self.binarizeBoolCols(data_c)  # need not rewrite
        data_c = self.imputeMissing_t(data_c)
        # data_c = self.logScale_t(data_c)
        data_c = self.adjustOutliers_t(data_c)
        data_c = self.standardScale_t(data_c)
        data_c = self.oneHotEncode_t(data_c)
        return data_c

    def dropCols_t(self, data):
        to_drop = list(set(self.dropped_cols).intersection(set(data.columns))) # to not get eror in removing cols that aren't present
        data = data.drop(to_drop, axis=1)
        data = data.drop(
            list(data.filter(regex="Id").columns)
            + list(data.filter(regex="stage").columns),
            axis=1,
        )
        return data

    def labelEncode_t(self, data):
        for i in self.object_cols:
            LE = self.labelEncoders[i]
            data[i] = data[i].map(
                lambda s: np.NAN if s not in LE.classes_ else s
            )  # assings NaN if unknown class to avoid label encoder errors (not sure if better way exists)
            mask = data[i].isnull()
            if not pd.isna(data[i][0]):
                col_c = data[i].copy()
                temp = pd.DataFrame(data[i]).astype(str).apply(LE.transform)
                data[i] = temp[i]
                data[i] = data[i].astype("Int64")
                data[i] = data[i].where(~mask, col_c)
                data[i] = data[i].astype("Int64")
        return data

    def imputeMissing_t(self, data):
        data[:] = self.missingValueImputer.transform(data)
        for i in self.object_cols:
            data[i] = data[i].apply(np.ceil).astype(int)

        if data.isna().sum().sum() != 0:
            raise Exception("NaNs exist after imputing, further investigation needed")

        return data

    def logScale_t(self, data):
        for i in list(self.int_cols) + list(self.float_cols):
            d = np.array(data[i]).copy()
            data[i] = np.where(d <= 0, d, np.log(d))
            d = np.array(data[i]).copy()
            data[i] = np.where(d >= 0, d, -1 * np.log(-1 * d))
        return data

    def adjustOutliers_t(self, data):
        for i in list(self.int_cols) + list(self.float_cols):
            upper = self.outlier_bounds[i][0]
            lower = self.outlier_bounds[i][1]
            data[i][data[i] > upper] = upper
            data[i][data[i] < lower] = lower
        #print(data, flush=True)
        return data

    def standardScale_t(self, data):
        for i in list(self.int_cols) + list(self.float_cols):
            data[i][data[i] == np.NINF] = np.nanmax(
                data[i]
            )  # fix bug, wasn't catching a single -inf
            data[i] = self.standardScalers[i].transform(
                np.array(data[i]).reshape(-1, 1)
            )
        return data

    def oneHotEncode_t(self, data):
        data_cc = data.copy()
        data_cc = data_cc.drop(self.object_cols, axis=1)
        data_arr = np.array(data_cc)
        for i in self.object_cols:
            temp_ohe = self.oneHotEncoders[i].transform(
                np.array(data[i]).reshape(-1, 1)
            )
            data_arr = np.append(data_arr, temp_ohe, axis=1)
        return data_arr
