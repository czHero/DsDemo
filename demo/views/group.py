import datetime
import json

from django.db.models import Q
from django.forms import model_to_dict
from django.http import HttpResponse
from django.shortcuts import render
from django_datatables_view.base_datatable_view import BaseDatatableView

from demo.models import Student, Group


class CJsonEncoder(json.JSONEncoder):
	def default(self, obj):
		if isinstance(obj, datetime.datetime):
			return obj.strftime('%Y-%m-%d %H:%M:%S')
		elif isinstance(obj, datetime.date):
			return obj.strftime('%Y-%m-%d')
		else:
			return json.JSONEncoder.default(self, obj)


def GetJsonResponse(dictObject, status=200):
	return HttpResponse(json.dumps(dictObject, ensure_ascii=False, cls=CJsonEncoder).encode("utf-8"), charset="utf-8",
	                    status=status)


def build_tree(list):
	"""
	将model 转成输
	:param list:
	:return:
	"""
	tree = []
	all_node = {}
	# 转成[K，V]键值对
	for m in list:
		t = model_to_dict(m)
		t['type'] = 'leaf'
		all_node[m.id] = t
	# 构建树
	for (k, node) in all_node.items():
		if node['parent_id'] == 0:
			tree.append(node)
		else:
			if node['parent_id'] in all_node:
				parent = all_node[node['parent_id']]
				if 'children' not in parent:
					parent['children'] = []
				parent['children'].append(node)
				parent['type'] = 'node'
	return tree


def group(request):
	return render(request, 'group.html')


def lists(request):
	# post获取的内部变量全部以下划线开头
	_group = Group.objects.all()
	return GetJsonResponse({'result': 'OK', 'data': [model_to_dict(g) for g in _group]})


def tree(request):
	_group = Group.objects.all()
	_group = build_tree(_group)
	return GetJsonResponse({'result': 'OK', 'data': _group})


def create(request):
	_name = request.POST.get('p_name')
	_order_id = request.POST.get('p_order_id')
	_parent_id = request.POST.get('p_parent_id')
	Student(name=_name, order_id=_order_id, parent_id=_parent_id).save()
	return HttpResponse(json.dumps({'result': 'ok'}), status=200)


def retrieve(request):
	_id = request.POST.get('p_id')
	data = Student.objects.get(id=_id)
	return GetJsonResponse({'result': 'OK', 'data': model_to_dict(data)})


def update(request):
	_id = request.POST.get('p_id')
	_name = request.POST.get('p_name')
	_order_id = request.POST.get('p_order_id')
	_parent_id = request.POST.get('p_parent_id')
	
	Student.objects.filter(id=_id).update(name=_name, order_id=_order_id, parent_id=_parent_id)
	return GetJsonResponse({'result': 'OK'})


def delete(request):
	_id = request.POST.get('p_id')
	Student.objects.filter(id=id).update(sts='INVALID')
	return GetJsonResponse({'result': 'OK'})


class PageGroup(BaseDatatableView):
	model = Group
	columns = ['id', 'name', 'full_name', 'parent_id']

	# 获取初始查询
	def get_initial_queryset(self):
		# 获取ajax参数
		sts = self._querydict.get('p_sts', None)
		return self.model.objects.filter(sts=sts).order_by('order_id')

	# 过滤查询
	def filter_queryset(self, qs):
		search = self.request.GET.get('search[value]', None)
		if search:
			q = Q(id__contains=search) | Q(name__contains=search) | Q(full_name__contains=search)
			qs = qs.filter(q)
		return qs

	# 准备返回结果
	def prepare_results(self, qs):
		return [model_to_dict(q) for q in qs]
