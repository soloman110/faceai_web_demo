python manage.py makemigrations
python manage.py migrate

테스트 JSON데이터 리턴
======================
def test(request):
    resp = [
        {
            'id': 1,
            'name': '용용이',
            'department': '개발1팀'
        }
    ]
    response = HttpResponse(content=json.dumps(resp), content_type='application/json;charset = utf-8',status='200',reason='success',charset='utf-8')
    return response


#https://stackoverflow.com/questions/13031058/how-to-serialize-to-json-a-list-of-model-objects-in-django-python
def depList(request):
    list = Department.objects.all()
    '''
        # one result
        return HttpResponse(json.dumps(result.as_json()), content_type="application/json")

        # a list of results
        results = [ob.as_json() for ob in resultset]
        return HttpResponse(json.dumps(results), content_type="application/json")
    '''
    results = [ob.as_json() for ob in list]
    return HttpResponse(json.dumps(results), content_type="application/json")
==================

'''
def open_camera():
    while True:
        # Grab a single frame of video
        ret, frame = video_capture.read()
        # Display the resulting image
        cv2.imshow('Video', frame)

        # Hit 'q' on the keyboard to quit!
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
'''

