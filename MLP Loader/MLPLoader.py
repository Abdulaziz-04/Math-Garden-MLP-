# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: percent
#       format_version: '1.3'
#       jupytext_version: 1.9.1
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

# %% [markdown]
# # Imports

# %%
import numpy as np
import tensorflow.compat.v1 as tf
import tensorflow as tf2
from tensorflow.compat.v1.saved_model import load, tag_constants

# %% [markdown]
# # Constants

# %%
X_TEST_PATH = 'mnist/load_xtest.csv'
Y_TEST_PATH = 'mnist/load_ytest.csv'

# %% [markdown]
# # Load the Data

# %%
y_test = np.loadtxt(Y_TEST_PATH, delimiter=',', dtype=int)
print(f'Shape of y_test {y_test.shape}')

# %%
x_test = np.loadtxt(X_TEST_PATH, delimiter=',', dtype=float)
print(f'Shape of x_test {x_test.shape}')

# %% [markdown]
# # Create Session

# %%
graph = tf.Graph()
session = tf.Session(graph=graph)

# %% [markdown]
# # Load the Model

# %% [markdown]
# ```
# tf.compat.v1.saved_model.load(sess,
#                            [tag_constants.SERVING],
#                            EXPORT_DIR)
# ```

# %%
load(sess=session, tags=[tag_constants.SERVING], export_dir='Saved MLP Model')

# %%
input = graph.get_tensor_by_name('input-attr:0')
output = graph.get_tensor_by_name('accuracy_calc/output-attr:0')

# %% [markdown]
# # Run Session & Make Prediction

# %%
prediction = session.run(fetches=output, feed_dict={input: x_test})

# %% [markdown]
# # Check Results

# %%
correct_results = np.equal(prediction, y_test)
sum(correct_results)/len(y_test)*100

# %% [markdown]
# # Cleanup

# %%
session.close()
tf.reset_default_graph()

# %%
