/**
 * @jest-environment jsdom
 */

import Swal from 'sweetalert2';
// static/__tests__/scripts.test.js
import { getCookie, showError, showSuccess } from '../js/scripts';

// static/__tests__/scripts.test.js
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));




// Load your script (assuming it's already in the same folder or imported)
import '../js/scripts.js';

describe('getCookie', () => {
  beforeEach(() => {
    // Reset cookies before each test
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  it('should return the value of the specified cookie', () => {
    document.cookie = 'csrftoken=testtoken123';
    expect(getCookie('csrftoken')).toBe('testtoken123');
  });

  it('should return null if the cookie does not exist', () => {
    document.cookie = 'someOtherCookie=value';
    expect(getCookie('csrftoken')).toBeNull();
  });
});

describe('SweetAlert Helpers', () => {
  it('should call Swal.fire with error settings in showError()', () => {
    showError('Test error message');
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Error',
      text: 'Test error message',
    });
  });

  it('should call Swal.fire with default error if no message is passed', () => {
    showError();
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'error',
      title: 'Error',
      text: 'Something went wrong',
    });
  });

  it('should call Swal.fire with success settings in showSuccess()', () => {
    showSuccess('Upload complete!', 'Success!');
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'success',
      title: 'Success!',
      text: 'Upload complete!',
      timer: 1500,
      showConfirmButton: false,
    });
  });

  it('should call Swal.fire with default success if no arguments are passed', () => {
    showSuccess();
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'success',
      title: 'Success',
      text: 'Success',
      timer: 1500,
      showConfirmButton: false,
    });
  });
});
