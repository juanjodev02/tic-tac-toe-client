import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './components/game/game.component';
import { NebularModule } from '../nebular/nebular.module';
import { BoardComponent } from './components/board/board.component';

@NgModule({
  declarations: [GameComponent, BoardComponent],
  imports: [CommonModule, GameRoutingModule, NebularModule],
})
export class GameModule {}
