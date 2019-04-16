from django.urls import path, include

from demo.views import student, group

url_student = [
	path('', student.student, name='student'),
	path('create', student.create, name='student_create'),
	path('retrieve', student.retrieve, name='student_retrieve'),
	path('update', student.update, name='student_update'),
	path('delete', student.delete, name='student_delete'),
]

url_group = [
	path('', group.group, name='group'),
	path('create', group.create, name='group_create'),
	path('retrieve', group.retrieve, name='group_retrieve'),
	path('update', group.update, name='group_update'),
	path('delete', group.delete, name='group_delete'),
]


url_demo = [
    path('student/', include(url_student)),
]
