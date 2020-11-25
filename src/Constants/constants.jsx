
// Helpful pointers re: exporting static object constnats:
// https://github.com/airbnb/javascript/issues/710
let jsonTemplates = {
    DEFAULT: {
        MESSAGE: "Please select a job or create a job."
    },
    ERROR: {
        MESSAGE: "ERROR - Invalid Job"
    },
    CLUSTER_DOCUMENTS: {
        auto_k_value:true,
        max_cluster_size:10
    },
    NER: {
        include: [
            'ORG',
            'DATE'
        ]
    },
    REGEX_REDACT: {
        redactText: "REDACTED",
        regexPatterns: [""],
    },
    REDACT_REGEX_AND_STRING_MATCH: {
        redactText: "REDACTED",
        regexPatterns: [""],
        searchStrings: ['']
    }
};

export {jsonTemplates};