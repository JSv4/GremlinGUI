import request from './request';
import authRequest from './authRequest';

//########################## RESULTS API CALLS ##########################
export const deleteResultRequest = (requestId, token) => {
  return request.delete(`/requests/${requestId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const downloadResult = (resultId, token) => {
  return request.get(`/Results/${resultId}/download/`, {
    responseType: 'blob',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const getFileResultsRequest = (selectedJobId, selectedPage, token) => {
  return request.get(`/FileResults/?job__id=${selectedJobId}&page=${selectedPage}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

//Bobby
export const getJobResultsRequest = (selectedJobId, selectedPage, token) => {
  return request.get(`/Results/?job__id=${selectedJobId}&page=${selectedPage}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const getResultsRequest = (selectedPage, searchString, token) => {
  return request.get(`/Results/?page=${selectedPage}&text_search=${searchString}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const getFullResultById = (resultId, token) => {
  return request.get(`/Results/${resultId}/get_full_obj/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const testNewTransformForStepResult = (resultId, input_transform, token) => {
  return request.put(`/Results/${resultId}/test_transform_script/`, 
    { input_transform },
    {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const getSummaryResultsForJob = (selectedJobId, token) => {
  return request.get(`/Jobs/${selectedJobId}/summary_results/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const getFullResultsForJob = (selectedJobId, token) => {
  return request.get(`/Jobs/${selectedJobId}/full_results/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

//########################## USER API CALLS ##############################
export const changePasswordRequest = (old_password, new_password, token) => {
  return request.post(`/ChangePassword/`,  
    { old_password, new_password },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000
    });
}

export const recoverUsernameRequest = (email) => {
  return authRequest.post(`/RecoverUsername/`,  
    { email },
    {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
}

export const resetPasswordRequest = (username) => {
  return authRequest.post(`/ResetPassword/`,  
    { username },
    {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
}

export const createNewUser = (userObjData, token) => {
  return request.put(`/InviteUser/`,  
    { ...userObjData },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
}

// Elevate or decrease user permissions (but backend won't let you demote admins unless you go through Django)
export const changeUserPermissions = (userId, role, token) => {
  return request.put(`/Users/${userId}/change_permissions/`, 
  {
    role
  },  
  {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const deleteUserRequest = (userId, token) => {
  return request.delete(`/Users/${userId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const getUsers = (selectedPage, searchString, role, token) => {
  return request.get(`/Users/?text_search=${searchString}&role=${role}&page=${selectedPage}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    timeout: 30000
  });
}

//########################## DOCUMENT API CALLS ##########################

//Nice tutorial re: this approach and structuring: https://medium.com/@fakiolinho/handle-blobs-requests-with-axios-the-right-way-bb905bdb1c04
export const uploadDocumentRequest = (file, job, token) => {

  const data = new FormData();
  data.append('file', file);
  data.append('name', file.name);
  data.append('rawText','');

  //note for later... if jobs were an array, just append a new batch field for each job you want to associate. Don't pass array
  if(job) data.append('job', job); 

  return request.post(`/Documents/`, data, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000,
  });
};

export const deleteDocumentRequest = (documentId, token) => {
  return request.delete(`/Documents/${documentId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const downloadDocument = (documentId, token) => {
  return request.get(`/Documents/${documentId}/download/`, {
    responseType: 'blob',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const getDocumentsForJob = (jobId, selectedPage, token) => {
  return request.get(`/Documents/?id=&name=&extracted=&job=${jobId}&page=${selectedPage}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    timeout: 30000
  });
}

//########################## JOB API CALLS ##########################

// For a given step of this job, get the script logs
export const getJobStepLogs = (jobId, stepId, token) => {
  return request.get(
    `/PipelineSteps/${stepId}/JobLogs/${jobId}/`,
    {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    }
  );
}

// Get logs for overall job pipeline execution (all of the Gremlin sys logs)
export const getJobLogs = (jobId, token) => {
  return request.get(
    `/Jobs/${jobId}/logs/`,
    {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    }
  );
}

export const runJobToNode = (jobId, endNodeId, token) => {
  return request.get(`/Jobs/${jobId}/RunToNode/${endNodeId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const createJobRequest = (jobObj, token) => {

  return request.post(
    '/Jobs/',
    {...jobObj},
    {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    }
  );
}

export const updateJobRequest = (jobObj, token) => {
  return request.patch(
    `/Jobs/${jobObj.id}/`,
    {...jobObj},
    {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    }
  );
}

export const getJobs = (selectedPage, searchString, token) => {
  return request.get(`/Jobs/?page=${selectedPage}&text_search=${searchString}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const getJobById = (jobId, token) => {
  return request.get(`/Jobs/${jobId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const deleteJobRequest = (jobId, token) => {
  return request.delete(`/Jobs/${jobId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const deleteAllResultsForJob = (jobId, token) => {
  return request.post(`/Jobs/${jobId}/reset_job/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const downloadJob = (jobId, token) => {
  return request.get(`/Jobs/${jobId}/download/`, {
    responseType: 'blob',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

//##################### PYTHON SCRIPT API CALLS ######################

export const uploadScriptDataFile =  (scriptId, data_file, token) => {

  const data = new FormData();
  data.append('data_file', data_file);

  return request.post(`/PythonScripts/${scriptId}/upload_data/`, data, {
    headers: {
      'Content-Disposition': `attachment; filename=${data_file.name}`,
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000,
  });
};

export const deleteScriptDataFile = (scriptId, token) => {
  return request.get(`/PythonScripts/${scriptId}/delete_data/`, {
    responseType: 'blob',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const downloadPythonScript = (scriptId, token) => {
  return request.get(`/PythonScripts/${scriptId}/exportArchive/`, {
    responseType: 'blob',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

//Nice tutorial re: this approach and structuring: https://medium.com/@fakiolinho/handle-blobs-requests-with-axios-the-right-way-bb905bdb1c04
export const uploadPythonScript = (file, token) => {

  const data = new FormData();
  data.append('file', file);

  return request.post(`/UploadScript/`, data, {
    headers: {
      'Content-Disposition': `attachment; filename=${file.name}`,
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000,
  });
};

export const deletePythonScript = (scriptId, token) => {
  return request.delete(`/PythonScripts/${scriptId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const createScript = (name, type, script, token) => {
  return request.post(
    '/PythonScripts/',
    {
      human_name: name,
      name: name.replace(" ","_").toUpperCase(),
      type,
      script
    },
    {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    }
  );
}

export const getAllPythonScripts = (token) => {
  return request.get(`/PythonScripts/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const getPythonScriptById = (scriptId, token) => {
  return request.get(`/PythonScripts/${scriptId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const getPythonScriptDetails = (token, id) => {
  return request.get(`/PythonScripts/${id}/GetDetails/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const updateScript = (scriptObj, token) => {
  return request.put(
    `/PythonScripts/${scriptObj.id}/UpdateDetails/`,
    {
      ...scriptObj
    },
    {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    }
  );
}

//##################### PIPELINE API CALLS ######################

export const exportPipelineZip = (pipelineId, token) => {
  return request.get(
    `/Pipelines/${pipelineId}/ExportToZip/`,
    {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000,
    }
  );
}

export const exportPipelineYAML = (pipelineId, token) => {
  return request.get(
    `/Pipelines/${pipelineId}/ExportToYAML/`,
    {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    }
  );
}

export const uploadPipelineYAML = (file, token) => {
  const data = new FormData();
  data.append('file', file);
  return request.post(`/UploadPipelineZip/`, data, {
    headers: {
      'Content-Disposition': `attachment; filename=${file.name}`,
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000,
  });
};


export const deletePipeline = (pipelineId, token) => {
  return request.delete(`/Pipelines/${pipelineId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const createPipeline = (pipelineObj, token) => {
  return request.post(
    '/Pipelines/',
    pipelineObj,
    {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    }
  );
}

export const createTestJobForPipeline = (pipelineId, token) => {
  return request.get(
    `/Pipelines/${pipelineId}/get_test_job/`,
    {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    }
  );
}

// Just gets the pipeline object with related model fields as ids only
export const getPipelineById = (pipelineId, token) => {
  return request.get(`/Pipelines/${pipelineId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

// Get the pipeline object with links and node objs. This can be immediately ingested into
// the digraph engine. 
export const getFullPipelineById = (pipelineId, token) => {
  return request.get(`/Pipelines/${pipelineId}/get_full_pipeline/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const getPipelineScripts = (pipelineId, token) => {
  return request.get(`/Pipelines/${pipelineId}/scripts/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const requestCreatePipelineEdge = (node, token) => {
  console.log("CreatePipelineEdges: ", node);  
  return request.post(`/PipelineEdges/`, node,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
} 

export const requestDeletePipelineEdge = (edgeId, token) => {
  return request.delete(`/PipelineEdges/${edgeId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const getPipelines = (searchText, selectedPage, token) => {
  return request.get(`/Pipelines/?text_search=${searchText}&page=${selectedPage}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const updatePipeline = (pipelineObj, token) => {
  return request.patch(`/Pipelines/${pipelineObj.id}/`,
    {
      ...pipelineObj
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000
    }
  );
}

//##################### PIPELINE STEP API CALLS ######################

export const getPipelineStepById = (pipelineStepId, token) => {
  return request.get(`/PipelineSteps/${pipelineStepId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  })
}

export const testStepTransform = (input_data, input_transform,  token) => {
  return request.put(`/PipelineSteps/test_transform_script/`, 
  { input_data, input_transform },
  {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  })
}
  
export const deletePipelineStep = (pipelineStepId, token) => {
  return request.delete(`/PipelineSteps/${pipelineStepId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const getPipelineSteps = (token) => {
  return request.get(`/PipelineSteps/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const getPipelineStepsForPipeline = (pipelineId, token) => {
  return request.get(`/PipelineSteps/?id=&name=&parent_pipeline=${pipelineId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

export const updatePipelineStep = (pipelineStepObj, token) => {
  return request.patch(
    `/PipelineSteps/${pipelineStepObj.id}/`,
    {
      ...pipelineStepObj
    },
    {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    }
  );
}

export const createPipelineStep = (newPipelineStepObj, token) => {
  return request.post(
    '/PipelineSteps/',
    {...newPipelineStepObj},
    {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    }
  );
}

//########################## SYSTEM STATS## ##########################
export const getSystemStats = (token) => {
  return request.get(`/SystemStats/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 30000
  });
}

//########################## AUTH API CALLS ##########################

export const loginForJWTToken = (username, password) => {
  return authRequest.post(
    `/token/`,
    {username, password},
    {
      headers: {
        'Content-Type': `application/json`
      },
      timeout: 10000,
    });
}

// Not actually using this... better approach was to use an axios intercept which can automatically
// retry requests that fail due to a 401 after refreshing the relevant token. Leaving this in case 
// needed for something. 
export const refreshJWTToken = (refresh) => {
  return authRequest.post(
    `/token/refresh/`,
    {refresh},
    {
      headers: {
        'Content-Type': `application/json`
      },
      timeout: 10000,
    });
}

export const requestUserDetails = (token) => {
  return request.get(
    `/User/me/`,
    {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    });
}
