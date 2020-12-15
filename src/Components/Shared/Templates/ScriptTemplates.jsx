export const doc_script = `#Required Imports #####################################################################################################

# e.g. from OCRUSREX import ocrusrex

# Don't forget that, if these imports are not already available, you'll need to list them out in the
# required dependencies so that Gremlin can install them in the environment.

########################################################################################################################

# user-defined functions to run on docs should expect the following inputs:
#
# docText = extracted document text
# docType = file extension
# docName = file name
# docByteObj = actual document binary in bytes
# logger = Gremlin database logger (resuts will are available via API)
# scriptInputs = inputs for this script (NOT IMPLEMENTED. Will be NONE)
# previousData = the combined output data from the previous step. If previous step was run in parallel on all docs, results are packed up into one json.
#
# the logger object will be a special instance of the logger just for user scripts and
# will write out messages to the Gremlin UI (not implemented yet). Currently these
# are stored in the underlying Celery logs.

def pythonFunction(*args, docText=None, docType=None, docName=None, docByteObj=None, nodeInputs={}, jobInputs={},
                   previousData={}, dataZip=None, logger=None, **kwargs):
    # logging - use the logger object passed in:
    # 1) logger.info("...")
    # 2) logger.warn("...")
    # 3) logger.error("...")
    logger.info("New function active")

    # return values - your function must return a tuple of the following form:
    #	( Completed, Message, Data, FileBytesObj, FileExtension, File Packaging Instructions)
    #		  |         |       |        |              |
    #	   Boolean    String  JSON    Bytes Obj       String        Dictionary
    #
    #   You must provided a value for Completed and Message. Everything else can
    #   Be returned as None or an empy object. If there is no data, return an
    #   empty JSON {}. If there is no file to return return None for the FileBytesObj
    #   and None for the File Extension. Otherwise, return the BytesObj representing
    #   the file that should be stored, along with the file extension. File names
    #   are currently determined automatically, though that may change.

    # Script must return the following variables:
    #
    # (finished, message, dataObj, fileBytes, fileExt, docPackagingObj)
    #
    # finished  -   Return True if script runs successfully. False if not.
    # message   -   A string stored in the job status log. This can be an empty string if you don't need this.
    # dataObj - this should be a dict of return values produced by your script. Any valid dict is OK.
    # fileBytes - if you want to create a file and package it, pass the bytes of the file object back to Gremlin
    # fileExt   - if you return file bytes, this is the extension the packager will put on the file bytes.
    #
    # finished, message, dataObj, fileBytes, fileExt
    #

    return True, "Success Message!", {}, None, None`;

export const job_script = `# Required Imports #####################################################################################################

# e.g. from OCRUSREX import ocrusrex

# Don't forget that, if these imports are not already available, you'll need to list them out in the
# required dependencies so that Gremlin can install them in the environment.

########################################################################################################################

# user-defined functions to run on docs should expect the following, read-only objects:
# job (THIS WILL BE DECONSTRUCTED IN FUTURE RELEASE INTO JSON OBJ /DICT)
# step (THIS WILL BE DECONSTRUCTED IN FUTURE RELEASE INTO JSON OBJ /DICT)
#
#
# the logger object will be a special instance of the logger just for user scripts and
# will write out messages to the Gremlin UI (not implemented yet). Currently these
# are stored in the underlying Celery logs.


def pythonFunction(*args, job=None, step=None, logger=None, nodeInputs={}, jobInputs={}, previousData={}, dataZip=None,
                   **kwargs):
    # logging - use the logger object passed in:
    # 1) logger.info("...")
    # 2) logger.warn("...")
    # 3) logger.error("...")
    logger.info("New function active")

    # Return values - your function must return a tuple of the following form:
    #   (Completed, Message, Data, FileBytesObj, FileExtension, File Packaging Instructions)
    #              |        |     |            |              |
    #     Boolean  | String |JSON |  Bytes Obj |    String    |           Dictionary
    #
    #   You must provided a value for Completed and Message. Everything else can
    #   Be returned as None or an empy object. If there is no data, return an
    #   empty JSON {}. If there is no file to return return None for the FileBytesObj
    #   and None for the File Extension. Otherwise, return the BytesObj representing
    #   the file that should be stored, along with the file extension. File names
    #   are currently determined automatically, though that may change.
    #
    # Script must return the following variables:
    #
    # (finished, message, dataObj, fileBytes, fileExt, docPackagingObj)
    #
    # finished  -   Return True if script runs successfully. False if not.
    # message   -   A string stored in the job status log. This can be an empty string if you don't need this.
    # dataObj - this should be a dict of return values produced by your script. Any valid dict is OK.
    # fileBytes - if you want to create a file and package it, pass the bytes of the file object back to Gremlin
    # fileExt   - if you return file bytes, this is the extension the packager will put on the file bytes.
    # docPackagingObj - if you want to return the original documents, you can specify how those get packaged
    #                   with subfolders and the like. See separate instructions.

    return True, "Success Message!", {}, None, None, None
`;