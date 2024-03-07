import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LocalStorageService } from '../modules/admin/services/local-storage.service';


export const loginGuard: CanActivateFn = () => {

  const _loclaStorageService = inject(LocalStorageService);

  if (_loclaStorageService.getItem('role')) {
    return true;
  } else {
    return false;
  }
};
