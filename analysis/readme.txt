======= Data Pipeline ======
* Note on some data variables

A: Cell. Game side (Amazon dynamo db)
M: Cell. Mturk side (Mturk side)
D: Cell. Combined A and M
X: Cell. Action sequence
Xr: Cell. Reward sequence
Xc: Cell. Item count sequence
y_mach: Array. Mach score array
y_svo: Array. SVO score array

* Pipeline:
-> preprocess.m
—— Matching A and M ——

Here’s few cases:
1) turker did not finish game
2) turker did finish game but did not submit, A has data, M doesn’t
3) reward matched, but A side turker has used wrong id (instead of turker id, he/she used random name)
4) id matched, but M side turker has used the wrong reward (instead of reward, he/she used turker id)

Filtering: 1) and 2) will be filtered

—— Extracting questionnaire information ——

—— Extracting raw actions into X ——

—— Extract actual features, X, Xr ——
1) remove 10th action
2) replace action 25 with the actual items


-> features.m

