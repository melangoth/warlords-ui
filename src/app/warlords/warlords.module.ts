import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorldComponent} from './world/world.component';
import {FormsModule} from '@angular/forms';
import {UnitWidgetComponent} from './widgets/unit-widget/unit-widget.component';


@NgModule({
  declarations: [
    WorldComponent,
    UnitWidgetComponent
  ],
    imports: [
        CommonModule,
        FormsModule
    ]
})
export class WarlordsModule {
}
