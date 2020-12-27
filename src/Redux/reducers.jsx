import { combineReducers } from 'redux';
import _ from 'lodash';

// Haven't moved all of these actions to their own .js files yet.
// They'll stay here for now. Low priority until after release. 
import { 
  // Document actions
  ADD_DOCUMENT,
  RECEIVE_DOCUMENTS, 
  UPDATE_DOCUMENT,
  REMOVE_DOCUMENT,
  CLEAR_DOCUMENTS,
  CHANGE_DOCUMENT_PAGE,
  SET_DOCUMENTS_LOADING,

  // Result actions
  ADD_RESULT,
  RECEIVE_RESULTS,
  UPDATE_RESULT,
  REMOVE_RESULT,
  CLEAR_RESULTS,
  SELECT_RESULT,
  SET_RESULTS_SEARCH_STRING,
  CLEAR_SELECTED_RESULT,
  CHANGE_RESULT_PAGE,
  SET_RESULTS_LOADING,
 
  // Script actions
  CLEAR_SELECTED_SCRIPT,
  SET_SCRIPTS_LOADING,
  SET_SCRIPT_DETAILS_LOADING,
  REQUEST_SCRIPT_DETAILS,
  RECEIVE_SCRIPT_DETAILS,
  ADD_SCRIPT,
  RECEIVE_SCRIPTS,
  UPDATE_SCRIPT,
  REMOVE_SCRIPT,
  CLEAR_SCRIPTS,
  SELECT_SCRIPT,

  // Test suite actions
  SET_TEST_TRANSFORM_LOADING,
  RECEIVE_TEST_TRANSFORM,
  RECEIVE_TEST_JOB,
  RECEIVE_TEST_DOCUMENTS,
  RECEIVE_TEST_RESULTS,
  UPDATE_TEST_JOB,
  CLEAR_TEST_DATA,
  SET_TEST_LOADING,
  SET_TEST_DOCUMENTS_LOADING,
  SET_TEST_RESULTS_LOADING,
  SET_TEST_DOCUMENT_PAGE,
  SET_TEST_RESULT_PAGE,
  SET_TEST_JOB_LOG_LOADING,
  SET_TEST_JOB_LOG,
  UPDATE_TEST_JOB_RESULT,
  ADD_TEST_JOB_STEP_LOG,
  CLEAR_TEST_JOB_LOGS,

  // Dash / aggregate actions
  RECEIVE_STATS,
  SET_STATS_LOADING,
  CLEAR_STATS
 } from './actions';

import {
  ADD_PIPELINE,
  RECEIVE_PIPELINES,
  RECEIVE_FULL_PIPELINE,
  UPDATE_PIPELINE,
  REMOVE_PIPELINE,
  CLEAR_PIPELINES,
  SELECT_PIPELINE,
  UNSELECT_PIPELINE,
  SET_PIPELINES_LOADING,
  CHANGE_PIPELINE_PAGE,
  SET_PIPELINE_SEARCH_STRING
} from './pipeline_actions';

 import {
  ADD_PIPELINENODE,
  RECEIVE_PIPELINENODES,
  UPDATE_PIPELINENODE,
  REMOVE_PIPELINENODE,
  CLEAR_PIPELINENODES,
  SELECT_PIPELINENODE,
  CLEAR_SELECTED_PIPELINENODE,
  SET_PIPELINENODES_LOADING
 } from './node_actions';

 import {
  LOGOUT,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  RECEIVE_USER,
  ADD_USER,
  RECEIVE_USERS,
  REMOVE_USER,
  CLEAR_USERS,
  CHANGE_USER_PAGE,
  SET_USERS_LOADING,
  SET_USER_NAME_FILTER,
  SET_USER_ROLE_FILTER
 } from './auth_actions';

 import {
  RECEIVE_JOBS,
  UPDATE_JOB,
  CLEAR_JOBS,
  SELECT_JOB,
  UNSELECT_JOB,
  CLEAR_SELECTED_JOB,
  SET_JOB_LOG_LOADING,
  ADD_JOB_STEP_LOG,
  SET_JOB_LOG,
  CLEAR_JOB_LOGS,
  SET_JOBS_LOADING,
  SET_JOB_SEARCH_STRING,
  CHANGE_JOB_PAGE,
 } from './job_actions';

 import {
  SELECT_EDGE,
  UNSELECT_EDGE,
  ADD_EDGE,
  RECEIVE_EDGES,
  UPDATE_EDGE,
  REMOVE_EDGE,
  CLEAR_EDGES,
  SET_EDGES_LOADING,
 } from './edge_actions';

 import {
  UPDATE_NEW_JOB_NAME,
  NEW_JOB_MODAL_TOGGLE,
  SCRIPT_MODAL_TOGGLE,
  NEW_SCRIPT_MODAL_TOGGLE,
  PIPELINE_MODAL_TOGGLE,
  NEW_PIPELINE_MODAL_TOGGLE,
  INVITE_USER_MODAL_TOGGLE,
  LOGIN_MODAL_TOGGLE,
  SELECT_TAB,
  UPDATE_JOB_NAME_FILTER,
  UPDATE_SCRIPT_NAME_FILTER,
  UPDATE_PIPELINE_NAME_FILTER,
  SHOW_ERROR_JOBS,
  SHOW_STARTED_JOBS,
  SHOW_QUEUED_JOBS,
  SHOW_FINISHED_JOBS,
  TOGGLE_BUILD_MODE
 } from './app_actions';

 function jobs(
  state = {
    loading: false,
    items: [],
    selectedJobId: -1,
    selectedJobLog: "",
    jobStepLogs: {},
    logs_loading: false,
    count: 0,
    selectedPage:1,
    total_pages:1,
    searchString:'',
  }, action) {
    switch (action.type) {
      case RECEIVE_JOBS:
        return Object.assign({}, state, {
          items: action.response.data.results,
          count: action.response.data.count,
          total_pages: action.response.data.total_pages,
          loading: false
        });
      case UPDATE_JOB:
        var oldJob = _.find(state.items, {id: action.updatedJob.id});
        var items = [...state.items];
        var index = _.findIndex(items, {id: action.updatedJob.id});
        items.splice(index, 1, {...oldJob, ...action.updatedJob});
        return Object.assign({}, state, {
          loading:false,
          items
        });
      case CLEAR_JOBS:
        return Object.assign({}, state, {
          loading: false,
          items: [],
          selectedJobId: -1,
          selectedJobLog: "",
          jobStepLogs: {},
          logs_loading: false,
          count: 0,
          selectedPage:1,
          total_pages:1,
          searchString:'',
        })
      case UNSELECT_JOB:
        return Object.assign({}, state, {
          selectedJobId: -1,
        })
      case SELECT_JOB:
        return Object.assign({}, state, {
          selectedJobId: action.selectedJobId,
        })
      case CLEAR_SELECTED_JOB:
        return Object.assign({}, state, {
          selectedJobId: -1,
        })
      case SET_JOBS_LOADING:
        return Object.assign({}, state, {
          loading: action.loading
        })
      case SET_JOB_LOG_LOADING:
        return Object.assign({}, state, {
          logs_loading: action.loading
        })
      case SET_JOB_LOG:
        return Object.assign({}, state, {
          selectedJobLog: action.log,
          logs_loading: false
        })
      case ADD_JOB_STEP_LOG:
        let newJobStepLogs = {...state.result_logs};
        newJobStepLogs[action.stepId] = action.log;
        return Object.assign({}, state, {
          jobStepLogs: newJobStepLogs,
          logs_loading: false
        });
      case CLEAR_JOB_LOGS:
        return Object.assign({}, state, {
          jobStepLogs: {},
          selectedJobLog: ""
        });
      case SET_JOB_SEARCH_STRING:
        return Object.assign({}, state, {
          searchString: action.searchString
        });
      case CHANGE_JOB_PAGE:
        return Object.assign({}, state, {
          selectedPage: action.selectedPage
        })
      default:
        return state
    }
}

function test_job(
  state = {
    loading: false,
    logs_loading: false,
    documents_loading: false, 
    results_loading: false,
    digraph_loading: false,
    transform_loading: false,
    test_transforms: {},
    test_job: null,
    testJobLog: "",
    testJobStepLogs: [],
    test_documents: [],
    document_count: 0,
    document_page: 1,
    document_pages: 1,
    test_results: [],
    result_count: 0,
    result_page: 1,
    result_pages: 1,
  }, 
  action) {
    switch (action.type) {
      case RECEIVE_TEST_JOB:
        return Object.assign({}, state, {
          loading: false,
          test_job: action.test_job
        });
      case RECEIVE_TEST_DOCUMENTS:
        return Object.assign({}, state, {
          documents_loading: false,
          test_documents: action.response.data.results,
          document_pages: action.response.data.total_pages,
          document_count: action.response.data.count,
        });
      case RECEIVE_TEST_RESULTS:
        return Object.assign({}, state, {
          results_loading: false,
          test_results: action.response.data
        });
      case UPDATE_TEST_JOB_RESULT:    
        var test_results = [...state.test_results.filter(function(item) {return item.id !== action.updatedResult.id})];
        console.log("Filtered test_results: ", test_results);
        console.log(Array.isArray(test_results));
        test_results.push(action.updatedResult);
        return Object.assign({}, state, {
          test_results,
          results_loading: false,
        });
      case UPDATE_TEST_JOB:
        return Object.assign({}, state, {
          test_job: action.updatedJob,
          loading: false
        });
      case CLEAR_TEST_DATA:
        return Object.assign({}, state, {
          loading: false,
          logs_loading: false,
          documents_loading: false, 
          results_loading: false,
          transform_loading: false,
          test_transforms: {},
          test_job: null,
          testJobLog: "",
          testJobStepLogs: [],
          test_documents: [],
          document_count: 0,
          document_page: 1,
          document_pages: 1,
          test_results: [],
          result_count: 0,
          result_page: 1,
          result_pages: 1,
        });

      case SET_TEST_LOADING:
        return Object.assign({}, state, {
          loading: action.loading
        });
      case SET_TEST_RESULTS_LOADING:
        return Object.assign({}, state, {
          results_loading: action.loading
        });

      case SET_TEST_DOCUMENTS_LOADING:
        return Object.assign({}, state, {
          documents_loading: action.loading
        });

      case SET_TEST_DOCUMENT_PAGE:
        return Object.assign({}, state, {
          document_page: action.selectedPage
        });

      case SET_TEST_RESULT_PAGE:
        return Object.assign({}, state, {
          result_page: action.selectedPage
        });

      case SET_TEST_JOB_LOG_LOADING:
        return Object.assign({}, state, {
          logs_loading: action.loading
        });

      case SET_TEST_JOB_LOG:
        return Object.assign({}, state, {
          testJobLog: action.log,
          logs_loading: false
        });

      case ADD_TEST_JOB_STEP_LOG:
        let newJobStepLogs = {...state.testJobStepLogs};
        newJobStepLogs[action.stepId] = action.log;
        return Object.assign({}, state, {
          testJobStepLogs: newJobStepLogs,
          logs_loading: false
        });

      case CLEAR_TEST_JOB_LOGS:
        return Object.assign({}, state, {
          logs_loading: false,
          testJobLog: "",
          testJobStepLogs: [],
        });

      case SET_TEST_TRANSFORM_LOADING:
        return Object.assign({}, state, {
          transform_loading: action.loading
        });

      case RECEIVE_TEST_TRANSFORM:
    
        let transformed_data = { ...state.test_transforms };
        transformed_data[action.resultId] = action.transformed_input;
        console.log("New test transforms: ", transformed_data);
      
        return Object.assign({}, state, {
          transform_loading: false,
          test_transforms: transformed_data
        });
      default:
        return state;
    }
  }

function documents(
  state = {
    loading: false,
    items: [],
    pages: 1,
    count: 0,
    page_size: 10,
    selectedPage: 1,
  },
  action) {
  switch (action.type) {
    case ADD_DOCUMENT:
      return Object.assign({}, state, {
        items: [...state.items, action.newDocument]
      })
    case RECEIVE_DOCUMENTS:
      return Object.assign({}, state, {
        loading: false,
        documentsAreFetching: false,
        items: action.response.results,
        pages: action.response.total_pages,
        count: action.response.count,
        page_size: action.response.page_size
      })
    case UPDATE_DOCUMENT:
      let revisedDocuments = state.items.filter(function(item) {return item.id !== action.updatedDoc.id}); //remove old job object with updated job object's id.
      revisedDocuments.push(action.updatedDoc);
      return Object.assign({}, state, {
        items: revisedDocuments,
    })
    case REMOVE_DOCUMENT:
      return Object.assign({}, state, {
        items: state.items.filter(function(item) {return item.id !== action.documentId})
    })
    case CLEAR_DOCUMENTS:
      return Object.assign({}, state, {
        loading: false,
        items: [],
        pages: 1,
        count: 0,
        page_size: 10,
        selectedPage: 1,
      })
    case CHANGE_DOCUMENT_PAGE:
      return Object.assign({}, state, {
        selectedPage: action.selectedPage
      })
    case SET_DOCUMENTS_LOADING:
      return Object.assign({}, state, {
        loading: action.loading
      })
    default:
      return state
  }
}

function results(state = {
  loading: false,
  items: [],
  pages: 1,
  count: 0,
  selectedPage: 1,
  selectedResultId: -1,
  searchString:'',
}, action) {
  switch(action.type) {
    case ADD_RESULT:
      return Object.assign({}, state, {
        items: [...state.items, action.newResult]
      });

    case RECEIVE_RESULTS: 
      return Object.assign({}, state, {
        loading: false,
        items: action.response.data,
      });

    case UPDATE_RESULT:
      var oldResult = _.find(state.items, {id: action.updatedResult.id});
      var items = [...state.items];
      var index = _.findIndex(items, {id: action.updatedResult.id});
      items.splice(index, 1, {...oldResult, ...action.updatedResult});
      return Object.assign({}, state, {
        loading:false,
        items
      });

    case REMOVE_RESULT: 
      var items = [...state.items];
      var index = _.findIndex(items, {id: action.resultId});
      items.splice(index, 1);
      return Object.assign({}, state, {
        items
      });

    case CLEAR_RESULTS:

      return Object.assign({}, state, {
        loading: false,
        items: [],
        pages: 1,
        count: 0,
        selectedPage: 1,
        selectedResultId: -1,
        searchString:''
      });

    case SELECT_RESULT:
      return Object.assign({}, state, {
        selectedResultId: action.selectedResultId
      });

    case CLEAR_SELECTED_RESULT:
      return Object.assign({}, state, {
        selectedResultId: -1
      });

    case CHANGE_RESULT_PAGE:
      return Object.assign({}, state, {
        selectedPage: action.selectedPage
      });

    case SET_RESULTS_LOADING:
      return Object.assign({}, state, {
        loading: action.loading
      });

    case SET_RESULTS_SEARCH_STRING:
      return Object.assign({}, state, {
        searchString: action.searchString
      })

    default:
      return state;
  }
}

function pipelines(
  state = {
    loading: false,
    items: [],
    pipelineSearchText: "",
    selectedPipelineId: -1,
    pages:1,
    count:0, 
    page_size:5,
    selectedPage:1
  }, action) {
    switch (action.type) {
      case ADD_PIPELINE:
        return Object.assign({}, state, {
          items: [...state.items, action.newPipeline],
          loading: false
        })
      case RECEIVE_PIPELINES:
        return Object.assign({}, state, {
          loading: false,
          items: _.sortBy(action.response.data.results, 'id'),
          count: action.response.data.count,
          page_size: action.response.data.page_size,
          pages: action.response.data.total_pages
        });

      case UPDATE_PIPELINE:
        var oldPipeline = _.find(state.items, {id: action.updatedPipeline.id});
        var items = [...state.items];
        var index = _.findIndex(items, {id: action.updatedPipeline.id});
        items.splice(index, 1, {...oldPipeline, ...action.updatedPipeline});
        return Object.assign({}, state, {
          loading: false,
          items
        });

      case REMOVE_PIPELINE:
        var items = [...state.items];
        var index = _.findIndex(items, {id: action.pipelineId});
        items.splice(index, 1);
        return Object.assign({}, state, {
          items
        });

      case CHANGE_PIPELINE_PAGE:
        return Object.assign({}, state, {
          selectedPage: action.selectedPage
        });

      case SET_PIPELINE_SEARCH_STRING:
        return Object.assign({}, state, {
          pipelineSearchText: action.pipelineSearchText
        });

      case CLEAR_PIPELINES:
        return Object.assign({}, state, {
          items: [],
          loading: false,
          pipelineSearchText:"",
          selectedPipelineId: -1,
          pages:1,
          count:0, 
          page_size:5,
          selectedPage:1
        })
      case SELECT_PIPELINE:
        return Object.assign({}, state, {
          selectedPipelineId: action.selectedPipelineId,
        })
      case UNSELECT_PIPELINE:
        return Object.assign({}, state, {
          selectedPipelineId: -1,
        })
      case SET_PIPELINES_LOADING:
        return Object.assign({}, state, {
          loading: action.loading
        })
      default:
        return state
    }
  }

  function edges(
    state = {
      items: [],
      loading: true,
      selectedEdgeId:-1
    }, action) {
      switch(action.type) {
        
        case UNSELECT_EDGE:

          return Object.assign({}, state, {
            selectedEdgeId:-1
          });

        case SELECT_EDGE:
          
          return Object.assign({}, state, {
            selectedEdgeId: action.id
          });
        
        case RECEIVE_EDGES: 
          
          console.log("Received edges", action);

          return Object.assign({}, state, {
            items: action.items,
            loading: false
          });

        case ADD_EDGE:

          return Object.assign({}, state, {
            items: [...state.items, action.edge],
            loading: false
          });

        case UPDATE_EDGE:

          // Find old item, merge in new values, and then replace it at same index position (last part is critical, otherwise display views show lists jumping around)
          var oldEdge = _.find(state.items, {id: action.updatedEdge.id});
          var items = [...state.items];
          var index = _.findIndex(items, {id: action.updatedEdge.id});
          items.splice(index, 1, {...oldEdge, ...action.updatedEdge});
        
          return Object.assign({}, state, {
            items,
            loading: false
          });

        case REMOVE_EDGE:

          var items = [...state.items];
          var index = _.findIndex(items, {id: action.edgeId});
          items.splice(index, 1);
          
          return Object.assign({}, state, {
            items,
            loading: false
          });

        case CLEAR_EDGES:

          return Object.assign({}, state, {
            items: [],
            loading: true,
            selectedEdgeId:-1
          });

        case SET_EDGES_LOADING:

          return Object.assign({}, state, {
            loading: action.loading,
          });

        default:
          return state
      }
  }

  function pipelinesteps(
    state = {
      stepsAreFetching: false,
      items: [],
      lastUpdated: null,
      selectedPipelineStepId:-1,
    }, action) {
      switch (action.type) {
        case ADD_PIPELINENODE:
          return Object.assign({}, state, {
            items: [...state.items, action.newPipelineStep]
          })
        case RECEIVE_PIPELINENODES:
          return Object.assign({}, state, {
            loading: false,
            items: action.items,
          })
        case UPDATE_PIPELINENODE:
          var oldNode = _.find(state.items, {id: action.updatedPipelineStep.id});
          var items = [...state.items];
          var index = _.findIndex(items, {id: action.updatedPipelineStep.id});
          items.splice(index, 1, {...oldNode, ...action.updatedPipelineStep});
          return Object.assign({}, state, {
            items: items,
          });
        case REMOVE_PIPELINENODE:
          var items = [...state.items];
          var index = _.findIndex(items, {id: action.pipelineStepId});
          items.splice(index, 1);

          return Object.assign({}, state, {
            items
          });
        case CLEAR_PIPELINENODES:
          return Object.assign({}, state, {
            items: [],
            loading: false
          })
        case SELECT_PIPELINENODE:
          return Object.assign({}, state, {
            selectedPipelineStepId: action.selectedPipelineStepId,
          })
        case CLEAR_SELECTED_PIPELINENODE:
          return Object.assign({}, state, {
            selectedPipelineStepId: -1,
          })
        case SET_PIPELINENODES_LOADING:
          return Object.assign({}, state, {
            loading: action.loading
          })
        default:
          return state
      }
    }


function scripts(
  state = {
    loading: false,
    detailsLoading: false,
    items: [],
    selectedScriptData: null,
    selectedScriptId: -1,
  }, action) {
    switch (action.type) {
      case ADD_SCRIPT:
        return Object.assign({}, state, {
          items: [...state.items, action.newScript]
        })
      case RECEIVE_SCRIPTS:
        return Object.assign({}, state, {
          loading: false,
          items: action.response.data,
        })
      case UPDATE_SCRIPT:

        // Find old item, merge in new values, and then replace it at same index position (last part is critical, otherwise display views show lists jumping around)
        var oldScript = _.find(state.items, {id: action.updatedScript.id});
        var items = [...state.items];
        var index = _.findIndex(items, {id: action.updatedScript.id});
        items.splice(index, 1, {...oldScript, ...action.updatedScript});
      
        return Object.assign({}, state, {
          items,
          loading: false
        });
      
      case REMOVE_SCRIPT:
        var items = [...state.items];
        var index = _.findIndex(items, {id: action.scriptId});
        items.splice(index, 1);

        return Object.assign({}, state, {
          items
        });

      case CLEAR_SCRIPTS:
        return Object.assign({}, state, {
          items: [],
        })
      case SELECT_SCRIPT:
        return Object.assign({}, state, {
          selectedScriptId: action.selectedScriptId,
        })
      case CLEAR_SELECTED_SCRIPT:
        return Object.assign({}, state, {
          loading: false,
          selectedScriptData: null,
          selectedScriptId: -1
        })
      case SET_SCRIPTS_LOADING:
        return Object.assign({}, state, {
          loading: action.loading
        })
      case SET_SCRIPT_DETAILS_LOADING:
        return Object.assign({}, state, {
          detailsLoading: action.loading
        })
      case REQUEST_SCRIPT_DETAILS:
        return Object.assign({}, state, {
          detailsLoading: true,
          selectedScriptData: null
        })
      case RECEIVE_SCRIPT_DETAILS:
        return Object.assign({}, state, {
          detailsLoading: false,
          selectedScriptData: action.response.data
        })
      default:
        return state
    }
  }


function application(state = {
  newJobName:"",
  showNewJobModal: false,
  showScriptModal: false,
  showNewScriptModal: false,
  showPipelineModal: false,
  showNewPipelineModal: false,
  showInviteUserModal: false,
  showLoginModal: false,
  jobNameFilter: '',
  scriptNameFilter: '',
  pipelineNameFilter: '',
  filterByErrorJobs: false,
  filterByStartedJobs: false, 
  filterByQueuedJobs: false,
  filterByFinishedJobs: false,
  activeDigraph:null,
  selectedTabIndex:0
}, action) {
  switch(action.type) {
    case UPDATE_NEW_JOB_NAME:
          return Object.assign({}, state, {
            newJobName: action.newJobName,
          })
    case NEW_JOB_MODAL_TOGGLE:
      return Object.assign({}, state, {
        showNewJobModal: !state.showNewJobModal
      });
    case NEW_SCRIPT_MODAL_TOGGLE:
      return Object.assign({}, state, {
        showNewScriptModal: !state.showNewScriptModal
      });
    case INVITE_USER_MODAL_TOGGLE:
      return Object.assign({}, state, {
        showInviteUserModal: !state.showInviteUserModal
      });
    case SCRIPT_MODAL_TOGGLE:
      return Object.assign({}, state, {
        showScriptModal: !state.showScriptModal
      });
    case NEW_PIPELINE_MODAL_TOGGLE:
      return Object.assign({}, state, {
        showNewPipelineModal: !state.showNewPipelineModal
      });
    case PIPELINE_MODAL_TOGGLE:
      return Object.assign({}, state, {
        showPipelineModal: !state.showPipelineModal
      });
    case LOGIN_MODAL_TOGGLE:
      return Object.assign({}, state, {
        showLoginModal: !state.showLoginModal
      });
    case SELECT_TAB:
      return Object.assign({}, state, {
        selectedTabIndex: action.selectedTabIndex
      });
    case UPDATE_JOB_NAME_FILTER:
      return Object.assign({}, state, {
        jobNameFilter: action.filter
      });
    case UPDATE_SCRIPT_NAME_FILTER:
      return Object.assign({}, state, {
        scriptNameFilter: action.filter
      });
    case UPDATE_PIPELINE_NAME_FILTER:
      return Object.assign({}, state, {
        pipelineNameFilter: action.filter
      });
    case SHOW_STARTED_JOBS:
      return Object.assign({}, state, {
        filterByStartedJobs: action.filter
      });
    case SHOW_ERROR_JOBS:
      return Object.assign({}, state, {
        filterByErrorJobs: action.filter
      });
    case SHOW_QUEUED_JOBS:
      return Object.assign({}, state, {
        filterByQueuedJobs: action.filter
      });
    case SHOW_FINISHED_JOBS:
      return Object.assign({}, state, {
        filterByFinishedJobs: action.filter
      });
    case TOGGLE_BUILD_MODE: 
      return Object.assign({}, state, {
        buildMode: !state.buildMode
      });
    default:
      return state;
  }
}

function system(state = {
  user_count: 0,
  doc_count: 0,
  parsed_doc_count: 0,
  queued_job_count:	0,
  running_job_count: 0,
  error_job_count: 0,
  script_count:	0,
  pipeline_count:	0,
  loading: false
}, action) {
  switch(action.type) {
    case RECEIVE_STATS:
      return Object.assign({}, state, {
        ...action.stats,
        loading: false
      })
    case SET_STATS_LOADING:
      return Object.assign({}, state, {
        loading: action.loading
      })
    case CLEAR_STATS:
      return Object.assign({}, state, {
        user_count: 0,
        doc_count: 0,
        parsed_doc_count: 0,
        queued_job_count:	0,
        running_job_count: 0,
        error_job_count: 0,
        script_count:	0,
        pipeline_count:	0,
        loading: false
      })
    default:
      return state;
  }
}


function auth(state = {
  username: '',
  user:{},
  loggedIn: false,
  token:'',
  refreshToken: '',
  loginError: '',
  buildMode: false
}, action) {
  switch(action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        username: action.username,
        loggedIn: true,
        refreshToken: action.refreshToken,
        token: action.token,
        loginError: ''
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        username: '',
        loggedIn: false,
        refreshToken: '',
        token: '',
        loginError: action.error
      });
    case LOGOUT:
      return Object.assign({}, state, {
        username: '',
        user:{},
        loggedIn: false,
        refreshToken: '',
        token: '',
        loginError:''
      });
    case RECEIVE_USER:
      return Object.assign({}, state, {
        user: action.user
      });
    default:
      return state;
  }
}

function users(
  state = {
    loading: false,
    items: [],
    pages: 1,
    count: 0,
    page_size: 10,
    selectedPage: 1,
    searchText: "",
    searchRole: ""
  },
  action) {
  switch (action.type) {
    case ADD_USER:
      return Object.assign({}, state, {
        items: [...state.items, action.newDocument]
      })
    case RECEIVE_USERS:
      return Object.assign({}, state, {
        loading: false,
        items: action.response.results,
        pages: action.response.total_pages,
        count: action.response.count,
        page_size: action.response.page_size
      })
    case REMOVE_USER:
      return Object.assign({}, state, {
        items: state.items.filter(function(item) {return item.id !== action.userId})
    })
    case CLEAR_USERS:
      return Object.assign({}, state, {
        loading: false,
        items: [],
        pages: 1,
        count: 0,
        page_size: 10,
        selectedPage: 1,
        searchText: "",
        searchRole: ""
      })
    case SET_USER_NAME_FILTER:
      return Object.assign({}, state, {
        searchText: action.searchText
      })
    case SET_USER_ROLE_FILTER:
      return Object.assign({}, state, {
        searchRole: action.searchRole
      })
    case CHANGE_USER_PAGE:
      return Object.assign({}, state, {
        selectedPage: action.selectedPage
      })
    case SET_USERS_LOADING:
      return Object.assign({}, state, {
        loading: action.loading
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
    jobs,
    users,
    test_job,
    pipelines,
    pipelinesteps,
    edges,
    scripts,
    documents,
    results,
    application,
    system,
    auth
})

export default rootReducer;