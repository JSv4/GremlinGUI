export const emptyChart = {
    offset: { x: 0, y: 0 },
    scale: 1,
    selected: {},
    hovered: {},
    nodes: {},
    links: {},
  };

export const sampleDigraph = {
  links: {
    "2": {
      id: "2", 
      to: {
          nodeId: "4",
          portId: "input"
        }, 
      from: {
        nodeId: "3",
        portId: "output"}
    }
  }, 
  nodes: {
    "3": 
    {
      id: "3",
      name:"Pre-Processor",
      type: "ROOT_NODE",
      ports: {
        output: {
          id: "output", 
          type: "output"
        }
      }, 
      script: {
        id: -1,
        type: "RUN_ON_JOB_DOCS",
        human_name: "Pre Processor", 
        description: "Default pre-processor to ensure docx, doc and pdf files are extracted.",
        supported_file_types: ""
      }, 
      position: 
      {
        x: 275.0, 
        y: 101.0
      }, 
      settings: "",
      input_transform: ""
    }, 
    "4": {
      id: "4",
      ports: 
      {
        input: 
        {
          id: "input",
          type: "input"
        },
        output: 
        {
          id: "output",
          type: "output"
        }
      },
      script: 
      {
        id: 5,
        mode: "TEST",
        name: "OCR_PDF",
        type: "RUN_ON_JOB_DOCS_PARALLEL",
        locked: false,
        human_name: "OCR_PDF",
        description: "Uses OCRUSREX and Tesseract to OCR a pdf and return it as a searchable PDF.",
        supported_file_types: "[\".pdf\",\".pdfa\"]"
      },
      position: 
      {
        x: 452.0,
        y: 206.0
      },
      settings: "{}",
      input_transform: ""
    }
  }, 
  scale: 1.0,
  offset: 
  {
    x: 0,
    y: 0
  },
  hovered: {},
  selected: {}
};