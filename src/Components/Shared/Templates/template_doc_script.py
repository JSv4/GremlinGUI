#Required Imports #####################################################################################################

#e.g. from OCRUSREX import ocrusrex

	#Don't forget that, if these imports are not already available, you'll need to list them out in the
	#required dependencies so that Gremlin can install them in the environment. 

########################################################################################################################

# user-defined functions to run on docs should expect the following, read-only objects:
# job
# doc
# step
#
# the logger object will be a special instance of the logger just for user scripts and 
# will write out messages to the Gremlin UI (not implemented yet). Currently these
# are stored in the underlying Celery logs.
def pythonFunction(*args, job=None, doc=None, step=None, logger=None, **kwargs):

	# logging - use the logger object passed in:
		# 1) logger.info("...")
		# 2) logger.warn("...")
		# 3) logger.error("...")
	logger.info("New function active")

	#return values - your function must return a tuple of the following form:
	#	( Completed, Message, Data, FileBytesObj, FileExtension)
	#		  |         |       |        |              |
	#	   Boolean    String  JSON    Bytes Obj       String
	#
	#   You must provided a value for Completed and Message. Everything else can
	#   Be returned as None or an empy object. If there is no data, return an 
	#   empty JSON {}. If there is no file to return return None for the FileBytesObj
	#   and None for the File Extension. Otherwise, return the BytesObj representing
	#   the file that should be stored, along with the file extension. File names
	#   are currently determined automatically, though that may change.  

	return (True, "Sucess Message!", {}, None, None)
	