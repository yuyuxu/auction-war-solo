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
*/

// Mach-IV Test
const MachInstrument = [
  // 0
  "Test One",
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
];

// SVO Test
const SVOInstrument = [
  // 0
  "Test Two",
  // 1
  [
   ["Imagine that you have been randomly paired with another person, " +
    "whom you do not know and will not meet or communicate " +
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
    ["You get (50, 60, 40)"],
    ["Other gets (50, 30, 0)"],
    ["\n"],
    ["The first row (You get) represents number of points that you will " +
     "receive, in this case, (50, 60, 40) points for option (A, B, C) " +
     "respectively. The second row (Other gets) represents number of points " +
     "that others will get, in this case (50, 30, 0) for option (A, B, C). "],
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
   ["You get (480, 540, 480)",
    "Other gets (80, 280, 480)"],
   ["You get (560, 500, 500)",
    "Other gets (300, 500, 100)"],
   ["You get (520, 520, 580)",
    "Other gets (520, 120, 320)"],
   ["You gets (510, 560, 510)",
    "Other gets (510, 300, 110)"],
   ["You get (550, 500, 500)",
    "Other gets (300, 100, 500)"],
   ["You get (480, 490, 540)",
    "Other gets (100, 490, 300)"],
   ["You get (500, 560, 490)",
    "Other gets (100, 300, 490)"],
   ["You get (560, 500, 490)",
    "Other gets (300, 500, 90)"],
   ["You get (500, 500, 570)",
    "Other gets (500, 100, 300)"],
   ["You get (480, 520, 480)",
    "Other gets (480, 300, 180)"],
   ["You get (470, 330, 440)",
    "Other gets (300, 110, 440)"],
   ["You get (460, 510, 530)",
    "Other gets (100, 510, 320)"],
  ],
  // 4
  ["A", "B", "C"],
];
