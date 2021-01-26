from django.test import TestCase

# Create your tests here.

import os
import time

from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

# Estimate model
from age_gender_model import ImageMetaExtractor as extractor
import cv2
from keras.utils.data_utils import get_file
from pathlib import Path
import tensorflow as tf
from tensorflow import keras
from face_estimation import utils as U
import threading
import face_recognition_model as face_recognition
import numpy as np
from keras.preprocessing import image

from emotion_model.utils.inference import load_detection_model

# detection_model_path = 'trained_models/detection_models/haarcascade_frontalface_default.xml'
detection_model_path = os.path.join(BASE_DIR, 'emotion_model',
                                    "trained_models/detection_models/haarcascade_frontalface_default.xml")
# emotion_model_path = 'trained_models/emotion_models/fer2013_mini_XCEPTION.102-0.66.hdf5'
emotion_model_path = os.path.join(BASE_DIR, 'emotion_model',
                                  'trained_models/fer2013_big_XCEPTION.54-0.66.hdf5')
from keras.models import load_model

from emotion_model.utils.datasets import get_labels
from emotion_model.utils.inference import detect_faces
from emotion_model.utils.inference import draw_text
from emotion_model.utils.inference import draw_bounding_box
from emotion_model.utils.inference import apply_offsets
from emotion_model.utils.inference import load_image
from emotion_model.utils.preprocessor import preprocess_input

from emotion_model.utils.datasets import get_labels

from emotion_model.utils.datasets import get_labels

emotion_labels = get_labels('fer2013')

# hyper-parameters for bounding boxes shape
emotion_offsets = (20, 40)
emotion_offsets = (0, 0)

'''
Face Recoginition관련 내용
'''
from face_recognition_model import service as recognizeUtil
import face_recognition_model
from face_recognition_model.face_recognition_cli import image_files_in_folder

recognize_model_path = os.path.join(BASE_DIR, 'face_estimation', "pretrained_models/trained_knn_model_skm.clf")
# recognize_train_path = os.path.join(BASE_DIR, 'face_estimation' ,'train');
recognize_train_path = os.path.join(BASE_DIR, settings.TRAIN_IMG_PATH)

classifier = recognizeUtil.train(recognize_train_path, model_save_path=recognize_model_path, n_neighbors=2)
# video_capture = cv2.VideoCapture(0)

pretrained_model = "https://github.com/yu4u/age-gender-estimation/releases/download/v0.5/weights.28-3.73.hdf5"
modhash = 'fbe63257a054c1c5466cfd7bf14646d6'
#weight_file = get_file("weights.01-5.49-new.hdf5", pretrained_model, cache_subdir="pretrained_models",
#                       file_hash=modhash, cache_dir=str(Path(__file__).resolve().parent))

weight_file = os.path.join(BASE_DIR, 'face_estimation', "pretrained_models/weights.28-3.73.hdf5")

depth = 16
width = 8

config = tf.ConfigProto(
    device_count={'GPU': 2},
    intra_op_parallelism_threads=10,
    allow_soft_placement=True
)

config.gpu_options.allow_growth = True
config.gpu_options.per_process_gpu_memory_fraction = 0.6
session = tf.Session(config=config)
keras.backend.set_session(session)

metaExtractor = extractor.ImageMetaExtractor(weight_file, 64, depth, width)


face_detection = load_detection_model(detection_model_path)
emotion_classifier = load_model(emotion_model_path, compile=False)

def test():
    print(1)

if __name__ == '__main__':
    # open_camera()
    test()
