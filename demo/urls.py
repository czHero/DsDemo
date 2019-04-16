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
	path('lists', group.lists, name='group_lists'),     # 返回list
	path('page', group.PageGroup.as_view(), name='group_page'),     # 返回list
	path('tree', group.tree, name='group_tree'),        # 返回树状
	path('create', group.create, name='group_create'),  # 创建
	path('retrieve', group.retrieve, name='group_retrieve'),    # 获取
	path('update', group.update, name='group_update'),  # 更新
	path('delete', group.delete, name='group_delete'),  # 删除
]


url_demo = [
    path('student/', include(url_student)),
    path('group/', include(url_group)),
]
