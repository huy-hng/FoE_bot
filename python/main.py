import sys
import json

import logger
from helping import *
from initializer import *
from javascript_endpoint import *
from watcher import *


script = sys.argv[1]
args = sys.argv[2]
args = json.loads(args)

logger.info(f'script: {script} with args: {args}', )

#pylint: disable=E0602
exec(f'data = {script}(*{args})')
print(json.dumps(data))
