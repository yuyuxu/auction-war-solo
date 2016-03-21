/** Constants for game. */
// game page
const ImageItems = ['./images/item1.png',
                    './images/item2.png',
                    './images/item3.png'];
const ImageBackground = './images/wood_table.jpg';

// timer
const SimulationFPS = 30;

// game scene effects
// note: speed unit is milliseconds
const EffectDefaultWait = 10;
const EffectDefaultTransparency = 0.5;
const EffectNoDots = 15;

// game scene layout
const LayoutStatusBarY = 0;
const LayoutPopupW = 500;
const LayoutPopupH = 30;
const LayoutNoGridX = 3;
const LayoutNoGridY = 3;
const LayoutSidePlayer = 2;
const LayoutSideNeutral = 1;
const LayoutSideOpponent = 0;

// game player type
// placeholder serves as a remote inteface, other types are all local
const TypePlayer = 0;
const TypeScripted = 1;
const TypeSocket = 2;

// game type
const HumanVsScripted = 0;
const HumanVsSocket = 1;

// game starting player
const StartPlayer = TypeScripted;

// game scripted player related
// note: time unit is second
// const WaitingTimeMatchMaking = 9.2176;
// const WaitingTimeLoadGame = 3.8315;
// const WaitingTimeTurns = [19.5065, 21.5139, 17.8689, 10.4285, 17.8657,
//                           12.0542, 18.4726, 10.3820, 13.3231];
// testing
const WaitingTimeMatchMaking = 1;
const WaitingTimeLoadGame = 1;
const WaitingTimeTurns = [1, 1, 1, 1, 1,
                          1, 1, 1, 1];

// 0: painting, 1: lamp, 2: record
const ItemValue = {
  0: 0.1,
  1: 2,
  2: 4.1,
}

const ScriptConcession = [
  // turn 1
  {0: [LayoutSidePlayer],
   1: [LayoutSideOpponent, LayoutSidePlayer],
   2: [LayoutSideOpponent, LayoutSideOpponent, LayoutSideOpponent]},
  // turn 2
  {0: [LayoutSidePlayer],
   1: [LayoutSidePlayer, LayoutSidePlayer],
   2: [LayoutSideOpponent, LayoutSideOpponent, LayoutSideOpponent]},
  // turn 3
  {0: [LayoutSidePlayer],
   1: [LayoutSideOpponent, LayoutSideOpponent],
   2: [LayoutSidePlayer, LayoutSideOpponent, LayoutSideOpponent]},
  // turn 4
  {0: [LayoutSideOpponent],
   1: [LayoutSidePlayer, LayoutSideOpponent],
   2: [LayoutSidePlayer, LayoutSideOpponent, LayoutSideOpponent]},
  // turn 5
  {0: [LayoutSidePlayer],
   1: [LayoutSidePlayer, LayoutSideOpponent],
   2: [LayoutSidePlayer, LayoutSideOpponent, LayoutSideOpponent]},
  // turn 6
  {0: [LayoutSideOpponent],
   1: [LayoutSideOpponent, LayoutSideOpponent],
   2: [LayoutSidePlayer, LayoutSidePlayer, LayoutSideOpponent]},
];

const ExtraNumTurns = 3;
