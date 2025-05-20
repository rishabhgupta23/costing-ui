import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class CustomIconRegistryService extends MatIconRegistry {

  constructor(httpBackend: HttpBackend, sanitizer: DomSanitizer) {
    super(new HttpClient(httpBackend), sanitizer, document, null as any);
   }
}
