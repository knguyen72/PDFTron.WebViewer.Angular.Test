import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { LineToLineMappedSource } from 'webpack-sources';

declare const PDFTron: any;
declare const CoreControls: any;
declare let licenseKey: string;

@Component({
  selector: 'app-webviewer',
  template: '<div #viewer></div>',
  styles: ['div { width: 100%; height: 100%; }']
})
export class WebViewerComponent implements AfterViewInit {
  @ViewChild('viewer') viewer: ElementRef;
  myWebViewer: any;
  pdfWorker: any;

  ngAfterViewInit(): void {

    CoreControls.setWorkerPath('../lib/core');

    CoreControls.getDefaultBackendType().then((backend: any) => {
      var workerHandler = {};
      var workerTransportPromise = {
        pdf: CoreControls.initPDFWorkerTransports(backend, workerHandler, atob(licenseKey)),
        office: CoreControls.initOfficeWorkerTransports(backend, workerHandler, atob(licenseKey))
      };

      this.myWebViewer = new PDFTron.WebViewer({
        path: '../lib',
        l: atob(licenseKey),
        initialDoc: '../files/test-empty.docx',
        workerTransportPromise: workerTransportPromise,
        preloadPDFWorker: false
      }, this.viewer.nativeElement);
    });
  }

  getInstance(): any {
    return this.myWebViewer.getInstance();
  }

  getWindow(): any {
    return this.viewer.nativeElement.querySelector('iframe').contentWindow;
  }

  getElement(): any {
    return this.viewer.nativeElement;
  }
}
