import os
import time

from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

from face_estimation.serializers import MemberSerializer, DepartmentSerializer
from faceai import settings
from faceai.settings import BASE_DIR
# Estimate model
import age_gender_model.ImageMetaExtractor as extractor
import cv2
from keras.utils.data_utils import get_file
from pathlib import Path
import tensorflow as tf
from tensorflow import keras
from face_estimation import utils as U
import threading
import face_recognition_model as face_recognition
import numpy as np
from keras.models import load_model
from emotion_model.utils.inference import load_image
from emotion_model.utils.preprocessor import preprocess_input

from emotion_model.utils.datasets import get_labels
from keras.preprocessing import image

from emotion_model.utils.inference import load_detection_model

# detection_model_path = 'trained_models/detection_models/haarcascade_frontalface_default.xml'
detection_model_path = os.path.join(BASE_DIR, 'emotion_model',
                                    "trained_models/detection_models/haarcascade_frontalface_default.xml")
# emotion_model_path = 'trained_models/emotion_models/fer2013_mini_XCEPTION.102-0.66.hdf5'
emotion_model_path = os.path.join(BASE_DIR, 'emotion_model',
                                  'trained_models/fer2013_big_XCEPTION.54-0.66.hdf5')
emotion_labels = get_labels('fer2013')

# hyper-parameters for bounding boxes shape
emotion_offsets = (20, 40)
emotion_offsets = (0, 0)

# DB연동 관련 model
from rest_framework import viewsets
from face_estimation.models import Department, Member


class MemberViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """
    queryset = Member.objects.all()
    serializer_class = MemberSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


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

def depInfoCreate(request):
    Department.objects.all().delete()
    depList = ['인프라개발팀', '서비스기술팀', '기술개발팀', '모바일서비스팀']
    for dep in depList:
        print(dep)
        test1 = Department(name=dep)
        test1.save()
    return HttpResponse("ok")


def emotion(request):
    return render(request, 'emotion.html', context={'hello': 'world'})

def age_gender(request):
    return render(request, 'age_gender.html', context={'hello': 'world'})

def video(request):
    return render(request, 'video.html')


def train_recognition(request):
    # train 함수 호출..
    return HttpResponse('OK')


def recognize_img(request):
    img = request.GET['img'];
    img_path = "/Users/sikongming/PycharmProjects/faceai/static/pic/{}".format(img)
    predictions = recognizeUtil.predict(img_path, classifier, distance_threshold=0.3)
    # Print results on the console
    for name, (top, right, bottom, left) in predictions:
        print("- Found {} at ({}, {})".format(name, left, top))
    recognizeUtil.show_prediction_labels_on_image(img_path, predictions)
    return HttpResponse('OK');


def recognize_model_reload(request):
    # lock.acquire()
    global classifier
    classifier = recognizeUtil.train(recognize_train_path, model_save_path=recognize_model_path, n_neighbors=2)
    print("classifier")
    return HttpResponse('OK');


def member_register(request):
    department = Department.objects.all()
    serializer = DepartmentSerializer(department, many=True)
    return render(request, 'member_register.html', context={'depList': serializer.data})


def recognize_camera():
    while True:
        time.sleep(0.5)
        video_capture = cv2.VideoCapture(0)
        ret, frame = video_capture.read()
        # image를 BGR color로부터 RGB color로 변경한다
        rgb_frame = frame[:, :, ::-1]
        # Find all the faces and face enqcodings in the frame of video
        face_locations = face_recognition_model.face_locations(rgb_frame)
        face_encodings = face_recognition_model.face_encodings(rgb_frame, face_locations)

        predictions = predict_faceencoding(face_encodings, face_locations, classifier)
        print("identity info: ", predictions)
        for id, (top, right, bottom, left) in predictions:
            # print("- Found {} at ({}, {})".format(name, left, top))
            print("사원: ", id)
            if (id is not 'unknown'):
                member = Member.objects.all().filter(id=id)
                open_door()
            # 카메라는 Main thread에서만 OPEN할 수 있다
            '''
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
            # Draw a label with a name below the face
            cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
            font = cv2.FONT_HERSHEY_DUPLEX
            cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)
            '''
        # cv2.imshow('Video', frame)


def open_door():
    print("문을 연다")


def predict_faceencoding(faces_encodings, face_locations, knn_clf):
    # 얼굴 detection이 못한 경우 그냥 넘어간다.
    if len(face_locations) == 0:
        return []
    distance_threshold = 0.5
    closest_distances = knn_clf.kneighbors(faces_encodings, n_neighbors=1)

    are_matches = [closest_distances[0][i][0] <= distance_threshold for i in range(len(face_locations))]
    # Predict classes and remove classifications that aren't within the threshold
    return [(pred, loc) if rec else ("unknown", loc) for pred, loc, rec in
            zip(knn_clf.predict(faces_encodings), face_locations, are_matches)]


@csrf_exempt
def upload_ajax(request):
    if request.method == 'POST':
        file_obj = request.FILES.get('file')
        if (not U.isImage(file_obj.name)):
            return JsonResponse({"result": "fail", "errormsg": "이지미 파일을 업로드하세요."})

        f = open(os.path.join(BASE_DIR, 'static', 'pic', file_obj.name), 'wb')
        for chunk in file_obj.chunks():
            f.write(chunk)
        f.close()
        img_save_path = os.path.join(BASE_DIR, 'static', 'pic', file_obj.name)

        try:
            json_result = handleUploadImg(img_save_path)
        except Exception as err:
            print(err)
            return JsonResponse({"result": "fail", "errormsg": "안면인식을 못했습니다"})

        return JsonResponse({"result": "ok", "data": json_result})


@csrf_exempt
def upload_multi_ajax(request):
    if request.method == 'POST':
        id = request.GET['id']
        print("id", id)
        files = request.FILES.getlist('files[]')
        print(len(files))
        for file_obj in files:
            path = os.path.join(BASE_DIR, settings.TRAIN_IMG_PATH, id)
            if (os.path.exists(path) != True):
                os.makedirs(path)
            fn, file_extension = os.path.splitext(file_obj.name)
            timestamp = time.time()
            filename = "{}.{}".format(timestamp, file_extension)
            f = open(os.path.join(BASE_DIR, settings.TRAIN_IMG_PATH, id, filename), 'wb')
            for chunk in file_obj.chunks():
                f.write(chunk)
            f.close()
    return JsonResponse({"data": {"result": "success"}})


def handleUploadImg(img_path):
    img = metaExtractor.load_img_original(img_path)
    with session.as_default():
        with session.graph.as_default():
            detected, predicted_genders, predicted_ages = metaExtractor.age_gender(img)
    # 결과를 가지고 처리한다
    estimated_list = []
    for i, d in enumerate(detected):
        label = "{}".format(i)
        draw_label(img, (d.left(), d.top()), label)
        gender = "M" if predicted_genders[i][0] < 0.5 else "F"
        age = int(predicted_ages[i])
        estimated_list.append({'age': age, 'gender': gender})

    print(estimated_list)
    timestamp = time.time()
    filename = "{}.jpg".format(timestamp)
    result_img_path = os.path.join(BASE_DIR, 'static', 'pic', filename)
    cv2.imwrite(result_img_path, img)
    return {'img_path': "/static/pic/{}".format(filename), 'estimated_list': estimated_list}

@csrf_exempt
def emotion_handler(request):
    if request.method == 'POST':
        file_obj = request.FILES.get('file')
        if (not U.isImage(file_obj.name)):
            return JsonResponse({"result": "fail", "errormsg": "이지미 파일을 업로드하세요."})

        f = open(os.path.join(BASE_DIR, 'static', 'pic', file_obj.name), 'wb')
        for chunk in file_obj.chunks():
            f.write(chunk)
        f.close()
        img_save_path = os.path.join(BASE_DIR, 'static', 'pic', file_obj.name)
        try:
            image_path = img_save_path;
            with session.as_default():
                with session.graph.as_default():
                    emotion_target_size = emotion_classifier.input_shape[1:3]
                    rgb_image = load_image(image_path, grayscale=False)
                    gray_image = load_image(image_path, grayscale=True)
                    gray_image = np.squeeze(gray_image)
                    gray_image = gray_image.astype('uint8')
                    detected, faces = metaExtractor.detect(gray_image)

                    estimated_list = []
                    index = 0
                    for i, d in enumerate(detected):
                        x1, y1, x2, y2, w, h = d.left(), d.top(), d.right() + 1, d.bottom() + 1, d.width(), d.height()
                        gray_face = gray_image[y1:y2, x1:x2]
                        try:
                            gray_face = cv2.resize(gray_face, (emotion_target_size))
                        except Exception as e:
                            print(e)
                            continue
                        gray_face = preprocess_input(gray_face, True)
                        gray_face = np.expand_dims(gray_face, 0)
                        gray_face = np.expand_dims(gray_face, -1)
                        emotion_label_arg = np.argmax(emotion_classifier.predict(gray_face))
                        emotion_text = emotion_labels[emotion_label_arg]
                        estimated_list.append({'emotion':emotion_text})
                        cv2.rectangle(rgb_image, (x1, y1), (x2, y2), (255, 0, 0), 2)
                        label = "{}".format(index)
                        draw_label(rgb_image, (d.left(), d.top()), label)
                        index = index + 1

                    bgr_image = cv2.cvtColor(rgb_image, cv2.COLOR_RGB2BGR)
                    timestamp = time.time()
                    filename = "{}.jpg".format(timestamp)
                    result_img_path = os.path.join(BASE_DIR, 'static', 'pic', filename)
                    cv2.imwrite(result_img_path, bgr_image)
                    json_result = {'img_path': "/static/pic/{}".format(filename), 'estimated_list': estimated_list}
            return JsonResponse({"result": "ok", "data": json_result})
        except Exception as err:
            print("ERROR", err)
            return JsonResponse({"result": "fail", "errormsg": "안면인식을 못했습니다"})


def draw_label(image, point, label, font=cv2.FONT_HERSHEY_SIMPLEX,
               font_scale=0.8, thickness=1):
    size = cv2.getTextSize(label, font, font_scale, thickness)[0]
    x, y = point
    cv2.rectangle(image, (x, y - size[1]), (x + size[0], y), (255, 0, 0), cv2.FILLED)
    cv2.putText(image, label, point, font, font_scale, (255, 255, 255), thickness, lineType=cv2.LINE_AA)
    return image

@csrf_exempt
def test(request):
    timestamp_start = time.time()

    test_img_path = os.path.join(BASE_DIR, 'static', 'test/images')
    files = os.listdir(test_img_path)
    for f in files:
        fpath = test_img_path + "/" + f
        img_path = fpath
        img = metaExtractor.load_img_original(img_path)
        with session.as_default():
            with session.graph.as_default():
                detected, predicted_genders, predicted_ages = metaExtractor.age_gender(img)
        # 결과를 가지고 처리한다
        estimated_list = []
        for i, d in enumerate(detected):
            label = "{}".format(i)
            gender = "M" if predicted_genders[i][0] < 0.5 else "F"
            age = int(predicted_ages[i])
            estimated_list.append({'age': age, 'gender': gender})
    timestamp_end = time.time()
    time_diff = timestamp_end - timestamp_start
    print("time_diff::::::::::::::::::::::::::::::::::", time_diff)
    #return {'img_path': "/static/pic/{}".format(filename), 'estimated_list': estimated_list}
    return HttpResponse('OK')


if __name__ == '__main__':
    # open_camera()
    open_door()

t = threading.Thread(target=recognize_camera, args={}, kwargs={})
t.setDaemon(True)
# t.start()
