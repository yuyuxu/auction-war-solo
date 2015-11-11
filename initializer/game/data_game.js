// game page
const ImageItems = ['./images/item1.png',
                    './images/item2.png',
                    './images/item3.png'];
const ImageBackground = './images/wood_table.jpg';

// timer
const SimulationFPS = 30;

// game scene effects
// note: speed unit is milliseconds
const EffectSelectScale = 1.1;
const EffectMoveSpeed = 100;
const EffectDefaultWait = 50;
const EffectDefaultTransition = 50;
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