import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LocalStorageService } from '../modules/admin/services/local-storage.service';


export const isAdminGuard: CanActivateFn = () => {

  const _loclaStorageService = inject(LocalStorageService);

  if (_loclaStorageService.getItem('role') === 'ROLE_ADMIN') {
    return true;
  } else {
    return false;
  }
};
