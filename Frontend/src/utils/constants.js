export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";

export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/userInfo`;
export const UPDATE_PROFILE_DATA = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/add-profile-image`;
export const DELETE_PROFILE_IMAGE = `${AUTH_ROUTES}/delete-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`



export const CONTACT_ROUTES = "api/contact";

export const SEARCH_CONTACT_ROUTES = `${CONTACT_ROUTES}/search`;
export const GET_CONTACT_FOR_DM_ROUTES = `${CONTACT_ROUTES}/get_contact_for_dm`;
export const GET_ALL_CONTACTS_ROUTES = `${CONTACT_ROUTES}/get_all_contacts`;


export const MESSAGES_ROUTES = "api/messages";
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get_messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/upload_file`;


export const CHANNEL_ROUTES = "api/channel";
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/create_channel`;
export const GET_USER_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/get_user_channels`;
export const GET_CHANNEL_MESSAGES_ROUTE = `${CHANNEL_ROUTES}/get_channel_messages`;