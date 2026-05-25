type i18nType = {
  auth: {
    invalid_email_or_password: string;
    logout_successful: string;
    email_required: string;
    email_must_be_string: string;
    passwords_dont_match: string;
  };
  validation: {
    email_invalid: string;
    password_min_length: string;
    first_name_required: string;
    last_name_required: string;
    email_already_exists: string;
  };
  http_messages: {
    server_error: string;
    not_found: string;
    unauthorized: string;
    denied: string;
    resource_created: string;
    resource_deleted: string;
    invalid_email_or_password: string;
    login_successful: string;
    login_failed: string;
    logout_successful: string;
    registration_successful: string;
    registration_failed: string;
    email_already_exists: string;
    passwords_dont_match: string;
    validation_failed: string;
    update_profile_failed: string;
    database_connection_error: string;
    request_timeout: string;
  };
  permissions: {
    admin: {
      [key: string]: {
        sort?: string;
        create?: string;
        show: string;
        list: string;
        edit?: string;
        delete?: string;
        own?: string;
        publish?: string;
        review?: string;
        change_author?: string
        field?: {
          [key: string]: string;
        };
      };
    };
  };
}

export default i18nType;
