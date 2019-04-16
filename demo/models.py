from django.db import models

# Create your models here.


class Student(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=20)
	gender = models.CharField(max_length=6)
	birth = models.DateField()
	session = models.CharField(max_length=4)  # 某届
	class_s = models.CharField(max_length=4)
	# first_name
	# last_name
	# middle_name
	# full_name(foreign_version)
