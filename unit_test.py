import os
from distutils.sysconfig import get_python_lib

path = '/usr/bin/python'

if os.path.exists(path):
	print "Git installed"
else:
	print "Git not installed"

print os.path.dirname('py')