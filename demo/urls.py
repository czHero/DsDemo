from django.urls import path, include

from demo.views import student

url_student = [
	path('', student.student),
	path('create', student.create),
	path('retrieve', student.retrieve),
	path('update', student.update),
	path('delete', student.delete),
]

url_demo = [
    path('student/', include(url_student)),
]
