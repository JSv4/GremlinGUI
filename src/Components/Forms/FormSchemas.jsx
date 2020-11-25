//########################### USER SIGNUP FORM #################################

export const newUserForm_Schema = {
    title: "Invite New User",
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "Name:"
      },
      username: {
        type: "string",
        title: "Username:"
      },
      email: {
        type: "string",
        title: "E-Mail:"
      },
      role: {
        title: "User Type:",
        type: "string",
        hint: "What level of user permissions should new user have?",
        enum: ["LAWYER", "ADMIN", "LEGAL_ENG"],
        enumNames: ["Lawyer", "Administrator", "Legal Engineer"]
      },
    },
    required: ['name', 'username', 'email', 'role']
  };

export const newUserForm_Ui_Schema = {
    role: {
        "ui:placeholder": "Choose user type"
    }
};

//########################### RESET PASSWORD FORM #################################

export const resetPassword_Schema = {
  title: "Change My Password",
  type: "object",
  properties: {
    old_password: {
      type: "string",
      title: "Old Password:"
    },
    new_password: {
      type: "string",
      title: "New Password:"
    },
    new_password2: {
      type: "string",
      title: "Confirm New Password:"
    },
  },
  required: ['old_password', 'new_password', 'new_password2']
};

export const resetPassword_Ui_Schema = {
  old_password: {
    "ui:widget": "password"
  },
  new_password: {
    "ui:widget": "password"
  },
  new_password2: {
    "ui:widget": "password"
  }
};

//########################### CREATE JOB FORM #################################

export const newJob_Schema = {
  title: "Create Job",
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "Job Name:"
    },
    notification_email: {
      type: "string",
      title: "Notification email (when job completes):"
    },
  },
  required: ['properties', 'notification_email']
};

export const newJob_Ui_Schema = {
  name: {
    "ui:placeholder": "Give this job a name you can use to find it later."
  },
  notification_email: {
    "ui:placeholder": "(Optional) Enter an e-mail to receive a notification when this job completes."
  }
};