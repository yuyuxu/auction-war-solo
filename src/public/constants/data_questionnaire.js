/** Constants for questionnaire. */
/** Instrument data [List]
  data[0]: id/name of the instrument
  data[1]: [descriptions of the instrument/asset path]
  data[2]: statements
  data[3]: questions, each question contains row * columns cell,
            each cell contains a list of questions, e.g.
            [
             [cell11, cell12],
             [cell21, cell22] (question 1)
            ]
            where cell11 is a data point
  data[4]: [choice text]
  data[5]: how to align the questions of each questionnaire, "left"/"right" etc.
*/

// Mach-IV Test
const MachInstrument = [
  // 0
  "Test One: Answer all the following questions",
  // 1
  [],
  // 2
  "Statements",
  // 3
  [
   ["Never tell anyone the real reason you did something " +
      "unless it is useful to do so."],
   ["The best way to handle people is to tell them " +
      "what they want to hear."],
   ["One should take action only when sure it is morally right"],
   ["Most people are basically good and kind."],
   ["It is safest to assume that all people have a vicious streak and " +
     "it will come out when they are given a chance."],
   ["Honesty is the best policy in all cases."],
   ["There is no excuse for lying to someone else."],
   ["Generally speaking, people won't work hard unless " +
     "they're forced to do so."],
   ["All in all, it is better to be humble and honest than to be " +
     "important and dishonest."],
   ["When you ask someone to do something for you, it is best to " +
     "give the real reasons for wanting it rather than " +
     "giving reasons which carry more weight."],
   ["Most people who get ahead in the world lead clean, moral lives."],
   ["Anyone who completely trusts anyone else is asking for trouble."],
   ["The biggest difference between most criminals and other people " +
     "is that the criminals are stupid enough to get caught."],
   ["Most people are brave."],
   ["It is wise to flatter important people."],
   ["It is possible to be good in all respects."],
   ["P.T. Barnum was wrong when he said that there's a sucker born " +
     "every minute."],
   ["It is hard to get ahead without cutting corners here and there."],
   ["People suffering from incurable diseases should have the choice of " +
     "being put painlessly to death."],
   ["Most people forget more easily the death of their parents than " +
     "the loss of their property."],
  ],
  // 4
  ["strongly disagree",
   "disagree",
   "neutral",
   "agree",
   "strongly agree"],
  // 5
  "left",
];

// SVO Test
const SVOInstrument = [
  // 0
  "Test Two: Answer all the following questions",
  // 1
  [
   ["Imagine that you have been randomly paired with another person, " +
    "whom you do not know and will not meet or communicate with " +
    "in the future. Both of you are making choices among three options " +
    "(A, B, C) by choosing one of the options. Each option represents " +
    "a different point allocation to yourself and another person."],
   ["Therefore, your choices determine the number of points you receive " +
    "and the number of points the other person receives. Also, the other " +
    "person's choices determine the number of points you receive and the " +
    "number of points s/he receives. The more points you get, the better off " +
    "you are. Same, the more points the other person gets, the better off " +
    "s/he will be. For example:"],
    ["\n"],
    ["You get (A: 50, B: 60, C: 40)"],
    ["Other gets (A: 50, B: 30, C: 0)"],
    ["\n"],
    ["The first row (You get) represents number of points that you will " +
     "receive, in this case, 50, 60, 40 points for option (A, B, C) " +
     "respectively. The second row (Other gets) represents number of points " +
     "that others will get, in this case 50, 30, 0 for option (A, B, C). "],
   ["Please keep in mind that there are no right or wrong answers, " +
    "choose the option that you find most attractive. Also, remember that " +
    "the points are valuable, the more you get, the better for you. " +
    "Likewise, the more points the other person gets, the better for " +
    "him/her."],
  ],
  // 2
  "Situations",
  // 3
  [
   ["You get (A: 480, B: 540, C: 480)",
    "Other gets (A: 80, B: 280, C: 480)"],
   ["You get (A: 560, B: 500, C: 500)",
    "Other gets (A: 300, B: 500, C: 100)"],
   ["You get (A: 520, B: 520, C: 580)",
    "Other gets (A: 520, B: 120, C: 320)"],
   ["You gets (A: 510, B: 560, C: 510)",
    "Other gets (A: 510, B: 300, C: 110)"],
   ["You get (A: 550, B: 500, C: 500)",
    "Other gets (A: 300, B: 100, C: 500)"],
   ["You get (A: 480, B: 490, C: 540)",
    "Other gets (A: 100, B: 490, C: 300)"],
   ["You get (A: 500, B: 560, C: 490)",
    "Other gets (A: 100, B: 300, C: 490)"],
   ["You get (A: 560, B: 500, C: 490)",
    "Other gets (A: 300, B: 500, C: 90)"],
   ["You get (A: 500, B: 500, C: 570)",
    "Other gets (A: 500, B: 100, C: 300)"],
   ["You get (A: 480, B: 520, C: 480)",
    "Other gets (A: 480, B: 300, C: 180)"],
   ["You get (A: 470, B: 330, C: 440)",
    "Other gets (A: 300, B: 110, C: 440)"],
   ["You get (A: 460, B: 510, C: 530)",
    "Other gets (A: 100, B: 510, C: 320)"],
  ],
  // 4
  ["A", "B", "C"],
  // 5
  "right",
];
