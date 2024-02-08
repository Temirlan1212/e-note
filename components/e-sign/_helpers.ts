export type ECPError = {
  code: number | null;
  message: string | null;
};

export enum SignType {
  Jacarta = "jacarta",
  Rutoken = "rutoken",
}

export const getRutokenErrorReason = (inputCode: number, errorCodes: any) => {
  let code: ECPError["code"] = -1;
  let message: ECPError["message"] = "Unknown error";

  switch (inputCode) {
    case errorCodes.ARGUMENTS_BAD:
      message = "Invalid argument";
      code = errorCodes.ARGUMENTS_BAD;
      break;
    case errorCodes.ATTRIBUTE_READ_ONLY:
      message = "Unable to set or modify the attribute value by the application";
      code = errorCodes.ATTRIBUTE_READ_ONLY;
      break;
    case errorCodes.ATTRIBUTE_SENSITIVE:
      message = "Attribute is not accessible for reading";
      code = errorCodes.ATTRIBUTE_SENSITIVE;
      break;
    case errorCodes.ATTRIBUTE_TYPE_INVALID:
      message = "Invalid attribute type";
      code = errorCodes.ATTRIBUTE_TYPE_INVALID;
      break;
    case errorCodes.ATTRIBUTE_VALUE_INVALID:
      message = "Invalid attribute value";
      code = errorCodes.ATTRIBUTE_VALUE_INVALID;
      break;
    case errorCodes.BUFFER_TOO_SMALL:
      message = "The size of the specified buffer is insufficient to output the results of the function execution";
      code = errorCodes.BUFFER_TOO_SMALL;
      break;
    case errorCodes.CANT_LOCK:
      message =
        "The library does not support locking to protect threads; returned only when calling the C_Initialize function";
      code = errorCodes.CANT_LOCK;
      break;
    case errorCodes.CRYPTOKI_ALREADY_INITIALIZED:
      message =
        "The library is already initialized (the previous call to the C_Initialize function was not accompanied by the corresponding call to the C_Finalize function); returned only when calling the C_Initialize function";
      code = errorCodes.CRYPTOKI_ALREADY_INITIALIZED;
      break;
    case errorCodes.CRYPTOKI_NOT_INITIALIZED:
      message =
        "The function cannot be executed because the library is not initialized; returned only when calling any function except C_Initialize and C_Finalize";
      code = errorCodes.CRYPTOKI_NOT_INITIALIZED;
      break;
    case errorCodes.DATA_INVALID:
      message = "Invalid input data for cryptographic operation";
      code = errorCodes.DATA_INVALID;
      break;
    case errorCodes.DATA_LEN_RANGE:
      message = "Input data has an incorrect size for performing a cryptographic operation";
      code = errorCodes.DATA_LEN_RANGE;
      break;
    case errorCodes.DEVICE_ERROR:
      message = "Error accessing the token or slot";
      code = errorCodes.DEVICE_ERROR;
      break;
    case errorCodes.DEVICE_MEMORY:
      message = "Insufficient token memory to perform the requested function";
      code = errorCodes.DEVICE_MEMORY;
      break;
    case errorCodes.DEVICE_REMOVED:
      message = "Token was removed from the slot during function execution";
      code = errorCodes.DEVICE_REMOVED;
      break;
    case errorCodes.DOMAIN_PARAMS_INVALID:
      message = "Incorrect or unsupported domain parameters passed to functions";
      code = errorCodes.DOMAIN_PARAMS_INVALID;
      break;
    case errorCodes.ENCRYPTED_DATA_INVALID:
      message = "Incorrectly encrypted data provided for decryption operation";
      code = errorCodes.ENCRYPTED_DATA_INVALID;
      break;
    case errorCodes.ENCRYPTED_DATA_LEN_RANGE:
      message = "Encrypted data provided for decryption operation is of incorrect length";
      code = errorCodes.ENCRYPTED_DATA_LEN_RANGE;
      break;
    case errorCodes.FUNCTION_CANCELED:
      message = "Execution of the function was canceled";
      code = errorCodes.FUNCTION_CANCELED;
      break;
    case errorCodes.FUNCTION_FAILED:
      message = "Failure occurred while executing the function";
      code = errorCodes.FUNCTION_FAILED;
      break;
    case errorCodes.FUNCTION_NOT_SUPPORTED:
      message = "Requested function is not supported by the library";
      code = errorCodes.FUNCTION_NOT_SUPPORTED;
      break;
    case errorCodes.FUNCTION_REJECTED:
      message = "Request for signature was rejected by the user";
      code = errorCodes.FUNCTION_REJECTED;
      break;
    case errorCodes.GENERAL_ERROR:
      message = "Critical error related to hardware";
      code = errorCodes.GENERAL_ERROR;
      break;
    case errorCodes.HOST_MEMORY:
      message = "Insufficient memory to perform function on the workstation where the library is installed";
      code = errorCodes.HOST_MEMORY;
      break;
    case errorCodes.KEY_FUNCTION_NOT_PERMITTED:
      message = "Key attributes do not allow the operation to be performed";
      code = errorCodes.KEY_FUNCTION_NOT_PERMITTED;
      break;
    case errorCodes.KEY_HANDLE_INVALID:
      message = "Invalid key handle passed to functions";
      code = errorCodes.KEY_HANDLE_INVALID;
      break;
    case errorCodes.KEY_NOT_WRAPPABLE:
      message = "Unable to wrap the key";
      code = errorCodes.KEY_NOT_WRAPPABLE;
      break;
    case errorCodes.KEY_SIZE_RANGE:
      message = "Invalid key size";
      code = errorCodes.KEY_SIZE_RANGE;
      break;
    case errorCodes.KEY_TYPE_INCONSISTENT:
      message = "Key type does not match the mechanism";
      code = errorCodes.KEY_TYPE_INCONSISTENT;
      break;
    case errorCodes.KEY_UNEXTRACTABLE:
      message = "Unable to wrap the key because the CKA_UNEXTRACTABLE attribute is set to CK_TRUE";
      code = errorCodes.KEY_UNEXTRACTABLE;
      break;
    case errorCodes.MECHANISM_INVALID:
      message = "Incorrect mechanism specified for cryptographic operation";
      code = errorCodes.MECHANISM_INVALID;
      break;
    case errorCodes.MECHANISM_PARAM_INVALID:
      message = "Incorrect mechanism parameters specified for cryptographic operation";
      code = errorCodes.MECHANISM_PARAM_INVALID;
      break;
    case errorCodes.NEED_TO_CREATE_THREADS:
      message = "Program does not support operating system internal methods to create new threads";
      code = errorCodes.NEED_TO_CREATE_THREADS;
      break;
    case errorCodes.OBJECT_HANDLE_INVALID:
      message = "Invalid object handle passed to functions";
      code = errorCodes.OBJECT_HANDLE_INVALID;
      break;
    case errorCodes.OPERATION_ACTIVE:
      message = "Operation cannot be performed because such operation is already in progress";
      code = errorCodes.OPERATION_ACTIVE;
      break;
    case errorCodes.OPERATION_NOT_INITIALIZED:
      message = "Operation cannot be performed in this session";
      code = errorCodes.OPERATION_NOT_INITIALIZED;
      break;
    case errorCodes.PIN_EXPIRED:
      message = "PIN code has expired";
      code = errorCodes.PIN_EXPIRED;
      break;
    case errorCodes.PIN_INCORRECT:
      message = "Incorrect PIN code provided, does not match the one stored on the token";
      code = errorCodes.PIN_INCORRECT;
      break;
    case errorCodes.PIN_INVALID:
      message = "PIN code contains invalid characters";
      code = errorCodes.PIN_INVALID;
      break;
    case errorCodes.PIN_LEN_RANGE:
      message = "Invalid PIN code length";
      code = errorCodes.PIN_LEN_RANGE;
      break;
    case errorCodes.PIN_LOCKED:
      message =
        "Authorization with this PIN code is not possible (exceeded the allowable limit of consecutive incorrect PIN code entries)";
      code = errorCodes.PIN_LOCKED;
      break;
    case errorCodes.RANDOM_NO_RNG:
      message = "This token does not support random number generation";
      code = errorCodes.RANDOM_NO_RNG;
      break;
    case errorCodes.SESSION_CLOSED:
      message = "Session was closed during function execution";
      code = errorCodes.SESSION_CLOSED;
      break;
    case errorCodes.SESSION_COUNT:
      message = "Maximum number of open sessions for this token has been reached";
      code = errorCodes.SESSION_COUNT;
      break;
    case errorCodes.SESSION_EXISTS:
      message = "Session with the token is already open, so the token cannot be initialized";
      code = errorCodes.SESSION_EXISTS;
      break;
    case errorCodes.SESSION_HANDLE_INVALID:
      message = "Invalid session handle passed to functions";
      code = errorCodes.SESSION_HANDLE_INVALID;
      break;
    case errorCodes.SESSION_PARALLEL_NOT_SUPPORTED:
      message = "This token does not support parallel sessions";
      code = errorCodes.SESSION_PARALLEL_NOT_SUPPORTED;
      break;
    case errorCodes.SESSION_READ_ONLY:
      message = "Action cannot be performed because this is an R/O session";
      code = errorCodes.SESSION_READ_ONLY;
      break;
    case errorCodes.SESSION_READ_WRITE_SO_EXISTS:
      message = "An R/W session is already open, so opening an R/O session is not possible";
      code = errorCodes.SESSION_READ_WRITE_SO_EXISTS;
      break;
    case errorCodes.SIGNATURE_INVALID:
      message = "Invalid digital signature value";
      code = errorCodes.SIGNATURE_INVALID;
      break;
    case errorCodes.SIGNATURE_LEN_RANGE:
      message = "Digital signature value is incorrect in length";
      code = errorCodes.SIGNATURE_LEN_RANGE;
      break;
    case errorCodes.SLOT_ID_INVALID:
      message = "Slot with the given ID does not exist";
      code = errorCodes.SLOT_ID_INVALID;
      break;
    case errorCodes.TEMPLATE_INCOMPLETE:
      message = "Insufficient attributes provided to create an object";
      code = errorCodes.TEMPLATE_INCOMPLETE;
      break;
    case errorCodes.TEMPLATE_INCONSISTENT:
      message = "The provided attributes contradict each other";
      code = errorCodes.TEMPLATE_INCONSISTENT;
      break;
    case errorCodes.TOKEN_NOT_PRESENT:
      message = "Token is not present in the slot during the function call";
      code = errorCodes.TOKEN_NOT_PRESENT;
      break;
    case errorCodes.UNWRAPPING_KEY_HANDLE_INVALID:
      message = "Invalid unwrapping key handle passed to functions";
      code = errorCodes.UNWRAPPING_KEY_HANDLE_INVALID;
      break;
    case errorCodes.UNWRAPPING_KEY_SIZE_RANGE:
      message = "Invalid unwrapping key size";
      code = errorCodes.UNWRAPPING_KEY_SIZE_RANGE;
      break;
    case errorCodes.UNWRAPPING_KEY_TYPE_INCONSISTENT:
      message = "Unwrapping key type does not match the mechanism";
      code = errorCodes.UNWRAPPING_KEY_TYPE_INCONSISTENT;
      break;
    case errorCodes.USER_ALREADY_LOGGED_IN:
      message = "The user is already logged in";
      code = errorCodes.USER_ALREADY_LOGGED_IN;
      break;
    case errorCodes.USER_ANOTHER_ALREADY_LOGGED_IN:
      message = "Another user is already logged in";
      code = errorCodes.USER_ANOTHER_ALREADY_LOGGED_IN;
      break;
    case errorCodes.USER_NOT_LOGGED_IN:
      message = "The corresponding user is not logged in";
      code = errorCodes.USER_NOT_LOGGED_IN;
      break;
    case errorCodes.USER_PIN_NOT_INITIALIZED:
      message = "User PIN code is not initialized";
      code = errorCodes.USER_PIN_NOT_INITIALIZED;
      break;
    case errorCodes.USER_TOO_MANY_TYPES:
      message = "Cannot authenticate both Administrator and User simultaneously";
      code = errorCodes.USER_TOO_MANY_TYPES;
      break;
    case errorCodes.USER_TYPE_INVALID:
      message = "Invalid user type specified";
      code = errorCodes.USER_TYPE_INVALID;
      break;
    case errorCodes.WRAPPED_KEY_INVALID:
      message = "Invalid wrapped key specified";
      code = errorCodes.WRAPPED_KEY_INVALID;
      break;
    case errorCodes.WRAPPED_KEY_LEN_RANGE:
      message = "Incorrect length of wrapped key specified";
      code = errorCodes.WRAPPED_KEY_LEN_RANGE;
      break;
    case errorCodes.WRAPPING_KEY_HANDLE_INVALID:
      message = "Invalid wrapping key handle passed to functions";
      code = errorCodes.WRAPPING_KEY_HANDLE_INVALID;
      break;
    case errorCodes.WRAPPING_KEY_SIZE_RANGE:
      message = "Invalid wrapping key size";
      code = errorCodes.WRAPPING_KEY_SIZE_RANGE;
      break;
    case errorCodes.WRAPPING_KEY_TYPE_INCONSISTENT:
      message = "Wrapping key type does not match the mechanism";
      code = errorCodes.WRAPPING_KEY_TYPE_INCONSISTENT;
      break;
    case errorCodes.BAD_PARAMS:
      message = "You have provided incomplete parameters";
      code = errorCodes.BAD_PARAMS;
      break;
  }

  return { code, message };
};

export const getJacartaErrorReason = (inputCode: number) => {
  let code: ECPError["code"] = -1;
  let message: ECPError["message"] = "Unknown error";

  switch (inputCode) {
    case 0x00002000:
      message = "Unknown error";
      code = 0x00002000;
      break;
    case 0x00000001:
      message = "User refused to perform the operation";
      code = 0x00000001;
      break;
    case 0x00000002:
      message = "Insufficient memory to perform the function";
      code = 0x00000002;
      break;
    case 0x00000003:
      message = "Invalid slot identifier";
      code = 0x00000003;
      break;
    case 0x00000005:
      message = "Critical hardware-related error or unsuccessful attempt to check the certification path";
      code = 0x00000005;
      break;
    case 0x00000054:
      message = "Function not supported";
      code = 0x00000054;
      break;
    case 0x00000006:
      message = "Function execution failed";
      code = 0x00000006;
      break;
    case 0x00000007:
      message = "Invalid argument";
      code = 0x00000007;
      break;
    case 0x00000010:
      message = "Attempt to assign a value to an attribute that cannot be modified";
      code = 0x00000010;
      break;
    case 0x00000012:
      message = "Invalid attribute type";
      code = 0x00000012;
      break;
    case 0x00000013:
      message = "Zero-length attribute";
      code = 0x00000013;
      break;
    case 0x00000030:
      message = "Error accessing the device or slot";
      code = 0x00000030;
      break;
    case 0x00000031:
      message = "Insufficient memory on the device to perform the function";
      code = 0x00000031;
      break;
    case 0x00000050:
      message = "Function execution timeout occurred";
      code = 0x00000050;
      break;
    case 0x00000060:
      message = "Invalid key descriptor passed to functions";
      code = 0x00000060;
      break;
    case 0x00000062:
      message = "Invalid key size";
      code = 0x00000062;
      break;
    case 0x00000063:
      message = "This key type cannot be used with this mechanism";
      code = 0x00000063;
      break;
    case 0x00000070:
      message = "Incorrect mechanism specified for cryptographic function execution";
      code = 0x00000070;
      break;
    case 0x00000071:
      message = "Incorrect mechanism parameters specified for cryptographic function execution";
      code = 0x00000071;
      break;
    case 0x00000082:
      message = "Invalid object descriptor passed to functions";
      code = 0x00000082;
      break;
    case 0x00000090:
      message = "One or more ongoing operations prevent the execution of a new operation";
      code = 0x00000090;
      break;
    case 0x00000091:
      message = "Execution of the operation without specifying parameters is impossible";
      code = 0x00000091;
      break;
    case 0x000000a0:
      message = "Invalid PIN code passed to functions";
      code = 0x000000a0;
      break;
    case 0x000000a2:
      message = "Invalid PIN code length";
      code = 0x000000a2;
      break;
    case 0x000000a4:
      message = "PIN code blocked";
      code = 0x000000a4;
      break;
    case 0x000000b3:
      message = "Invalid session descriptor passed to functions";
      code = 0x000000b3;
      break;
    case 0x000000b4:
      message = "Parallel session cannot be opened";
      code = 0x000000b4;
      break;
    case 0x000000b6:
      message = "Session with the same device is already open";
      code = 0x000000b6;
      break;
    case 0x000000b7:
      message = "Session is open for read-only. Mode change is impossible";
      code = 0x000000b7;
      break;
    case 0x000000b8:
      message = "Session is open for read/write. Opening a read-only session is impossible";
      code = 0x000000b8;
      break;
    case 0x000000c0:
      message = "Invalid digital signature value";
      code = 0x000000c0;
      break;
    case 0x000000d0:
      message = "Insufficient attributes provided to create an object";
      code = 0x000000d0;
      break;
    case 0x000000e0:
      message = "The device was disconnected during function execution";
      code = 0x000000e0;
      break;
    case 0x000000e2:
      message = "Device is not writable";
      code = 0x000000e2;
      break;
    case 0x00000100:
      message = "User has already entered the PIN code";
      code = 0x00000100;
      break;
    case 0x00000101:
      message = "Function cannot be executed in guest mode";
      code = 0x00000101;
      break;
    case 0x00000102:
      message = "Initial PIN code is not set";
      code = 0x00000102;
      break;
    case 0x00000103:
      message = "Function cannot be executed in the current device mode";
      code = 0x00000103;
      break;
    case 0x00000104:
      message = "Switching from administrator mode to user mode or vice versa is impossible";
      code = 0x00000104;
      break;
    case 0x00000150:
      message = "The buffer size specified is insufficient to store the function results";
      code = 0x00000150;
      break;
    case 0x00000170:
      message = "The requested object is not available for reading";
      code = 0x00000170;
      break;
    case 0x00000190:
      message =
        "Execution of the function without initializing the PKCS#11 Unified Library (Cryptoki library) is impossible";
      code = 0x00000190;
      break;
    case 0x00000191:
      message = "Attempt to reinitialize the Cryptoki library";
      code = 0x00000191;
      break;
    case 0x00000200:
      message = "User canceled the operation";
      code = 0x00000200;
      break;
    case 0x00001000:
      message = "The state parameter value differs from STATE_TOKEN_BINDED (1)";
      code = 0x00001000;
      break;
    case 0x00001001:
      message = "The state parameter value differs from STATE_TOKEN_BINDED (0)";
      code = 0x00001001;
      break;
    case 0x00001002:
      message = "The state parameter value is STATE_TOKEN_BINDED (0)";
      code = 0x00001002;
      break;
    case 0x00001003:
      message = "The state parameter value differs from STATE_TOKEN_BINDED (4)";
      code = 0x00001003;
      break;
    case 0x00001004:
      message = "The state parameter value differs from STATE_TOKEN_BINDED (2)";
      code = 0x00001004;
      break;
    case 0x00001005:
      message = "The state parameter value differs from STATE_TOKEN_BINDED (3)";
      code = 0x00001005;
      break;
    case 0x00001010:
      message = "Certificate not found";
      code = 0x00001010;
      break;
    case 0x00001011:
      message = "Public key not found in supported device memory";
      code = 0x00001011;
      break;
    case 0x00001012:
      message = "Server public key not found";
      code = 0x00001012;
      break;
    case 0x00001013:
      message = "Invalid server public key";
      code = 0x00001013;
      break;
    case 0x00001020:
      message = "Data presented for signature has zero length";
      code = 0x00001020;
      break;
    case 0x00001021:
      message = "Data presented for signature verification has zero length";
      code = 0x00001021;
      break;
    case 0x00001022:
      message = "Signature presented for verification has zero length";
      code = 0x00001022;
      break;
    case 0x00001025:
      message = "Incorrect parameters for cryptographic transformations according to GOST R 34.10-2001";
      code = 0x00001025;
      break;
    case 0x00001026:
      message = "Insufficient free memory in the supported device to perform the operation";
      code = 0x00001026;
      break;
    case 0x00001030:
      message = "Key length is not 64 bits";
      code = 0x00001030;
      break;
    case 0x00001031:
      message = "Certificate does not match the public key";
      code = 0x00001031;
      break;
    case 0x00001033:
      message = "Browser version check error";
      code = 0x00001033;
      break;
    case 0x00001034:
      message = "Unsupported browser version";
      code = 0x00001034;
      break;
    case 0x00001036:
      message = "Incorrect PIN code type specified";
      code = 0x00001036;
      break;
    case 0x00001037:
      message = "Entered values of the new PIN code are not identical";
      code = 0x00001037;
      break;
    case 0x00001038:
      message =
        "Administrator PIN code change is impossible because the state parameter value differs from STATE_TOKEN_BINDED (0)";
      code = 0x00001038;
      break;
    case 0x00001050:
      message = "Error generating data protection key transmitted between client and server";
      code = 0x00001050;
      break;
    case 0x00001052:
      message = "Error in the client-side cryptographic transformation execution software protection tool";
      code = 0x00001052;
      break;
    case 0x00001053:
      message = "Error at the beginning of the Handshake protocol execution";
      code = 0x00001053;
      break;
    case 0x00001054:
      message = "Error during Handshake protocol execution";
      code = 0x00001054;
      break;
    case 0x00001055:
      message = "Error preparing data for secure transmission";
      code = 0x00001055;
      break;
    case 0x00001056:
      message = "Error reading data to be transmitted securely";
      code = 0x00001056;
      break;
    case 0x00001057:
      message = "Error trying to read the certificate and public key from supported device memory";
      code = 0x00001057;
      break;
    case 0x00001058:
      message = "Error obtaining server public key";
      code = 0x00001058;
      break;
    case 0x00001070:
      message = "Failed to read the public key from the certificate";
      code = 0x00001070;
      break;
    case 0x00001071:
      message = "Failed to read the certificate authority name and serial number from the certificate";
      code = 0x00001071;
      break;
    case 0x80000011:
      message = "PIN code already set";
      code = 0x80000011;
      break;
    case 0x80000015:
      message = "Incorrect PUK code";
      code = 0x80000015;
      break;
    case 0x80000016:
      message = "Unable to unlock PIN code";
      code = 0x80000016;
      break;
    case 0x80000026:
      message = "Invalid characters in PUK code value";
      code = 0x80000026;
      break;
    case 0x8000002a:
      message = "Secure connection must be established to execute the command";
      code = 0x8000002a;
      break;
    case 0x8000002c:
      message = "The server public key was not found during the PKCS #7 signature verification on JaCarta-2 GOST";
      code = 0x8000002c;
      break;
    case 0x8000002d:
      message = "IKB not found";
      code = 0x8000002d;
      break;
    case 0x80000041:
      message = "jcverify utility not found";
      code = 0x80000041;
      break;
    case 0x80000042:
      message = "jcverify checksum file not found";
      code = 0x80000042;
      break;
    case 0x80000043:
      message = "IKB checksum file not found";
      code = 0x80000043;
      break;
    case 0x80000044:
      message = "Invalid jcverify utility checksum";
      code = 0x80000044;
      break;
    case 0x80000045:
      message = "Invalid IKB checksum";
      code = 0x80000045;
      break;
    case 0x80000046:
      message = "Error occurred while loading IKB. Required functions not found";
      code = 0x80000046;
      break;
    default:
      message = "Unknown error";
      code = -1;
      break;
  }

  return { code, message };
};
