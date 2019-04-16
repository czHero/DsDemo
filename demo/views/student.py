import json

from django.forms import model_to_dict
from django.http import HttpResponse
from django.shortcuts import render
from demo.models import Student
# Create your views here.


def student(request):
	return render(request, 'student.html')


def create(request):
	name = request.POST.get('name')
	gen = request.POST.get('gender')
	birth = request.POST.get('birth')
	sess = request.POST.get('session')
	clas = request.POST.get('class')

	Student(name=name, gender=gen, birth=birth, session=sess, class_s=clas).save()
	return HttpResponse(json.dumps({'result': 'ok'}), status=200)


def retrieve(request):
	stu_id = request.POST.get('id')
	data = Student.objects.get(id=stu_id)
	data = model_to_dict(data)
	return HttpResponse(json.dumps(data), status=200)


def update(request):
	stu_id = request.POST.get('id')
	name = request.POST.get('name')
	gen = request.POST.get('gender')
	birth = request.POST.get('birth')
	sess = request.POST.get('session')
	clas = request.POST.get('class')
	
	Student.objects.filter(id=stu_id).update(name=name, gender=gen, birth=birth, session=sess, class_s=clas)
	return HttpResponse(json.dumps({'result': 'ok'}), status=200)


def delete(request):
	stu_id = request.POST.get('id')
	password = request.POST.get('password')
	passport = 'demo'
	if password == passport:
		Student.objects.get(id=stu_id).delete()
	return HttpResponse(json.dumps({'result': 'ok'}), status=200)
	
	


