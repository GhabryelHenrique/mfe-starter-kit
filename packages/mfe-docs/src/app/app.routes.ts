import { Routes } from '@angular/router';
import { DocsLayoutComponent } from './layout/docs-layout/docs-layout.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { QuickStartComponent } from './pages/quick-start/quick-start.component';
import { ConceptFederationComponent } from './pages/concepts/federation/concept-federation.component';
import { ConceptSharedDepsComponent } from './pages/concepts/shared-deps/concept-shared-deps.component';
import { ConceptEventBusComponent } from './pages/concepts/event-bus/concept-event-bus.component';
import { ConceptErrorBoundaryComponent } from './pages/concepts/error-boundary/concept-error-boundary.component';
import { PackagesComponent } from './pages/packages/packages.component';
import { FaqComponent } from './pages/faq/faq.component';

export const routes: Routes = [
  {
    path: '',
    component: DocsLayoutComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'quick-start', component: QuickStartComponent },
      { path: 'concepts/federation', component: ConceptFederationComponent },
      { path: 'concepts/shared-deps', component: ConceptSharedDepsComponent },
      { path: 'concepts/event-bus', component: ConceptEventBusComponent },
      { path: 'concepts/error-boundary', component: ConceptErrorBoundaryComponent },
      { path: 'packages', component: PackagesComponent },
      { path: 'faq', component: FaqComponent },
    ],
  },
];
