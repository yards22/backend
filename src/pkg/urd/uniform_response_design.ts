enum Status {
  OK = 200,
  Created = 201,
  Accepted = 202,

  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  Conflict = 409,

  InternalServerError = 500,
}

export function ROk<T>(data?: T | any, message?: string) {
  return {
    status: Status.OK,
    data,
    message,
  };
}

export function RCreated<T>(data?: T | any, message?: string) {
  return {
    status: Status.Created,
    data,
    message,
  };
}

export function RAccepted<T>(data?: T | any, message?: string) {
  return {
    status: Status.Accepted,
    data,
    message,
  };
}

export function RBadRequest<T>(data?: T | any, message?: string) {
  return {
    status: Status.BadRequest,
    data,
    message,
  };
}

export function RUnauthorized<T>(data?: T | any, message?: string) {
  return {
    status: Status.Unauthorized,
    data,
    message,
  };
}

export function RForbidden<T>(data?: T | any, message?: string) {
  return {
    status: Status.Forbidden,
    data,
    message,
  };
}

export function RNotFound<T>(data?: T | any, message?: string) {
  return {
    status: Status.NotFound,
    data,
    message,
  };
}

export function RNotAllowed<T>(data?: T | any, message?: string) {
  return {
    status: Status.MethodNotAllowed,
    data,
    message,
  };
}

export function RNotAcceptable<T>(data?: T | any, message?: string) {
  return {
    status: Status.NotAcceptable,
    data,
    message,
  };
}

export function RConflict<T>(data?: T | any, message?: string) {
  return {
    status: Status.Conflict,
    data,
    message,
  };
}

export function RUnknownError<T>(data?: T | any, message?: string) {
  return {
    status: Status.InternalServerError,
    data,
    message,
  };
}
