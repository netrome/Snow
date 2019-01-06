import glob
import json
import tqdm

import flask
import flask_cors
from PIL import Image

import numpy as np

import torch
from torch.utils import data
import torchvision.transforms as transforms
import torchvision.models as models

import umap


toserve = []


def init():
    global toserve
    paths = get_paths("./static/images")
    toserve = paths
    latent = to_latent_vector(paths)
    print(latent)
    print(latent.shape)

    print("Performing the UMAP")
    embedding = umap.UMAP(
        n_components=3,
        n_neighbors=3,
        min_dist=0.5,
        metric='correlation').fit_transform(latent)

    # Convert numpy to nested list, and prepare a list of 
    #  path-point pairs that can be json serializable
    toserve = list(zip(paths, list(map(lambda row: list(map(float, list(row))), embedding))))
    print("Done")



def get_paths(root):
    pics = glob.glob(f'{root}/**/*.jpg', recursive=True)
    return pics


def to_latent_vector(paths):

    # Load image and run imagenet model, return output
    tensors = map(lambda t: t.view(-1, *t.shape), 
                  map(transforms.ToTensor(), 
                      map(lambda p: Image.open(p).resize([224, 224]),
                          paths)))

    model = models.resnet18(pretrained=True)  # Change to resnet later, but alexnet is faster

    out = []
    print("Converting images to intermediate features")
    for tensor in tqdm.tqdm(tensors, total=len(paths)):
        out.append(model(tensor).view(-1).detach().numpy())

    return np.array(out)


# Setup app -------------------------------------------------------------
# Files in ./static are automatically serverd, so we don't worry about those
init()
app = flask.Flask(__name__)
flask_cors.CORS(app)

@app.route("/")
@flask_cors.cross_origin()
def serve():
    # Main entry point for this app, returns paths to images and points
    return json.dumps(toserve)
